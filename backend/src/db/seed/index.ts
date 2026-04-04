import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { env } from '@/core/env';
import { cleanSql, splitStatements, logStep } from './utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Flags = {
  noDrop?: boolean;
  only?: string[];
};

function parseFlags(argv: string[]): Flags {
  const flags: Flags = {};
  for (const a of argv.slice(2)) {
    if (a === '--no-drop') flags.noDrop = true;
    else if (a.startsWith('--only=')) {
      flags.only = a.replace('--only=', '').split(',').map(s => s.trim());
    }
  }
  return flags;
}

function assertSafeToDrop(dbName: string) {
  const allowDrop = process.env.ALLOW_DROP === 'true';
  const isProd = process.env.NODE_ENV === 'production';
  const isSystem = ['mysql','information_schema','performance_schema','sys'].includes(dbName.toLowerCase());
  if (isSystem) throw new Error(`Sistem DB'si drop edilemez: ${dbName}`);
  if (isProd && !allowDrop) throw new Error('Prod ortamda DROP icin ALLOW_DROP=true bekleniyor.');
}

async function dropAndCreate(root: mysql.Connection) {
  assertSafeToDrop(env.DB.name);
  await root.query(`DROP DATABASE IF EXISTS \`${env.DB.name}\`;`);
  await root.query(
    `CREATE DATABASE \`${env.DB.name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );

  // app kullanicisina yetki ver (root ile DROP/CREATE sonrasi kaybolur)
  const dbUser = env.DB.user;
  const dbHost = env.DB.host;
  if (dbUser !== 'root') {
    await root.query(
      `GRANT ALL PRIVILEGES ON \`${env.DB.name}\`.* TO '${dbUser}'@'${dbHost}';`
    );
    await root.query(`FLUSH PRIVILEGES;`);
  }
}

async function createRoot(): Promise<mysql.Connection> {
  return mysql.createConnection({
    host: env.DB.host,
    port: env.DB.port,
    user: process.env.DB_ROOT_USER || 'root',
    password: process.env.DB_ROOT_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || env.DB.password,
    multipleStatements: true,
  });
}

async function createConnToDb(): Promise<mysql.Connection> {
  return mysql.createConnection({
    host: env.DB.host,
    port: env.DB.port,
    user: env.DB.user,
    password: env.DB.password,
    database: env.DB.name,
    multipleStatements: true,
    charset: 'utf8mb4_unicode_ci',
  });
}

function shouldRun(file: string, flags: Flags) {
  if (!flags.only?.length) return true;
  const m = path.basename(file).match(/^(\d+)/);
  const prefix = m?.[1];
  return prefix ? flags.only.includes(prefix) : false;
}

/** Admin degiskenlerini ENV'den oku + bcrypt uret */
function getAdminVars() {
  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').trim();
  const id = (process.env.ADMIN_ID || '4f618a8d-6fdb-498c-898a-395d368b2193').trim();
  const plainPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = bcrypt.hashSync(plainPassword, 12);
  return { email, id, passwordHash };
}

