
import fs from 'node:fs';
import path from 'node:path';

type AIMetadata = {
  name: string;
  address?: string | null;
  category: string | null;
  province: string | null;
  estimated_cost: number | null;
  duration_minutes: number | null;
  opening_hours: string | null;
  latitude: number | null;
  longitude: number | null;
  source: string | null;
  source_url: string | null;
};

type AIDocument = {
  id: string;
  text: string;
  metadata: AIMetadata;
};

type IssueSeverity = 'error' | 'warning';

type ValidationIssue = {
  id: string;
  name: string;
  severity: IssueSeverity;
  field: string;
  message: string;
  value?: unknown;
};

type ValidationReport = {
  generatedAt: string;
  totalDocuments: number;
  validDocuments: number;
  documentsWithWarnings: number;
  documentsWithErrors: number;
  summary: {
    errors: number;
    warnings: number;
  };
  issues: ValidationIssue[];
};

const ROOT_DIR = process.cwd();

const INPUT_FILE = path.join(
  ROOT_DIR,
  'tools',
  'location-data',
  'clean',
  'locations-ai.json',
);

const OUTPUT_FILE = path.join(
  ROOT_DIR,
  'tools',
  'location-data',
  'clean',
  'validation-report.json',
);

const VALID_CATEGORIES = new Set([
  'Du lịch',
  'Ẩm thực',
  'Địa điểm',
  'Mountain',
]);

