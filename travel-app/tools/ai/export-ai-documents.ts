import 'dotenv/config';
import { Client } from 'pg';
import fs from 'node:fs/promises';
import path from 'node:path';

type LocationRow = {
  id: string;
  name: string;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  province: string | null;
  description: string | null;
  estimated_cost: string | null;
  opening_hours: string | null;
  source: string | null;
  source_url: string | null;
  category: string | null;
  duration_minutes: number | null;
};

type AIDocument = {
  id: string;
  text: string;

  metadata: {
    name: string;
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
};

function cleanText(value: string | null): string {
  if (!value) return '';

  return value
    .replace(/\\r\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeOpeningHours(value: string | null): string | null {
  if (!value) return null;

  return value
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, '')
    .trim();
}

function buildDocument(location: LocationRow): AIDocument {
  const description = cleanText(location.description);

  const text = [
    `Địa điểm: ${location.name}`,
    `Loại địa điểm: ${location.category ?? 'Chưa phân loại'}`,
    `Khu vực: ${location.province ?? 'Đà Nẵng'}`,

    `\nThông tin địa điểm:`,
    description || 'Không có mô tả.',

    `\nThông tin hành trình:`,
    `Chi phí tham khảo: ${
      location.estimated_cost !== null
        ? `${Number(location.estimated_cost).toLocaleString('vi-VN')} VNĐ`
        : 'Chưa xác định'
    }`,

    `Thời gian tham quan đề xuất: ${
      location.duration_minutes !== null
        ? `${location.duration_minutes} phút`
        : 'Chưa xác định'
    }`,

    `Giờ mở cửa: ${
      normalizeOpeningHours(location.opening_hours) ?? 'Chưa xác định'
    }`,

    `Tọa độ: ${
      location.latitude !== null && location.longitude !== null
        ? `${location.latitude}, ${location.longitude}`
        : 'Chưa xác định'
    }`,
  ].join('\n');

  return {
    id: location.id,

    text,

    metadata: {
      name: location.name,
      category: location.category,
      province: location.province,

      estimated_cost:
        location.estimated_cost !== null
          ? Number(location.estimated_cost)
          : null,

      duration_minutes: location.duration_minutes,

      opening_hours: normalizeOpeningHours(location.opening_hours),

      latitude:
        location.latitude !== null
          ? Number(location.latitude)
          : null,

      longitude:
        location.longitude !== null
          ? Number(location.longitude)
          : null,

      source: location.source,
      source_url: location.source_url,
    },
  };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL chưa được cấu hình.');
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  console.log('Connected to PostgreSQL');

  const result = await client.query<LocationRow>(`
    SELECT
      l.id,
      l.name,
      l.address,
      l.latitude,
      l.longitude,
      l.province,
      l.description,
      l.estimated_cost,
      l.opening_hours,
      l.source,
      l.source_url,
      c.name AS category,
      l.duration_minutes
    FROM location l
    LEFT JOIN category c
      ON c.id = l.category_id
    WHERE l.province = 'Đà Nẵng'
    ORDER BY l.name;
  `);

  await client.end();

  const documents = result.rows.map(buildDocument);

  const outputDir = path.resolve(
    process.cwd(),
    'tools',
    'ai',
    'output',
  );

  await fs.mkdir(outputDir, {
    recursive: true,
  });

  const outputPath = path.join(
    outputDir,
    'ai-documents.json',
  );

  await fs.writeFile(
    outputPath,
    JSON.stringify(documents, null, 2),
    'utf8',
  );

  console.log(`Exported ${documents.length} AI documents`);
  console.log(`Output: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});