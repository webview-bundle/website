import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import mime from 'mime';
import { glob } from 'tinyglobby';

dotenv.config();

const UPLOAD_CONCURRENCY = 8;

const filesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

const bucket = 'wvb-static';
const cacheControl = 'public, max-age=31536000, immutable';
const accountId = requireEnv('CLOUDFLARE_ACCOUNT_ID');
const accessKeyId = requireEnv('R2_ACCESS_KEY_ID');
const secretAccessKey = requireEnv('R2_SECRET_ACCESS_KEY');

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

/** Every object key already present in the bucket (paginated). */
async function listExistingKeys(): Promise<Set<string>> {
  const keys = new Set<string>();
  let continuationToken: string | undefined;
  do {
    const res = await client.send(
      new ListObjectsV2Command({ Bucket: bucket, ContinuationToken: continuationToken })
    );
    for (const obj of res.Contents ?? []) {
      if (obj.Key) keys.add(obj.Key);
    }
    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (continuationToken);
  return keys;
}

async function uploadFile(key: string): Promise<void> {
  const body = await readFile(path.join(filesDir, key));
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: mime.getType(key) ?? 'application/octet-stream',
      CacheControl: cacheControl,
    })
  );
  console.log(`  ↑ ${key}`);
}

/** Runs `task` over `items` with a fixed-size worker pool. */
async function runPool<T>(items: T[], task: (item: T) => Promise<void>): Promise<void> {
  let cursor = 0;
  const workers = Array.from({ length: Math.min(UPLOAD_CONCURRENCY, items.length) }, async () => {
    while (cursor < items.length) {
      const item = items[cursor++]!;
      await task(item);
    }
  });
  await Promise.all(workers);
}

async function main(): Promise<void> {
  // tinyglobby returns paths relative to `cwd` with posix separators, which is
  // exactly the object-key shape we want.
  const localKeys = await glob('**/*', { cwd: filesDir, onlyFiles: true, dot: false });
  if (localKeys.length === 0) {
    console.log(`No files found under ${filesDir}; nothing to upload.`);
    return;
  }

  const existing = await listExistingKeys();
  const toUpload = localKeys.filter(key => !existing.has(key)).sort();

  console.log(
    `${bucket}: ${localKeys.length} local file(s), ${existing.size} already uploaded, ` +
      `${toUpload.length} new.`
  );

  if (toUpload.length === 0) {
    console.log('Everything is already up to date.');
    return;
  }

  await runPool(toUpload, uploadFile);
  console.log(`Uploaded ${toUpload.length} file(s) to ${bucket}.`);
}

await main();