function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function normalizeText(value: string | null | undefined): string {
  return (value ?? '')
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeOpeningHours(
  value: string | null | undefined,
): string | null {
  if (!value) return null;

  return value
    .normalize('NFC')
    .replace(/[–—]/g, '-')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractDurationFromText(text: string): string[] {
  const matches: string[] = [];

  const patterns = [
    /Thời gian trải nghiệm\s+(?:khoảng|từ)?\s*([^.!?\n]+)/giu,
    /Thời gian tham quan\s+(?:khoảng|từ)?\s*([^.!?\n]+)/giu,
    /Thời gian tham quan lý tưởng\s*:\s*([^.!?\n]+)/giu,
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      if (match[1]) {
        matches.push(match[1].trim());
      }
    }
  }

  return matches;
}

function parseDurationRangeToMinutes(
  value: string,
): { min: number; max: number | null } | null {
  const normalized = value
    .toLowerCase()
    .replace(/–|—/g, '-')
    .replace(/,/g, '.')
    .trim();
  const hourRange = normalized.match(
    /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*(?:tiếng|giờ|hour|hours)/i,
  );

  if (hourRange) {
    return {
      min: Number(hourRange[1]) * 60,
      max: Number(hourRange[2]) * 60,
    };
  }

  const minuteRange = normalized.match(
    /(\d+)\s*-\s*(\d+)\s*(?:phút|mins?|minutes?)/i,
  );

  if (minuteRange) {
    return {
      min: Number(minuteRange[1]),
      max: Number(minuteRange[2]),
    };
  }

  const singleHour = normalized.match(
    /(?:khoảng\s*)?(\d+(?:\.\d+)?)\s*(?:tiếng|giờ|hour|hours)/i,
  );

  if (singleHour) {
    const minutes = Number(singleHour[1]) * 60;

    return {
      min: minutes,
      max: minutes,
    };
  }

  const singleMinute = normalized.match(
    /(?:khoảng\s*)?(\d+)\s*(?:phút|mins?|minutes?)/i,
  );

  if (singleMinute) {
    const minutes = Number(singleMinute[1]);

    return {
      min: minutes,
      max: minutes,
    };
  }

  return null;
}

function extractOpeningHoursFromText(text: string): string[] {
  const matches: string[] = [];

  const pattern =
    /Giờ mở cửa\s*:\s*([^.!?\n]+(?:\.[^.!?\n]+)?)/giu;

  for (const match of text.matchAll(pattern)) {
    if (match[1]) {
      matches.push(match[1].trim());
    }
  }

  return matches;
}

function hasValidOpeningHoursFormat(
  value: string | null,
): boolean {
  if (!value) return true;

  if (value === '24/7') {
    return true;
  }

  const pattern =  /^(?:(?:Mo|Tu|We|Th|Fr|Sa|Su)(?:-(?:Mo|Tu|We|Th|Fr|Sa|Su))?\s+)?\d{2}:\d{2}-\d{2}:\d{2}$/i;

  return pattern.test(value);
}

function validateSourceUrl(value: string | null): boolean {
  if (!value) return true;

  try {
    const url = new URL(value);

    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function validateDocument(
  doc: AIDocument,
  allIds: Set<string>,
  allNames: Map<string, string[]>,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const add = (
    severity: IssueSeverity,
    field: string,
    message: string,
    value?: unknown,
  ) => {
    issues.push({
      id: doc.id ?? '',
      name: doc.metadata?.name ?? '',
      severity,
      field,
      message,
      ...(value !== undefined ? { value } : {}),
    });
  };

  if (!doc.id || typeof doc.id !== 'string') {
    add('error', 'id', 'Thiếu id hoặc id không phải string.');
  }

  if (!doc.text || typeof doc.text !== 'string') {
    add('error', 'text', 'Thiếu text.');
  } else {
    if (normalizeText(doc.text).length < 100) {
      add(
        'warning',
        'text',
        'Text quá ngắn, có thể không đủ thông tin semantic.',
        doc.text.length,
      );
    }

    if (doc.text !== doc.text.normalize('NFC')) {
      add(
        'warning',
        'text',
        'Text chưa được Unicode NFC normalize.',
      );
    }

    if (/\s{2,}/.test(doc.text)) {
      add(
        'warning',
        'text',
        'Text có nhiều khoảng trắng liên tiếp.',
      );
    }
  }

  if (!doc.metadata || typeof doc.metadata !== 'object') {
    add('error', 'metadata', 'Thiếu metadata.');
    return issues;
  }

  const metadata = doc.metadata;

  if (!metadata.name || typeof metadata.name !== 'string') {
    add('error', 'metadata.name', 'Thiếu name.');
  }

  if (
    metadata.category !== null &&
    !VALID_CATEGORIES.has(metadata.category)
  ) {
    add(
      'error',
      'metadata.category',
      `Category không hợp lệ. Giá trị cho phép: ${[
        ...VALID_CATEGORIES,
      ].join(', ')}.`,
      metadata.category,
    );
  }

  if (metadata.province !== 'Đà Nẵng') {
    add(
      'error',
      'metadata.province',
      'Province phải là "Đà Nẵng".',
      metadata.province,
    );
  }

  if (
    metadata.estimated_cost !== null &&
    !isValidNumber(metadata.estimated_cost)
  ) {
    add(
      'error',
      'metadata.estimated_cost',
      'estimated_cost phải là number hoặc null.',
      metadata.estimated_cost,
    );
  } else if (
    isValidNumber(metadata.estimated_cost) &&
    metadata.estimated_cost < 0
  ) {
    add(
      'error',
      'metadata.estimated_cost',
      'estimated_cost không được âm.',
      metadata.estimated_cost,
    );
  }

  if ( metadata.duration_minutes !== null && !isValidNumber(metadata.duration_minutes)) {
    add(
      'error',
      'metadata.duration_minutes',
      'duration_minutes phải là number hoặc null.',
      metadata.duration_minutes,
    );
  } else if (
    isValidNumber(metadata.duration_minutes) &&
    metadata.duration_minutes <= 0
  ) {
    add(
      'error',
      'metadata.duration_minutes',
      'duration_minutes phải lớn hơn 0.',
      metadata.duration_minutes,
    );
  }

  if (
    metadata.latitude !== null &&
    !isValidNumber(metadata.latitude)
  ) {
    add(
      'error',
      'metadata.latitude',
      'latitude phải là number hoặc null.',
      metadata.latitude,
    );
  } else if (
    isValidNumber(metadata.latitude) &&
    (metadata.latitude < -90 || metadata.latitude > 90)
  ) {
    add(
      'error',
      'metadata.latitude',
      'latitude nằm ngoài khoảng -90 đến 90.',
      metadata.latitude,
    );
  }

  if (metadata.longitude !== null &&
    !isValidNumber(metadata.longitude)
  ) {
    add(
      'error',
      'metadata.longitude',
      'longitude phải là number hoặc null.',
      metadata.longitude,
    );
  } else if (
    isValidNumber(metadata.longitude) &&
    (metadata.longitude < -180 || metadata.longitude > 180)
  ) {
    add(
      'error',
      'metadata.longitude',
      'longitude nằm ngoài khoảng -180 đến 180.',
      metadata.longitude,
    );
  }

  if (
    metadata.opening_hours !== null &&
    typeof metadata.opening_hours !== 'string'
  ) {
    add(
      'error',
      'metadata.opening_hours',
      'opening_hours phải là string hoặc null.',
      metadata.opening_hours,
    );
  } else {
    const normalizedHours = normalizeOpeningHours(
      metadata.opening_hours,
    );

    if (!hasValidOpeningHoursFormat(normalizedHours)) {
      add(
        'warning',
        'metadata.opening_hours',
        'Định dạng opening_hours chưa chuẩn.',
        metadata.opening_hours,
      );
    }

    if (
      typeof metadata.opening_hours === 'string' &&
      /--/.test(metadata.opening_hours)
    ) {
      add(
        'warning',
        'metadata.opening_hours',
        'opening_hours có double dash "--".',
        metadata.opening_hours,
      );
    }
  }

  if ( metadata.source_url !== null &&
    typeof metadata.source_url !== 'string'
  ) {
    add(
      'error',
      'metadata.source_url',
      'source_url phải là string hoặc null.',
      metadata.source_url,
    );
  } else if (
    typeof metadata.source_url === 'string' &&
    !validateSourceUrl(metadata.source_url)
  ) {
    add(
      'warning',
      'metadata.source_url',
      'source_url không phải URL HTTP/HTTPS hợp lệ.',
      metadata.source_url,
    );
  }

  const text = doc.text ?? '';
  const durationTexts = extractDurationFromText(text);

  if (
    durationTexts.length > 0 &&
    isValidNumber(metadata.duration_minutes)
  ) {
    for (const durationText of durationTexts) {
      const parsed = parseDurationRangeToMinutes(durationText);

      if (!parsed) continue;

      const duration = metadata.duration_minutes;

      const isInsideRange =
        duration >= parsed.min &&
        (parsed.max === null || duration <= parsed.max);

      if (!isInsideRange) {
        add(
          'warning',
          'duration_minutes',
          `Duration trong metadata (${duration} phút) không nằm trong khoảng mô tả "${durationText}".`,
          {
            metadata_duration: duration,
            description_duration: durationText,
          },
        );
      }
    }
  }

  const openingHoursTexts = extractOpeningHoursFromText(text);

  if (
    openingHoursTexts.length > 0 &&
    metadata.opening_hours
  ) {
    const metadataHours = normalizeOpeningHours(
      metadata.opening_hours,
    );

    for (const openingText of openingHoursTexts) {
      const normalizedDescriptionHours = normalizeOpeningHours(openingText);

      const hasTime =
        /\d{1,2}[:h]\d{2}/i.test(openingText) ||
        /\d{1,2}h\d{0,2}/i.test(openingText);

      if (
        hasTime &&
        normalizedDescriptionHours &&
        metadataHours &&
        !normalizedDescriptionHours.includes(
          metadataHours,
        ) &&
        !metadataHours.includes(normalizedDescriptionHours)
      ) {
        add(
          'warning',
          'opening_hours',
          `Opening hours trong description có thể khác metadata: "${openingText}".`,
          {
            metadata_opening_hours: metadata.opening_hours,
            description_opening_hours: openingText,
          },
        );
      }
    }
  }

  const structuredPatterns = [
    'Thời gian trải nghiệm',
    'Thời gian tham quan',
    'Giờ mở cửa',
    'Chi phí/giá vé',
    'Giá vé',
  ];

  for (const label of structuredPatterns) {
    const occurrences = (
      text.match(
        new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'giu'),
      ) ?? []
    ).length;

    if (occurrences > 1) {
      add(
        'warning',
        'text',
        `Thông tin "${label}" xuất hiện nhiều lần trong text.`,
        occurrences,
      );
    }
  }

  return issues;
}

function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    throw new Error(
      `Không tìm thấy file input:\n${INPUT_FILE}`,
    );
  }

  const raw = fs.readFileSync(INPUT_FILE, 'utf-8');

  let documents: AIDocument[];

  try {
    documents = JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `Không thể parse JSON: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  if (!Array.isArray(documents)) {
    throw new Error(
      'locations-ai.json phải chứa một JSON array.',
    );
  }

  const issues: ValidationIssue[] = [];
  const idMap = new Map<string, number>();

  for (const doc of documents) {
    if (!doc?.id) continue;

    idMap.set(doc.id, (idMap.get(doc.id) ?? 0) + 1);
  }

  for (const [id, count] of idMap.entries()) {
    if (count > 1) {
      const docs = documents.filter((doc) => doc.id === id);

      for (const doc of docs) {
        issues.push({
          id,
          name: doc.metadata?.name ?? '',
          severity: 'error',
          field: 'id',
          message: `Duplicate id xuất hiện ${count} lần.`,
          value: id,
        });
      }
    }
  }

  const nameMap = new Map<string, string[]>();

  for (const doc of documents) {
    const name = normalizeText(doc.metadata?.name);

    if (!name) continue;

    const key = name.toLowerCase();

    const current = nameMap.get(key) ?? [];
    current.push(doc.id);
    nameMap.set(key, current);
  }

  for (const [normalizedName, ids] of nameMap.entries()) {
    if (ids.length <= 1) continue;

    for (const id of ids) {
      const doc = documents.find((item) => item.id === id);

      issues.push({
        id,
        name: doc?.metadata?.name ?? normalizedName,
        severity: 'warning',
        field: 'metadata.name',
        message: `Duplicate name xuất hiện ${ids.length} lần.`,
        value: normalizedName,
      });
    }
  }

  const allIds = new Set(documents.map((doc) => doc.id));

  for (const doc of documents) {
    issues.push(
      ...validateDocument(
        doc,
        allIds,
        nameMap,
      ),
    );
  }

  const errorIssues = issues.filter(
    (issue) => issue.severity === 'error',
  );

  const warningIssues = issues.filter(
    (issue) => issue.severity === 'warning',
  );

  const errorIds = new Set(
    errorIssues.map((issue) => issue.id),
  );

  const warningIds = new Set(
    warningIssues.map((issue) => issue.id),
  );

  const report: ValidationReport = {
    generatedAt: new Date().toISOString(),
    totalDocuments: documents.length,
    validDocuments: documents.filter(
      (doc) => !errorIds.has(doc.id),
    ).length,
    documentsWithWarnings: warningIds.size,
    documentsWithErrors: errorIds.size,
    summary: {
      errors: errorIssues.length,
      warnings: warningIssues.length,
    },
    issues,
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), {
    recursive: true,
  });

  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(report, null, 2),
    'utf-8',
  );


  console.log('');
  console.log('========================================');
  console.log(' AI DOCUMENT VALIDATION');
  console.log('========================================');
  console.log(`Total documents : ${report.totalDocuments}`);
  console.log(`Valid           : ${report.validDocuments}`);
  console.log(
    `With warnings   : ${report.documentsWithWarnings}`,
  );
  console.log(
    `With errors     : ${report.documentsWithErrors}`,
  );
  console.log(`Errors          : ${report.summary.errors}`);
  console.log(`Warnings        : ${report.summary.warnings}`);
  console.log('========================================');

  if (errorIssues.length > 0) {
    console.log('');
    console.log('❌ ERRORS');

    for (const issue of errorIssues) {
      console.log(
        `- [${issue.name}] ${issue.field}: ${issue.message}`,
      );
    }
  }

  if (warningIssues.length > 0) {
    console.log('');
    console.log('⚠️ WARNINGS');

    for (const issue of warningIssues) {
      console.log(
        `- [${issue.name}] ${issue.field}: ${issue.message}`,
      );
    }
  }

  console.log('');
  console.log(`Report: ${OUTPUT_FILE}`);
}

main();

