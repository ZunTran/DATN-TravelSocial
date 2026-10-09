import 'dotenv/config';

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import * as cheerio from 'cheerio';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

type CategoryName = 'Ẩm thực' | 'Du lịch' | 'Địa điểm' | 'Mountain';

type DbLocation = {
  id: string;
  name: string;
  address: string | null;
  latitude: unknown;
  longitude: unknown;
  province: string | null;
  description: string | null;
  estimated_cost: unknown;
  opening_hours: string | null;
  source: string | null;
  source_url: string | null;
  category_id: string | null;
  category: { id: string; name: string } | null;
};

type EnrichedLocation = {
  id: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  province: string | null;
  description: string | null;
  estimated_cost: number | null;
  opening_hours: string | null;
  source: string | null;
  source_url: string | null;
  category: CategoryName | null;
  enrichment: {
    fantasticity: boolean;
    officialWebsite: boolean;
    matchScore: number | null;
    matchType: 'exact' | 'alias' | 'fuzzy' | 'manual' | 'none';
    matchedSourceName: string | null;
    fields: string[];
  };
};

type FantasticityRecord = {
  name: string;
  address: string | null;
  opening_hours: string | null;
  estimated_cost: number | null;
  description: string | null;
  source_url: string;
  latitude: number | null;
  longitude: number | null;
};

type MatchResult = {
  record: FantasticityRecord | null;
  score: number;
  matchType: 'exact' | 'alias' | 'fuzzy' | 'none';
};

type OfficialWebsiteData = {
  description: string | null;
  address: string | null;
  opening_hours: string | null;
  estimated_cost: number | null;
};

type OSMEnrichmentRecord = {
  name: string;
  address: string | null;
  description: string | null;
  opening_hours: string | null;
  estimated_cost: number | null;
  source_url: string | null;
  latitude: number | null;
  longitude: number | null;
};

type ManualOverride = Partial<{
  aliases: string[];
  address: string;
  description: string;
  opening_hours: string;
  estimated_cost: number;
  source_url: string;
  source: string;
}>;

const OUTPUT_DIR = resolve(process.cwd(), 'tools/location-data/clean');
const OUTPUT_FILE = resolve(OUTPUT_DIR, 'enriched.json');
const REVIEW_FILE = resolve(OUTPUT_DIR, 'enrichment-review.json');
const FAILED_FILE = resolve(OUTPUT_DIR, 'enrichment-failed.json');
const MANUAL_FILE = resolve(OUTPUT_DIR, 'manual-enrichment.json');

const FANTASTICITY_SOURCES = [
  'https://danangfantasticity.com/en/plan-your-da-nang-journey-2026-updated-admission-prices-for-attractions-and-tourist-sites',
  'https://danangfantasticity.com/en/tin-tuc/diem-danh-cac-san-pham-du-lich-moi-tai-da-nang-2026',
  'https://danangfantasticity.com/en/da-nang-your-way-there-is-no-one-itinerary-for-everyone',
  'https://danangfantasticity.com/en/da-nang-a-premier-filming-destination-with-unique-landscapes',
  // Category/listing pages are important because the portal's detail pages are not
  // all linked from the four articles above.
  'https://danangfantasticity.com/en/category/stay?id=82',
  'https://danangfantasticity.com/en/category/eat-amp-drink?id=13114',
  'https://danangfantasticity.com/en/category/giai-tri-thu-gian?id=12917',
  'https://danangfantasticity.com/en/category/nhung-dieu-can-biet?id=1070',
];

const FANTASTICITY_HOST = 'danangfantasticity.com';
const REQUEST_DELAY_MS = 850;
const FETCH_TIMEOUT_MS = 20000;
const MAX_FETCH_RETRIES = 3;
const MAX_FANTASTICITY_DETAIL_PAGES = 500;
const MAX_FANTASTICITY_SITEMAP_URLS = 12000;
const MAX_FANTASTICITY_SITEMAPS = 40;
const MAX_CATEGORY_PAGES = 8;
const MAX_OFFICIAL_WEBSITES = 1000;

const RAW_OSM_FILE = resolve(process.cwd(), 'tools/location-data/raw/osm-danang.json');

const AUTO_MATCH_THRESHOLD = 0.78;
const HIGH_CONFIDENCE_THRESHOLD = 0.90;
const REVIEW_THRESHOLD = 0.62;

