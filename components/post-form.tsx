"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/actions";
import type { PostInput } from "@/lib/posts";

const fieldClass =
  "w-full rounded-2xl border border-line bg-paper/60 px-4 py-3 text-ink outline-none transition placeholder:text-muted/70 focus:border-accent focus:bg-card";

export function PostForm({
  action,
  initial,
  id,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial?: PostInput;
  id?: number;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {
    error: "",
    title: initial?.title ?? "",
    summary: initial?.summary ?? "",
    content: initial?.content ?? "",
  });

  return (
    <form
      action={formAction}
      key={`${state.error}:${state.title}:${state.summary}:${state.content}`}
      className="space-y-6"
    >
      {id ? <input type="hidden" name="id" value={id} /> : null}
      <label className="block">
        <span className="mb-2 block text-sm text-muted">标题</span>
        <input
          name="title"
          required
          maxLength={120}
          defaultValue={state.title}
          placeholder="给这篇文章一个清楚的名字"
          className={`${fieldClass} font-serif text-2xl`}
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-muted">摘要</span>
        <input
          name="summary"
          maxLength={240}
          defaultValue={state.summary}
          placeholder="用一两句话说明这篇文章在讲什么，可以留空"
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-muted">正文</span>
        <textarea
          name="content"
          required
          rows={16}
          maxLength={20000}
          defaultValue={state.content}
          placeholder="空一行可以分成新的段落。"
          className={`${fieldClass} min-h-80 resize-y leading-8`}
        />
      </label>
      {state.error ? (
        <p className="rounded-2xl bg-[#f8ebe3] px-4 py-3 text-sm text-accent-deep">
          {state.error}
        </p>
      ) : null}
      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-6 py-3 text-sm text-paper transition hover:bg-accent-deep disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "保存中…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
