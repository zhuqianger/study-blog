import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { ensurePostsTable, getPool } from "@/lib/db";

export type Post = {
  id: number;
  title: string;
  summary: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type PostInput = {
  title: string;
  summary: string;
  content: string;
};

type PostRow = RowDataPacket & {
  id: number;
  title: string;
  summary: string;
  content: string;
  created_at: string;
  updated_at: string;
};

function mapPost(row: PostRow): Post {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listPosts() {
  await ensurePostsTable();
  const [rows] = await getPool().query<PostRow[]>(
    "SELECT id, title, summary, content, created_at, updated_at FROM posts ORDER BY created_at DESC, id DESC",
  );
  return rows.map(mapPost);
}

export async function getPost(id: number) {
  await ensurePostsTable();
  const [rows] = await getPool().query<PostRow[]>(
    "SELECT id, title, summary, content, created_at, updated_at FROM posts WHERE id = ? LIMIT 1",
    [id],
  );
  return rows[0] ? mapPost(rows[0]) : null;
}

export async function createPostRecord(input: PostInput) {
  await ensurePostsTable();
  const [result] = await getPool().execute<ResultSetHeader>(
    "INSERT INTO posts (title, summary, content) VALUES (?, ?, ?)",
    [input.title, input.summary, input.content],
  );
  return result.insertId;
}

export async function updatePostRecord(id: number, input: PostInput) {
  await ensurePostsTable();
  const [result] = await getPool().execute<ResultSetHeader>(
    "UPDATE posts SET title = ?, summary = ?, content = ? WHERE id = ?",
    [input.title, input.summary, input.content, id],
  );
  return result.affectedRows > 0;
}

export async function deletePostRecord(id: number) {
  await ensurePostsTable();
  const [result] = await getPool().execute<ResultSetHeader>(
    "DELETE FROM posts WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}