const USER_AGENT = 'TravelSocial-DaNang-AI/1.0 (local development; contact: developer@example.com)';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const htmlCache = new Map<string, string | null>();
const officialWebsiteCache = new Map<string, OfficialWebsiteData | null>();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanText(value: string | null | undefined): string | null {
  if (!value) return null;
  const result = value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  return result || null;
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(the|a|an|da nang|danang)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const GENERIC_MATCH_WORDS = new Set([
  'tourist', 'tourism', 'area', 'destination', 'site', 'attraction', 'scenic',
  'scenic area', 'park', 'museum', 'resort', 'hotel', 'restaurant', 'cafe',
  'coffee', 'bar', 'beach', 'mountain', 'mountains', 'peninsula', 'complex',
  'center', 'centre', 'city', 'danang', 'da', 'nang', 'place', 'places',
  'point', 'viewpoint', 'pagoda', 'temple', 'church', 'gallery', 'village',
]);

function normalizeForMatching(value: string): string {
  const base = normalizeText(value);
  return base
    .split(' ')
    .filter(Boolean)
    .filter((token) => !GENERIC_MATCH_WORDS.has(token))
    .join(' ')
    .trim();
}

function toNumber(value: unknown): number | null {
  if (value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

const NAME_ALIASES: Record<string, string[]> = {
  'ngu hanh son': ['marble mountains', 'marble mountain', 'ngu hanh son', 'marble mountains scenic area'],
  'marble mountains': ['ngu hanh son', 'marble mountains', 'marble mountain'],
  'marble mountains museum': ['marble mountains', 'ngu hanh son'],
  'thuy son': ['thuy son peak', 'thuy son mountain', 'marble mountains'],
  'my son': ['my son sanctuary', 'my son holy land', 'my son'],
  'my son sanctuary': ['my son', 'my son holy land'],
  'ba na hills': ['sun world ba na hills', 'ba na hills', 'ba na', 'sun world ba na'],
  'ba na': ['sun world ba na hills', 'ba na hills', 'ba na'],
  'son tra': ['son tra peninsula', 'son tra mountain', 'son tra nature reserve', 'son tra'],
  'son tra peninsula': ['son tra', 'son tra peninsula', 'son tra mountain'],
  'ban dao son tra': ['son tra peninsula', 'son tra', 'son tra mountain'],
  'bao tang cham': ['museum of cham sculpture', 'da nang museum of cham sculpture', 'cham museum'],
  'bao tang dieu khac cham': ['museum of cham sculpture', 'da nang museum of cham sculpture', 'cham museum'],
  'cham museum': ['museum of cham sculpture', 'da nang museum of cham sculpture', 'bao tang cham'],
  'cau rong': ['dragon bridge', 'da nang dragon bridge'],
  'dragon bridge': ['cau rong', 'dragon bridge', 'da nang dragon bridge'],
  'cau song han': ['han river bridge', 'han bridge'],
  'han river bridge': ['cau song han', 'han bridge'],
  'cau han': ['han river bridge', 'han bridge'],
  'bien my khe': ['my khe beach', 'my khe'],
  'my khe beach': ['bien my khe', 'my khe'],
  'ba nao hills': ['sun world ba na hills', 'ba na hills'],
  'ngu hanh son mountain': ['marble mountains', 'marble mountain'],
  'dong giang': ['dong giang heaven gate', 'heaven gate dong giang'],
  'dong giang heaven gate': ['dong giang', 'heaven gate dong giang'],
  'than tai': ['than tai hot spring park', 'nui than tai', 'hot springs park'],
  'cong vien suoi khoang nong than tai': ['than tai hot spring park', 'nui than tai'],
  'mikazuki': ['mikazuki 365', 'mikazuki 365 water park', 'mikazuki water park'],
  'golden bridge': ['golden bridge', 'hands of god bridge'],
  'cau vang': ['golden bridge', 'hands of god bridge'],
  'linh ung pagoda': ['linh ung pagoda', 'linh ung bai but pagoda', 'linh ung son tra'],
  'chua linh ung': ['linh ung pagoda', 'linh ung bai but pagoda'],
  'hoi an': ['hoi an ancient town', 'hoi an ancient city'],
};

const MANUAL_NAME_ALIASES: Record<string, string[]> = {
  ...NAME_ALIASES,
};

function parseNumberString(raw: string): number | null {
  let value = raw.trim().replace(/\s/g, '');
  if (!value) return null;

  if (value.includes(',') && value.includes('.')) {
    const lastComma = value.lastIndexOf(',');
    const lastDot = value.lastIndexOf('.');
    const decimalSeparator = lastComma > lastDot ? ',' : '.';
    const fractionalLength = value.length - Math.max(lastComma, lastDot) - 1;
    if (fractionalLength === 1 || fractionalLength === 2) {
      value = value.replace(decimalSeparator, '.').replace(/[.,](?=.*[.,])/g, '');
    } else {
      value = value.replace(/[.,]/g, '');
    }
  } else if (value.includes(',')) {
    const parts = value.split(',');
    value = parts.at(-1)?.length === 3 ? value.replace(/,/g, '') : value.replace(',', '.');
  } else if (value.includes('.')) {
    const parts = value.split('.');
    value = parts.at(-1)?.length === 3 ? value.replace(/\./g, '') : value;
  }

  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function extractPrices(text: string): number[] {
  if (!text) return [];
  const prices: number[] = [];
  const normalized = text.replace(/\s+/g, ' ');

  for (const match of normalized.matchAll(/([\d.,]+)\s*(?:VND|VNĐ|đ|₫)\b/gi)) {
    const n = parseNumberString(match[1] ?? '');
    if (n != null && n >= 1000 && n <= 100000000) prices.push(n);
  }

  for (const match of normalized.matchAll(/(?:VND|VNĐ|đ|₫)\s*([\d.,]+)/gi)) {
    const n = parseNumberString(match[1] ?? '');
    if (n != null && n >= 1000 && n <= 100000000) prices.push(n);
  }

  for (const match of normalized.matchAll(/(\d{2,3}(?:[.,]\d{3})+)\s*(?:per|\/|a)?\s*(?:person|adult|child|person\/entry)/gi)) {
    const n = parseNumberString(match[1] ?? '');
    if (n != null && n >= 1000 && n <= 100000000) prices.push(n);
  }

  if (/\bfree(?:\s+admission|\s+entry)?\b/i.test(normalized) || /\bmi[êê]n ph[ií]\b/i.test(normalized)) {
    prices.push(0);
  }

  return [...new Set(prices)];
}

function extractCostFromText(text: string): number | null {
  const prices = extractPrices(text);
  if (!prices.length) return null;
  const paid = prices.filter((n) => n > 0);
  return paid[0] ?? 0;
}

function extractOpeningHours(text: string): string | null {
  if (!text) return null;
  const patterns = [
    /(?:opening hours|opening time|hours|open daily|giờ mở cửa|thời gian mở cửa)\s*[:：-]?\s*([^.;\n]{3,180})/i,
    /\b\d{1,2}(?::|h)\d{2}\s*[–—-]\s*\d{1,2}(?::|h)\d{2}\b/i,
    /\b\d{1,2}\s*(?:am|pm)\s*[–—-]\s*\d{1,2}\s*(?:am|pm)\b/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return cleanText(match[1]);
    if (match?.[0] && /\d/.test(match[0])) return cleanText(match[0]);
  }
  return null;
}

function extractAddress(text: string): string | null {
  if (!text) return null;
  const patterns = [
    /(?:địa chỉ|address|location|located at)\s*[:：-]?\s*([^.!?\n]{8,300})/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const value = cleanText(match[1]);
      if (value && !/^https?:/i.test(value)) return value;
    }
  }
  return null;
}

function extractDescriptionFromBlock(text: string): string | null {
  const cleaned = cleanText(text);
  if (!cleaned || cleaned.length < 80) return null;
  const result = cleaned
    .replace(/^(address|địa chỉ|opening hours|opening time|giờ mở cửa)\s*[:：-]\s*/i, '')
    .trim();
  if (result.length < 80) return null;
  return result.slice(0, 900);
}

async function loadOSMEnrichmentRecords(): Promise<OSMEnrichmentRecord[]> {
  try {
    const raw = await readFile(RAW_OSM_FILE, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    const elements = Array.isArray((parsed as any)?.elements)
      ? (parsed as any).elements
      : Array.isArray(parsed)
        ? parsed
        : [];

    const records: OSMEnrichmentRecord[] = [];
    for (const element of elements) {
      if (!element || typeof element !== 'object') continue;
      const e = element as Record<string, any>;
      const tags = e.tags && typeof e.tags === 'object' ? e.tags as Record<string, any> : {};
      const name = cleanText(tags.name ?? tags['name:en'] ?? tags['name:vi']);
      if (!name) continue;

      const latitude = toNumber(e.lat ?? e.center?.lat);
      const longitude = toNumber(e.lon ?? e.center?.lon);
      const addressParts = [
        tags['addr:housenumber'],
        tags['addr:street'],
        tags['addr:suburb'],
        tags['addr:district'],
        tags['addr:city'],
      ].filter((v: unknown): v is string => typeof v === 'string' && v.trim().length > 0);

      const address = addressParts.length ? cleanText(addressParts.join(', ')) : null;
      const description = cleanText(tags.description ?? tags['description:en'] ?? tags['description:vi']);
      const openingHours = cleanText(tags.opening_hours ?? tags.hours);
      const sourceUrl = cleanText(tags.website ?? tags['contact:website'] ?? tags.url);
      const priceText = cleanText(tags.fee ?? tags.charge ?? tags.price);
      const estimatedCost = priceText ? extractCostFromText(priceText) : null;

      if (!address && !description && !openingHours && estimatedCost == null && !sourceUrl) continue;
      records.push({ name, address, description, opening_hours: openingHours, estimated_cost: estimatedCost, source_url: sourceUrl, latitude, longitude });
    }

    console.log(`OSM enrichment records: ${records.length}`);
    return records;
  } catch (error) {
    console.warn(`OSM enrichment source unavailable: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

function chooseOSMEnrichmentMatch(location: DbLocation, records: OSMEnrichmentRecord[]): OSMEnrichmentRecord | null {
  let best: OSMEnrichmentRecord | null = null;
  let bestScore = 0;
  const locLat = toNumber(location.latitude);
  const locLon = toNumber(location.longitude);

  for (const record of records) {
    const name = calculateNameScore(location.name, record.name).score;
    if (name < 0.75) continue;

    let score = name;
    if (locLat != null && locLon != null && record.latitude != null && record.longitude != null) {
      const distance = haversineDistanceKm(locLat, locLon, record.latitude, record.longitude);
      if (distance <= 0.05) score = name * 0.75 + 1 * 0.25;
      else if (distance <= 0.25) score = name * 0.85 + 0.95 * 0.15;
      else if (distance <= 1) score = name * 0.9 + 0.8 * 0.1;
      else if (distance > 3) score *= 0.75;
    }

    if (score > bestScore) {
      bestScore = score;
      best = record;
    }
  }

  return bestScore >= 0.78 ? best : null;
}

function levenshtein(a: string, b: string): number {
  const left = normalizeForMatching(a);
  const right = normalizeForMatching(b);
  if (left === right) return 0;
  if (!left) return right.length;
  if (!right) return left.length;

  let previous = Array.from({ length: right.length + 1 }, (_, i) => i);
  let current = new Array<number>(right.length + 1);

  for (let i = 1; i <= left.length; i++) {
    current[0] = i;
    for (let j = 1; j <= right.length; j++) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      current[j] = Math.min(current[j - 1]! + 1, previous[j]! + 1, previous[j - 1]! + cost);
    }
    [previous, current] = [current, previous];
  }
  return previous[right.length]!;
}

function characterSimilarity(a: string, b: string): number {
  const left = normalizeForMatching(a);
  const right = normalizeForMatching(b);
  if (!left || !right) return 0;
  const max = Math.max(left.length, right.length);
  return max ? 1 - levenshtein(left, right) / max : 0;
}

function tokenSimilarity(a: string, b: string): number {
  const left = normalizeForMatching(a);
  const right = normalizeForMatching(b);
  if (!left || !right) return 0;
  if (left === right) return 1;
  if (left.includes(right) || right.includes(left)) return 0.94;

  const leftTokens = new Set(left.split(' ').filter(Boolean));
  const rightTokens = new Set(right.split(' ').filter(Boolean));
  let intersection = 0;
  for (const token of leftTokens) if (rightTokens.has(token)) intersection++;
  const union = new Set([...leftTokens, ...rightTokens]).size;
  return union ? intersection / union : 0;
}

function aliasMatch(locationName: string, sourceName: string): boolean {
  const location = normalizeForMatching(locationName);
  const source = normalizeForMatching(sourceName);
  if (!location || !source) return false;

  const aliases = [
    ...(MANUAL_NAME_ALIASES[location] ?? []),
    ...(NAME_ALIASES[normalizeText(locationName)] ?? []),
  ];

  return aliases.some((alias) => {
    const a = normalizeForMatching(alias);
    return a && (a === source || a.includes(source) || source.includes(a));
  });
}

function calculateNameScore(locationName: string, sourceName: string) {
  const location = normalizeForMatching(locationName);
  const source = normalizeForMatching(sourceName);
  if (location && location === source) return { score: 1, type: 'exact' as const };
  if (aliasMatch(locationName, sourceName)) return { score: 0.98, type: 'alias' as const };

  const token = tokenSimilarity(locationName, sourceName);
  const character = characterSimilarity(locationName, sourceName);

  let score = token * 0.65 + character * 0.35;
  if (location && source && (location.includes(source) || source.includes(location))) {
    score = Math.max(score, 0.90);
  }

  return { score, type: 'fuzzy' as const };
}

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function geoScore(location: DbLocation, record: FantasticityRecord): number | null {
  const lat1 = toNumber(location.latitude);
  const lon1 = toNumber(location.longitude);
  if (lat1 == null || lon1 == null || record.latitude == null || record.longitude == null) return null;

  const distance = haversineDistanceKm(lat1, lon1, record.latitude, record.longitude);
  if (distance <= 0.5) return 1;
  if (distance <= 2) return 0.9;
  if (distance <= 5) return 0.7;
  if (distance <= 10) return 0.4;
  return 0.1;
}

function calculateFinalScore(location: DbLocation, record: FantasticityRecord) {
  const name = calculateNameScore(location.name, record.name);
  const geo = geoScore(location, record);
  if (geo == null) return { score: name.score, type: name.type };
  return { score: name.score * 0.82 + geo * 0.18, type: name.type };
}

function isTourismCategory(category: string | null): boolean {
  return category === 'Du lịch' || category === 'Địa điểm' || category === 'Mountain';
}

function chooseFantasticityMatch(location: DbLocation, records: FantasticityRecord[]): MatchResult {
  if (!isTourismCategory(location.category?.name ?? null)) {
    return { record: null, score: 0, matchType: 'none' };
  }

  let best: FantasticityRecord | null = null;
  let bestScore = 0;
  let bestType: MatchResult['matchType'] = 'none';

  for (const record of records) {
    const result = calculateFinalScore(location, record);
    if (result.score > bestScore) {
      bestScore = result.score;
      best = record;
      bestType = result.type;
    }
  }

  if (!best || bestScore < AUTO_MATCH_THRESHOLD) {
    return { record: null, score: bestScore, matchType: 'none' };
  }
  return { record: best, score: bestScore, matchType: bestType };
}

function isProbablyFantasticityDetailUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== FANTASTICITY_HOST && !parsed.hostname.endsWith(`.${FANTASTICITY_HOST}`)) return false;
    const path = parsed.pathname.toLowerCase();
    if (!path.startsWith('/en/')) return false;
    if (/\.(jpg|jpeg|png|webp|gif|pdf|xml)$/i.test(path)) return false;
    if (/\/(tag|tags|category|categories|author|authors|search|page|feed|wp-|cart|login|register)\b/i.test(path)) return false;
    return true;
  } catch {
    return false;
  }
}

function scoreFantasticityUrl(url: string): number {
  const path = url.toLowerCase();
  let score = 0;
  const strong = ['attraction', 'destination', 'see-and-do', 'see-and-do', 'culture', 'nature', 'beach', 'mountain', 'museum', 'pagoda', 'bridge', 'resort', 'hotel', 'tourist', 'place', 'experience', 'travel'];
  for (const word of strong) if (path.includes(word)) score += 3;
  if (path.includes('/en/discovery/')) score += 1;
  if (path.includes('/en/news/')) score -= 2;
  if (path.includes('/en/tin-tuc/')) score -= 2;
  if (path.split('/').filter(Boolean).length >= 2) score += 1;
  return score;
}

async function fetchHtml(url: string): Promise<string | null> {
  const cached = htmlCache.get(url);
  if (cached !== undefined) return cached;

  for (let attempt = 1; attempt <= MAX_FETCH_RETRIES; attempt++) {
    try {
      console.log(`[FETCH ${attempt}/${MAX_FETCH_RETRIES}] ${url}`);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'User-Agent': USER_AGENT,
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
          },
          signal: controller.signal,
          redirect: 'follow',
        });

        if (response.ok) {
          const html = await response.text();
          htmlCache.set(url, html);
          await sleep(REQUEST_DELAY_MS);
          return html;
        }
        if (response.status === 404 || response.status === 403) {
          console.warn(`[HTTP ${response.status}] ${url}`);
          htmlCache.set(url, null);
          return null;
        }
        console.warn(`[HTTP ${response.status}] ${url}`);
      } finally {
        clearTimeout(timeout);
      }
    } catch (error) {
      console.warn(`[FETCH ERROR ${attempt}/${MAX_FETCH_RETRIES}] ${url}: ${error instanceof Error ? error.message : String(error)}`);
    }
    if (attempt < MAX_FETCH_RETRIES) await sleep(REQUEST_DELAY_MS * attempt);
  }

  htmlCache.set(url, null);
  return null;
}

function htmlToText(html: string): string {
  const $ = cheerio.load(html);
  $('script, style, noscript, svg, iframe, nav, footer, header').remove();
  return cleanText($('body').text()) ?? '';
}

function extractJsonLd(html: string): unknown[] {
  const $ = cheerio.load(html);
  const result: unknown[] = [];
  $('script[type="application/ld+json"]').each((_, element) => {
    const content = $(element).html();
    if (!content) return;
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) result.push(...parsed);
      else result.push(parsed);
    } catch {
      // ignore invalid JSON-LD
    }
  });
  return result;
}

function flattenJsonLdItems(items: unknown[]): Record<string, unknown>[] {
  const result: Record<string, unknown>[] = [];
  const visit = (value: unknown) => {
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }
    if (!value || typeof value !== 'object') return;
    const object = value as Record<string, unknown>;
    result.push(object);
    if (Array.isArray(object['@graph'])) visit(object['@graph']);
    if (object.item && typeof object.item === 'object') visit(object.item);
  };
  visit(items);
  return result;
}

function extractJsonLdCoordinates(html: string) {
  for (const object of flattenJsonLdItems(extractJsonLd(html))) {
    const geo = object.geo;
    if (!geo || typeof geo !== 'object') continue;
    const geoObject = geo as Record<string, unknown>;
    const latitude = toNumber(geoObject.latitude);
    const longitude = toNumber(geoObject.longitude);
    if (latitude != null && longitude != null) return { latitude, longitude };
  }
  return { latitude: null, longitude: null };
}

function extractJsonLdAddress(html: string): string | null {
  for (const object of flattenJsonLdItems(extractJsonLd(html))) {
    const address = object.address;
    if (typeof address === 'string') return cleanText(address);
    if (!address || typeof address !== 'object') continue;
    const a = address as Record<string, unknown>;
    const parts = [a.streetAddress, a.addressLocality, a.addressRegion, a.postalCode]
      .filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
    if (parts.length) return cleanText(parts.join(', '));
  }
  return null;
}

function extractJsonLdDescription(html: string): string | null {
  for (const object of flattenJsonLdItems(extractJsonLd(html))) {
    if (typeof object.description === 'string') {
      const description = cleanText(object.description);
      if (description && description.length >= 50) return description.slice(0, 900);
    }
  }
  return null;
}

function extractJsonLdOpeningHours(html: string): string | null {
  for (const object of flattenJsonLdItems(extractJsonLd(html))) {
    const value = object.openingHours;
    if (typeof value === 'string') return cleanText(value);
    if (Array.isArray(value)) {
      const result = value.filter((v): v is string => typeof v === 'string').join('; ');
      if (result) return cleanText(result);
    }
    const specification = object.openingHoursSpecification;
    if (Array.isArray(specification)) {
      const values: string[] = [];
      for (const item of specification) {
        if (!item || typeof item !== 'object') continue;
        const s = item as Record<string, unknown>;
        const day = Array.isArray(s.dayOfWeek) ? s.dayOfWeek.join(', ') : String(s.dayOfWeek ?? '');
        const opens = typeof s.opens === 'string' ? s.opens : '';
        const closes = typeof s.closes === 'string' ? s.closes : '';
        if (day || opens || closes) values.push(`${day}: ${opens}-${closes}`.trim());
      }
      if (values.length) return cleanText(values.join('; '));
    }
  }
  return null;
}

function extractPageTitle(html: string): string | null {
  const $ = cheerio.load(html);
  return cleanText($('h1').first().text()) ?? cleanText($('title').first().text());
}

function extractMainDescription(html: string): string | null {
  const $ = cheerio.load(html);
  const candidates = [
    'main article',
    'article',
    'main',
    '.entry-content',
    '.post-content',
    '.content',
  ];

  for (const selector of candidates) {
    const root = $(selector).first();
    if (!root.length) continue;
    root.find('script,style,noscript,svg,iframe,nav,footer,header,form').remove();
    const paragraphs = root.find('p').map((_, el) => cleanText($(el).text())).get().filter((x): x is string => !!x && x.length >= 40);
    const paragraphText = cleanText(paragraphs.slice(0, 8).join(' '));
    if (paragraphText && paragraphText.length >= 80) return paragraphText.slice(0, 900);
  }

  return null;
}

function extractPageData(html: string, sourceUrl: string, fallbackName?: string): FantasticityRecord | null {
  const $ = cheerio.load(html);
  const jsonAddress = extractJsonLdAddress(html);
  const jsonDescription = extractJsonLdDescription(html);
  const jsonOpening = extractJsonLdOpeningHours(html);
  const coords = extractJsonLdCoordinates(html);
  const bodyText = htmlToText(html);

  const metaDescription = cleanText($('meta[name="description"]').attr('content'));
  const name = extractPageTitle(html) ?? fallbackName ?? null;
  if (!name || name.length < 3) return null;

  const address = jsonAddress ?? extractAddress(bodyText);
  const opening = jsonOpening ?? extractOpeningHours(bodyText);
  const cost = extractCostFromText(bodyText);
  const description = jsonDescription ?? metaDescription ?? extractMainDescription(html) ?? extractDescriptionFromBlock(bodyText);

  // Avoid indexing generic news/article pages as a place when there is no useful place signal.
  const usefulSignal = Boolean(address || opening || cost != null || description);
  if (!usefulSignal) return null;

  return {
    name: name.replace(/\s+[-|–—]\s+Danang Fantasticity.*$/i, '').trim(),
    address,
    opening_hours: opening,
    estimated_cost: cost,
    description,
    source_url: sourceUrl,
    latitude: coords.latitude,
    longitude: coords.longitude,
  };
}

function parseFantasticityTable(html: string, sourceUrl: string): FantasticityRecord[] {
  const $ = cheerio.load(html);
  const records: FantasticityRecord[] = [];

  $('table').each((_, table) => {
    const rows = $(table).find('tr');
    if (rows.length < 2) return;

    const header = $(rows[0]).find('th,td').map((_, cell) => normalizeText($(cell).text())).get();
    if (!header.some((v) => /attraction|site|destination|place|name/.test(v))) return;

    let nameIndex = 0;
    let addressIndex = -1;
    let openingIndex = -1;
    let priceIndex = -1;

    header.forEach((value, index) => {
      if (/attraction|destination|place|name/.test(value)) nameIndex = index;
      if (/address|location|area|ward|commune/.test(value)) addressIndex = index;
      if (/opening|hour|time/.test(value)) openingIndex = index;
      if (/price|ticket|admission|fee/.test(value)) priceIndex = index;
    });

    for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
      const cells = $(rows[rowIndex]).find('th,td').map((_, cell) => cleanText($(cell).text()) ?? '').get();
      const name = cleanText(cells[nameIndex]);
      if (!name || name.length < 3) continue;

      const normalized = normalizeText(name);
      if (/^(attraction|site|destination|place|name)$/.test(normalized)) continue;

      const rawAddress = addressIndex >= 0 ? cleanText(cells[addressIndex]) : null;
      const rawOpening = openingIndex >= 0 ? cleanText(cells[openingIndex]) : null;
      const rawPrice = priceIndex >= 0 ? cleanText(cells[priceIndex]) : null;

      records.push({
        name,
        address: rawAddress && /\d|street|road|đường|phố|ward|district|quận|huyện|city|da nang|đà nẵng/i.test(rawAddress) ? rawAddress : null,
        opening_hours: rawOpening ?? extractOpeningHours([name, ...cells].join(' ')),
        estimated_cost: rawPrice ? extractCostFromText(rawPrice) : extractCostFromText(cells.join(' ')),
        description: null,
        source_url: sourceUrl,
        latitude: null,
        longitude: null,
      });
    }
  });

  return records;
}

function mergeFantasticityRecords(records: FantasticityRecord[]): FantasticityRecord[] {
  const map = new Map<string, FantasticityRecord>();

  for (const record of records) {
    const key = normalizeForMatching(record.name);
    if (!key) continue;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, record);
      continue;
    }

    const existingRichness = [existing.address, existing.description, existing.opening_hours, existing.estimated_cost != null].filter(Boolean).length;
    const newRichness = [record.address, record.description, record.opening_hours, record.estimated_cost != null].filter(Boolean).length;
    const primary = newRichness > existingRichness ? record : existing;
    const secondary = primary === record ? existing : record;

    map.set(key, {
      name: primary.name || secondary.name,
      address: primary.address ?? secondary.address,
      opening_hours: primary.opening_hours ?? secondary.opening_hours,
      estimated_cost: primary.estimated_cost ?? secondary.estimated_cost,
      description: primary.description ?? secondary.description,
      source_url: primary.source_url || secondary.source_url,
      latitude: primary.latitude ?? secondary.latitude,
      longitude: primary.longitude ?? secondary.longitude,
    });
  }

  return [...map.values()];
}

async function discoverSitemapUrls(initialUrls: string[]): Promise<string[]> {
  const queue = [...new Set(initialUrls)];
  const visited = new Set<string>();
  const pageUrls = new Set<string>();
  let processedSitemaps = 0;

  while (queue.length && processedSitemaps < MAX_FANTASTICITY_SITEMAPS) {
    const sitemapUrl = queue.shift()!;
    if (visited.has(sitemapUrl)) continue;
    visited.add(sitemapUrl);
    processedSitemaps++;

    const xml = await fetchHtml(sitemapUrl);
    if (!xml) continue;

    const $ = cheerio.load(xml, { xmlMode: true });
    const childSitemaps: string[] = [];
    const urls: string[] = [];
    $('sitemap loc').each((_, el) => {
      const value = cleanText($(el).text());
      if (value) childSitemaps.push(value);
    });
    $('url loc').each((_, el) => {
      const value = cleanText($(el).text());
      if (value) urls.push(value);
    });

    for (const child of childSitemaps) {
      if (!visited.has(child) && queue.length < MAX_FANTASTICITY_SITEMAPS * 2) queue.push(child);
    }
    for (const url of urls) {
      if (pageUrls.size >= MAX_FANTASTICITY_SITEMAP_URLS) break;
      pageUrls.add(url);
    }
  }

  console.log(`Sitemaps processed: ${processedSitemaps}`);
  console.log(`Sitemap page URLs: ${pageUrls.size}`);
  return [...pageUrls];
}

function collectFantasticityLinks(html: string): string[] {
  const $ = cheerio.load(html);
  const links: string[] = [];
  $('a[href]').each((_, element) => {
    const href = cleanText($(element).attr('href'));
    if (!href) return;
    try {
      const url = new URL(href, `https://${FANTASTICITY_HOST}`);
      url.hash = '';
      if (url.hostname === FANTASTICITY_HOST || url.hostname.endsWith(`.${FANTASTICITY_HOST}`)) {
        links.push(url.toString().replace(/\/$/, ''));
      }
    } catch {
      // ignore
    }
  });
  return [...new Set(links)];
}

function isPaginationUrl(url: string): boolean {
  return /(?:\/page\/\d+\/?$|[?&](?:paged|page)=\d+)/i.test(url);
}

async function discoverFantasticityUrls(seedHtmls: Array<{ url: string; html: string }>): Promise<string[]> {
  const candidates = new Map<string, number>();
  const visited = new Set<string>();
  const queue: Array<{ url: string; depth: number }> = seedHtmls.map((x) => ({ url: x.url, depth: 0 }));

  const addCandidate = (raw: string) => {
    try {
      const url = new URL(raw, `https://${FANTASTICITY_HOST}`);
      url.hash = '';
      if (!isProbablyFantasticityDetailUrl(url.toString())) return;
      const normalized = url.toString().replace(/\/$/, '');
      if (isPaginationUrl(normalized)) return;
      const score = scoreFantasticityUrl(normalized);
      if (score >= 1) candidates.set(normalized, Math.max(candidates.get(normalized) ?? -Infinity, score));
    } catch {
      // ignore
    }
  };

  // First use links from seed pages and their pagination. This catches portal pages
  // even when robots.txt does not expose a sitemap.
  let listingPagesVisited = 0;
  while (queue.length && listingPagesVisited < 60) {
    const item = queue.shift()!;
    if (visited.has(item.url) || item.depth > 2) continue;
    visited.add(item.url);
    listingPagesVisited++;

    const html = htmlCache.get(item.url) ?? await fetchHtml(item.url);
    if (!html) continue;

    const links = collectFantasticityLinks(html);
    for (const link of links) {
      addCandidate(link);
      if (item.depth < 2 && isPaginationUrl(link)) {
        queue.push({ url: link, depth: item.depth + 1 });
      }
    }
  }

  // Try robots.txt plus common sitemap names. The old implementation only handled
  // one sitemap level; many WordPress sites expose a sitemap index instead.
  const sitemapSeeds = [
    `https://${FANTASTICITY_HOST}/sitemap.xml`,
    `https://${FANTASTICITY_HOST}/sitemap_index.xml`,
    `https://${FANTASTICITY_HOST}/wp-sitemap.xml`,
    `https://${FANTASTICITY_HOST}/post-sitemap.xml`,
    `https://${FANTASTICITY_HOST}/page-sitemap.xml`,
  ];
  const robots = await fetchHtml(`https://${FANTASTICITY_HOST}/robots.txt`);
  if (robots) {
    for (const line of robots.split(/\r?\n/)) {
      if (/^sitemap:/i.test(line)) sitemapSeeds.push(line.replace(/^sitemap:\s*/i, '').trim());
    }
  }

  const sitemapUrls = await discoverSitemapUrls(sitemapSeeds.filter(Boolean));
  for (const url of sitemapUrls) addCandidate(url);

  console.log(`Fantasticity candidate URLs before cap: ${candidates.size}`);
  return [...candidates.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_FANTASTICITY_DETAIL_PAGES)
    .map(([url]) => url);
}

function parseSitemapUrls(xml: string): string[] {
  const $ = cheerio.load(xml, { xmlMode: true });
  const urls: string[] = [];
  $('url loc, sitemap loc').each((_, element) => {
    const value = cleanText($(element).text());
    if (value) urls.push(value);
  });
  return urls;
}

async function crawlFantasticity(): Promise<{ records: FantasticityRecord[]; failed: string[]; discoveredPages: number }> {
  const records: FantasticityRecord[] = [];
  const failed: string[] = [];
  const seedHtmls: Array<{ url: string; html: string }> = [];

  console.log('\n========================================');
  console.log('FANTASTICITY DISCOVERY');
  console.log('========================================');

  for (const url of FANTASTICITY_SOURCES) {
    const html = await fetchHtml(url);
    if (!html) {
      failed.push(url);
      continue;
    }
    seedHtmls.push({ url, html });
    records.push(...parseFantasticityTable(html, url));
    const pageRecord = extractPageData(html, url);
    if (pageRecord) records.push(pageRecord);
  }

  const discoveredUrls = await discoverFantasticityUrls(seedHtmls);
  console.log(`Discovered Fantasticity detail candidates: ${discoveredUrls.length}`);

  let processed = 0;
  for (const url of discoveredUrls) {
    processed++;
    console.log(`[FANTASTICITY DETAIL ${processed}/${discoveredUrls.length}] ${url}`);
    const html = await fetchHtml(url);
    if (!html) {
      failed.push(url);
      continue;
    }

    const record = extractPageData(html, url);
    if (record) records.push(record);

    records.push(...parseFantasticityTable(html, url));
  }

  const merged = mergeFantasticityRecords(records);
  console.log(`Fantasticity raw records: ${records.length}`);
  console.log(`Fantasticity unique records: ${merged.length}`);

  return { records: merged, failed, discoveredPages: discoveredUrls.length };
}

function isBlockedOfficialUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    const blocked = [
      'facebook.com', 'instagram.com', 'tiktok.com', 'youtube.com', 'youtu.be',
      'google.com', 'googleusercontent.com', 'maps.google.com', 'tripadvisor.com',
      'booking.com', 'agoda.com', 'traveloka.com', 'expedia.com', 'klook.com',
      'wikipedia.org', 'wikivoyage.org', 'foursquare.com', 'yelp.com',
      'business.site', 'business.google.com', 'x.com', 'twitter.com',
    ];
    return blocked.some((domain) => host === domain || host.endsWith(`.${domain}`));
  } catch {
    return true;
  }
}

function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && !isBlockedOfficialUrl(url);
  } catch {
    return false;
  }
}

