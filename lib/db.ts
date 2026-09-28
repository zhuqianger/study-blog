import mysql from "mysql2/promise";

export class DatabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseConfigError";
  }
}

let pool: mysql.Pool | null = null;
let schemaReady: Promise<void> | null = null;

function readConfig() {
  const host = process.env.DB_HOST?.trim();
  const user = process.env.DB_USER?.trim();
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME?.trim();
  const port = Number(process.env.DB_PORT ?? "3306");

  if (!host || !user || password == null || password === "" || !database) {
    throw new DatabaseConfigError(
      "数据库账号还没配好。请在项目根目录的 .env.local 里填写 DB_USER 和 DB_PASSWORD，然后重启开发服务器。",
    );
  }

  if (!Number.isInteger(port) || port <= 0) {
    throw new DatabaseConfigError("DB_PORT 不是有效端口。");
  }

  return { host, user, password, database, port };
}

export function getPool() {
  if (!pool) {
    const config = readConfig();
    pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: 8,
      charset: "utf8mb4",
      connectTimeout: 8000,
      dateStrings: true,
    });
  }

  return pool;
}

export async function ensurePostsTable() {
  if (!schemaReady) {
    schemaReady = getPool()
      .query(`
        CREATE TABLE IF NOT EXISTS posts (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT,
          title VARCHAR(120) NOT NULL,
          summary VARCHAR(240) NOT NULL DEFAULT '',
          content MEDIUMTEXT NOT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)
      .then(() => undefined)
      .catch((error: unknown) => {
        schemaReady = null;
        throw error;
      });
  }

  await schemaReady;
}

export function toDbMessage(error: unknown) {
  if (error instanceof DatabaseConfigError) {
    return error.message;
  }

  console.error(error);

  const code =
    error && typeof error === "object" && "code" in error
      ? String(error.code)
      : "";

  if (code === "ER_ACCESS_DENIED_ERROR") {
    return "数据库拒绝了当前账号，请检查 .env.local 里的 DB_USER 和 DB_PASSWORD。";
  }

  if (code === "ER_BAD_DB_ERROR") {
    return "找不到数据库 study_blog，请确认库名是否已经创建。";
  }

  if (
    code === "ECONNREFUSED" ||
    code === "ETIMEDOUT" ||
    code === "ENOTFOUND" ||
    code === "ECONNRESET" ||
    code === "PROTOCOL_CONNECTION_LOST"
  ) {
    return "连不上数据库。请确认主机、端口，以及云数据库是否放行了当前机器的访问。";
  }

  return "访问数据库时出错，请稍后再试。";
}