/** Editor (normal user) degiskenlerini ENV'den oku + bcrypt uret */
function getEditorVars() {
  const email = (process.env.EDITOR_EMAIL || 'editor@example.com').trim();
  const id = (process.env.EDITOR_ID || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890').trim();
  const plainPassword = process.env.EDITOR_PASSWORD || 'editor123';
  const passwordHash = bcrypt.hashSync(plainPassword, 12);
  return { email, id, passwordHash };
}

/** Bayi seed hesabi — admin sifresinden bagimsiz (varsayilan: admin123) */
function getDealerVars() {
  const plainPassword = process.env.DEALER_PASSWORD || 'admin123';
  const passwordHash = bcrypt.hashSync(plainPassword, 12);
  return { passwordHash };
}

/** SQL string guvenli tek tirnak escape */
function sqlStr(v: string) {
  return v.replaceAll("'", "''");
}

/** SITE_NAME — env'den oku, SQL placeholder'larina enjekte et */
function getSiteName(): string {
  return (process.env.SITE_NAME || 'Corporate Site').trim();
}

/** Dosyayi oku, temizle, tum degiskenleri enjekte et */
function prepareSqlForRun(
  rawSql: string,
  admin: { email: string; id: string; passwordHash: string },
  editor: { email: string; id: string; passwordHash: string },
  dealer: { passwordHash: string },
) {
  let sql = cleanSql(rawSql);
  const siteName = getSiteName();

  const header = [
    `SET @ADMIN_EMAIL := '${sqlStr(admin.email)}';`,
    `SET @ADMIN_ID := '${sqlStr(admin.id)}';`,
    `SET @ADMIN_PASSWORD_HASH := '${sqlStr(admin.passwordHash)}';`,
    `SET @EDITOR_EMAIL := '${sqlStr(editor.email)}';`,
    `SET @EDITOR_ID := '${sqlStr(editor.id)}';`,
    `SET @EDITOR_PASSWORD_HASH := '${sqlStr(editor.passwordHash)}';`,
    `SET @DEALER_PASSWORD_HASH := '${sqlStr(dealer.passwordHash)}';`,
    `SET @SITE_NAME := '${sqlStr(siteName)}';`,
  ].join('\n');

  sql = sql
    .replaceAll('{{ADMIN_BCRYPT}}', admin.passwordHash)
    .replaceAll('{{ADMIN_PASSWORD_HASH}}', admin.passwordHash)
    .replaceAll('{{ADMIN_EMAIL}}', admin.email)
    .replaceAll('{{ADMIN_ID}}', admin.id)
    .replaceAll('{{EDITOR_PASSWORD_HASH}}', editor.passwordHash)
    .replaceAll('{{EDITOR_EMAIL}}', editor.email)
    .replaceAll('{{EDITOR_ID}}', editor.id)
    .replaceAll('{{DEALER_PASSWORD_HASH}}', dealer.passwordHash)
    .replaceAll('{{SITE_NAME}}', siteName);

  sql = `${header}\n${sql}`;
  return sql;
}

async function runSqlFile(
  conn: mysql.Connection,
  absPath: string,
  adminVars: { email: string; id: string; passwordHash: string },
  editorVars: { email: string; id: string; passwordHash: string },
  dealerVars: { passwordHash: string },
) {
  const name = path.basename(absPath);
  logStep(`${name} calisiyor...`);
  const raw = fs.readFileSync(absPath, 'utf8');

  const sql = prepareSqlForRun(raw, adminVars, editorVars, dealerVars);
  const statements = splitStatements(sql);

  await conn.query('SET NAMES utf8mb4;');
  await conn.query("SET time_zone = '+00:00';");

  for (const stmt of statements) {
    if (!stmt) continue;
    await conn.query(stmt);
  }
  logStep(`${name} bitti`);
}

async function main() {
  const flags = parseFlags(process.argv);

  if (!flags.noDrop) {
    try {
      const root = await createRoot();
      logStep('DROP + CREATE basliyor (root)');
      await dropAndCreate(root);
      logStep('DB olusturuldu');
      await root.end();
    } catch (err: any) {
      if (err?.code === 'ER_ACCESS_DENIED_NO_PASSWORD_ERROR' || err?.code === 'ER_ACCESS_DENIED_ERROR') {
        logStep('Root baglantisi basarisiz — app kullanicisi ile DROP/CREATE deneniyor...');
        try {
          const appConn = await mysql.createConnection({
            host: env.DB.host,
            port: env.DB.port,
            user: env.DB.user,
            password: env.DB.password,
            multipleStatements: true,
          });
          assertSafeToDrop(env.DB.name);
          await appConn.query(`DROP DATABASE IF EXISTS \`${env.DB.name}\`;`);
          await appConn.query(`CREATE DATABASE \`${env.DB.name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
          await appConn.end();
          logStep('DB olusturuldu (app kullanicisi ile)');
        } catch (appErr: any) {
          logStep('app kullanicisi ile de DROP/CREATE basarisiz — --no-drop moduna geciliyor');
        }
      } else {
        throw err;
      }
    }
  } else {
    logStep('--no-drop: DROP/CREATE atlaniyor');
  }

  const conn = await createConnToDb();

  try {
    const ADMIN = getAdminVars();
    const EDITOR = getEditorVars();
    const DEALER = getDealerVars();

    const envDir = process.env.SEED_SQL_DIR && process.env.SEED_SQL_DIR.trim();
    const distSql = path.resolve(__dirname, 'sql');
    const srcSql  = path.resolve(__dirname, '../../../src/db/seed/sql');
    const sqlDir  = envDir ? path.resolve(envDir) : (fs.existsSync(distSql) ? distSql : srcSql);

    const files = fs.readdirSync(sqlDir)
      .filter(f => f.endsWith('.sql'))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    for (const f of files) {
      const abs = path.join(sqlDir, f);
      if (!shouldRun(abs, flags)) {
        logStep(`${f} atlandi (--only filtresi)`);
        continue;
      }
      await runSqlFile(conn, abs, ADMIN, EDITOR, DEALER);
    }
    logStep('Seed tamamlandi.');
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