async function fetchOfficialWebsite(url: string): Promise<OfficialWebsiteData | null> {
  const cached = officialWebsiteCache.get(url);
  if (cached !== undefined) return cached;

  if (!isValidHttpUrl(url)) {
    officialWebsiteCache.set(url, null);
    return null;
  }

  const html = await fetchHtml(url);
  if (!html) {
    officialWebsiteCache.set(url, null);
    return null;
  }

  const bodyText = htmlToText(html);
  const $ = cheerio.load(html);
  const description = extractJsonLdDescription(html) ?? cleanText($('meta[name="description"]').attr('content')) ?? extractMainDescription(html);
  const address = extractJsonLdAddress(html) ?? extractAddress(bodyText);
  const opening_hours = extractJsonLdOpeningHours(html) ?? extractOpeningHours(bodyText);
  const estimated_cost = extractCostFromText(bodyText);

  const data = { description, address, opening_hours, estimated_cost };
  officialWebsiteCache.set(url, data);
  return data;
}

async function loadManualOverrides(): Promise<Record<string, ManualOverride>> {
  try {
    const raw = await readFile(MANUAL_FILE, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed as Record<string, ManualOverride>;
  } catch {
    return {};
  }
}

function getManualOverride(location: DbLocation, overrides: Record<string, ManualOverride>): ManualOverride | null {
  const keys = [normalizeText(location.name), normalizeForMatching(location.name)].filter(Boolean);
  for (const key of keys) {
    if (overrides[key]) return overrides[key]!;
  }

  const locationKey = normalizeForMatching(location.name);
  for (const override of Object.values(overrides)) {
    if (!override?.aliases?.length) continue;
    for (const alias of override.aliases) {
      if (normalizeForMatching(alias) === locationKey) return override;
    }
  }
  return null;
}

function applyField<T>(current: T | null | undefined, incoming: T | null | undefined): T | null | undefined {
  return current != null && current !== '' ? current : incoming;
}

async function main() {
  console.log('============================================================');
  console.log('LEVEL 2 LOCATION ENRICHMENT - IMPROVED');
  console.log('============================================================');

  const locations = await prisma.location.findMany({
    include: { category: { select: { id: true, name: true } } },
    orderBy: { name: 'asc' },
  });

  console.log(`DB locations: ${locations.length}`);

  const manualOverrides = await loadManualOverrides();
  const osmRecords = await loadOSMEnrichmentRecords();
  const fantasticity = await crawlFantasticity();
  const fantasticityRecords = fantasticity.records;

  const results: EnrichedLocation[] = [];
  const reviewResults: Array<Record<string, unknown>> = [];
  const failedOfficial: Array<{ id: string; name: string; url: string }> = [];

  let fantasticityMatched = 0;
  let fantasticityHighConfidence = 0;
  let fantasticityReview = 0;
  let manualMatched = 0;
  let officialWebsiteCount = 0;
  let officialMatched = 0;
  let osmMatched = 0;

  let descriptionAdded = 0;
  let addressAdded = 0;
  let openingAdded = 0;
  let costAdded = 0;
  let sourceUrlAdded = 0;

  const officialUrlSet = new Set<string>();
  for (const location of locations) {
    if (location.source_url && isValidHttpUrl(location.source_url)) officialUrlSet.add(location.source_url);
  }
  console.log(`Valid official URL candidates from OSM: ${officialUrlSet.size}`);

  for (let index = 0; index < locations.length; index++) {
    const location = locations[index];
    if (!location) continue;

    console.log(`\n[${index + 1}/${locations.length}] ${location.name}`);

    const category = (location.category?.name ?? null) as CategoryName | null;
    let address = location.address;
    let description = location.description;
    let openingHours = location.opening_hours;
    let estimatedCost = toNumber(location.estimated_cost);
    let source = location.source;
    let sourceUrl = location.source_url;
    const fields: string[] = [];

    let usedFantasticity = false;
    let usedOfficialWebsite = false;
    let matchScore: number | null = null;
    let matchType: EnrichedLocation['enrichment']['matchType'] = 'none';
    let matchedSourceName: string | null = null;

    // Priority 0: recover useful fields already present in the original OSM dump.
    // This is local data and costs no network request. Never overwrite DB values.
    const osmMatch = chooseOSMEnrichmentMatch(location, osmRecords);
    if (osmMatch) {
      let usedOSM = false;
      if (!address && osmMatch.address) { address = osmMatch.address; fields.push('address'); addressAdded++; usedOSM = true; }
      if (!description && osmMatch.description) { description = osmMatch.description; fields.push('description'); descriptionAdded++; usedOSM = true; }
      if (!openingHours && osmMatch.opening_hours) { openingHours = osmMatch.opening_hours; fields.push('opening_hours'); openingAdded++; usedOSM = true; }
      if (estimatedCost == null && osmMatch.estimated_cost != null) { estimatedCost = osmMatch.estimated_cost; fields.push('estimated_cost'); costAdded++; usedOSM = true; }
      if (!sourceUrl && osmMatch.source_url && isValidHttpUrl(osmMatch.source_url)) { sourceUrl = osmMatch.source_url; source = 'OSM'; fields.push('source_url'); sourceUrlAdded++; usedOSM = true; }
      if (usedOSM) osmMatched++;
    }

    const manual = getManualOverride(location, manualOverrides);
    if (manual) {
      manualMatched++;
      matchType = 'manual';
      matchScore = 1;
      matchedSourceName = location.name;

      if (!address && manual.address) { address = manual.address; fields.push('address'); addressAdded++; }
      if (!description && manual.description) { description = manual.description; fields.push('description'); descriptionAdded++; }
      if (!openingHours && manual.opening_hours) { openingHours = manual.opening_hours; fields.push('opening_hours'); openingAdded++; }
      if (estimatedCost == null && manual.estimated_cost != null) { estimatedCost = manual.estimated_cost; fields.push('estimated_cost'); costAdded++; }
      if (!sourceUrl && manual.source_url) { sourceUrl = manual.source_url; source = manual.source ?? 'Manual'; fields.push('source_url'); sourceUrlAdded++; }
    }

    const match = manual ? { record: null, score: 1, matchType: 'none' as const } : chooseFantasticityMatch(location, fantasticityRecords);
    if (!manual) {
      matchScore = match.score;
      matchType = match.matchType;
      matchedSourceName = match.record?.name ?? null;

      if (match.score >= REVIEW_THRESHOLD && match.score < AUTO_MATCH_THRESHOLD) {
        fantasticityReview++;
        reviewResults.push({
          id: location.id,
          name: location.name,
          category,
          matchedName: match.record?.name ?? null,
          score: match.score,
          matchType: match.matchType,
        });
      }

      if (match.record) {
        fantasticityMatched++;
        usedFantasticity = true;
        if (match.score >= HIGH_CONFIDENCE_THRESHOLD) fantasticityHighConfidence++;

        const record = match.record;
        if (!address && record.address) { address = record.address; fields.push('address'); addressAdded++; }
        if (!openingHours && record.opening_hours) { openingHours = record.opening_hours; fields.push('opening_hours'); openingAdded++; }
        if (estimatedCost == null && record.estimated_cost != null) { estimatedCost = record.estimated_cost; fields.push('estimated_cost'); costAdded++; }
        if (!description && record.description) { description = record.description; fields.push('description'); descriptionAdded++; }
        if (!sourceUrl && record.source_url) { sourceUrl = record.source_url; source = 'Danang Fantasticity'; fields.push('source_url'); sourceUrlAdded++; }
      }
    }

    const needsOfficial = !address || !description || !openingHours || estimatedCost == null;
    if (needsOfficial && sourceUrl && isValidHttpUrl(sourceUrl) && officialWebsiteCount < MAX_OFFICIAL_WEBSITES && !sourceUrl.includes(FANTASTICITY_HOST)) {
      officialWebsiteCount++;
      const official = await fetchOfficialWebsite(sourceUrl);
      if (!official) {
        failedOfficial.push({ id: location.id, name: location.name, url: sourceUrl });
      } else {
        usedOfficialWebsite = true;
        officialMatched++;
        if (!address && official.address) { address = official.address; fields.push('address'); addressAdded++; }
        if (!description && official.description) { description = official.description; fields.push('description'); descriptionAdded++; }
        if (!openingHours && official.opening_hours) { openingHours = official.opening_hours; fields.push('opening_hours'); openingAdded++; }
        if (estimatedCost == null && official.estimated_cost != null) { estimatedCost = official.estimated_cost; fields.push('estimated_cost'); costAdded++; }
      }
    }

    results.push({
      id: location.id,
      name: location.name,
      address,
      latitude: toNumber(location.latitude),
      longitude: toNumber(location.longitude),
      province: location.province,
      description,
      estimated_cost: estimatedCost,
      opening_hours: openingHours,
      source,
      source_url: sourceUrl,
      category,
      enrichment: {
        fantasticity: usedFantasticity,
        officialWebsite: usedOfficialWebsite,
        matchScore,
        matchType,
        matchedSourceName,
        fields: [...new Set(fields)],
      },
    });
  }

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf8');
  await writeFile(REVIEW_FILE, JSON.stringify(reviewResults, null, 2), 'utf8');
  await writeFile(FAILED_FILE, JSON.stringify({ fantasticity: fantasticity.failed, officialWebsites: failedOfficial }, null, 2), 'utf8');

  const missing = {
    address: results.filter((x) => !x.address).length,
    description: results.filter((x) => !x.description).length,
    opening_hours: results.filter((x) => !x.opening_hours).length,
    estimated_cost: results.filter((x) => x.estimated_cost == null).length,
    source_url: results.filter((x) => !x.source_url).length,
  };

  const categoryStats = new Map<string, number>();
  for (const result of results) {
    const key = result.category ?? 'NULL';
    categoryStats.set(key, (categoryStats.get(key) ?? 0) + 1);
  }

  console.log('\n============================================================');
  console.log('LEVEL 2 ENRICHMENT RESULT');
  console.log('============================================================');
  console.log(`Input locations:             ${locations.length}`);
  console.log(`Fantasticity records:        ${fantasticityRecords.length}`);
  console.log(`Fantasticity detail pages:   ${fantasticity.discoveredPages}`);
  console.log(`Fantasticity matched:        ${fantasticityMatched}`);
  console.log(`High-confidence matches:     ${fantasticityHighConfidence}`);
  console.log(`Manual-review candidates:    ${fantasticityReview}`);
  console.log(`Manual overrides:             ${manualMatched}`);
  console.log(`OSM enrichment matched:       ${osmMatched}`);
  console.log(`Official websites fetched:   ${officialWebsiteCount}`);
  console.log(`Official websites matched:   ${officialMatched}`);
  console.log('\nFields added (priority order: description > cost > address > opening > source):');
  console.log(`  address:                   ${addressAdded}`);
  console.log(`  description:               ${descriptionAdded}`);
  console.log(`  opening_hours:             ${openingAdded}`);
  console.log(`  estimated_cost:            ${costAdded}`);
  console.log(`  source_url:                ${sourceUrlAdded}`);
  console.log('\nStill NULL:');
  console.log(`  address:                   ${missing.address}`);
  console.log(`  description:               ${missing.description}`);
  console.log(`  opening_hours:             ${missing.opening_hours}`);
  console.log(`  estimated_cost:            ${missing.estimated_cost}`);
  console.log(`  source_url:                ${missing.source_url}`);
  console.log('\nCategory distribution:');
  for (const [category, count] of categoryStats) console.log(`  ${category}: ${count}`);
  console.log('\nFiles:');
  console.log(`  enriched: ${OUTPUT_FILE}`);
  console.log(`  review:   ${REVIEW_FILE}`);
  console.log(`  failed:   ${FAILED_FILE}`);
  console.log('============================================================');
}

main()
  .catch((error) => {
    console.error('\nLEVEL 2 ENRICHMENT FAILED');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
