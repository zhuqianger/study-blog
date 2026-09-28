"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { toDbMessage } from "@/lib/db";
import {
  createPostRecord,
  deletePostRecord,
  updatePostRecord,
  type PostInput,
} from "@/lib/posts";

export type FormState = {
  error: string;
  title: string;
  summary: string;
  content: string;
};

function readInput(formData: FormData): PostInput {
  return {
    title: String(formData.get("title") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
  };
}

function validate(input: PostInput) {
  if (!input.title) {
    return "请填写标题。";
  }
  if (input.title.length > 120) {
    return "标题请控制在 120 个字以内。";
  }
  if (input.summary.length > 240) {
    return "摘要请控制在 240 个字以内。";
  }
  if (!input.content) {
    return "请填写正文。";
  }
  if (input.content.length > 20000) {
    return "正文请控制在 20000 个字以内。";
  }
  return "";
}

function readId(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return id;
}

const denied: FormState = {
  error: "请先登录后再操作。",
  title: "",
  summary: "",
  content: "",
};

export async function createPost(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const input = readInput(formData);
  if (!(await isLoggedIn())) {
    return { ...denied, ...input };
  }
  const error = validate(input);
  if (error) {
    return { error, ...input };
  }

  let id = 0;
  try {
    id = await createPostRecord(input);
  } catch (cause) {
    return { error: toDbMessage(cause), ...input };
  }

  revalidatePath("/");
  redirect(`/posts/${id}`);
}

export async function updatePost(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const input = readInput(formData);
  if (!(await isLoggedIn())) {
    return { ...denied, ...input };
  }

  const id = readId(formData);
  if (!id) {
    return { error: "文章不存在。", ...input };
  }

  const error = validate(input);
  if (error) {
    return { error, ...input };
  }

  try {
    const updated = await updatePostRecord(id, input);
    if (!updated) {
      return { error: "文章不存在，可能已经被删除。", ...input };
    }
  } catch (cause) {
    return { error: toDbMessage(cause), ...input };
  }

  revalidatePath("/");
  revalidatePath(`/posts/${id}`);
  redirect(`/posts/${id}`);
}

export async function deletePost(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isLoggedIn())) {
    return denied;
  }

  const id = readId(formData);
  if (!id) {
    return { error: "文章不存在。", title: "", summary: "", content: "" };
  }

  try {
    const deleted = await deletePostRecord(id);
    if (!deleted) {
      return {
        error: "文章不存在，可能已经被删除。",
        title: "",
        summary: "",
        content: "",
      };
    }
  } catch (cause) {
    return {
      error: toDbMessage(cause),
      title: "",
      summary: "",
      content: "",
    };
  }

  revalidatePath("/");
  redirect("/");
}
