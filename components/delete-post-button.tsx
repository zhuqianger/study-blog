"use client";

import { useActionState, useState } from "react";
import { deletePost, type FormState } from "@/app/actions";

export function DeletePostButton({ id }: { id: number }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(deletePost, {
    error: "",
    title: "",
    summary: "",
    content: "",
  } satisfies FormState);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:border-accent/40 hover:text-accent-deep"
      >
        删除
      </button>
      {open ? (
        <div className="fixed inset-0 z-30 grid place-items-center bg-ink/40 px-6">
          <form
            action={formAction}
            className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl"
          >
            <input type="hidden" name="id" value={id} />
            <h2 className="font-serif text-2xl text-ink">删除这篇文章？</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              删除后无法从页面恢复。
            </p>
            {state.error ? (
              <p className="mt-4 rounded-2xl bg-[#f8ebe3] px-4 py-3 text-sm text-accent-deep">
                {state.error}
              </p>
            ) : null}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-2 text-sm text-muted"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-accent px-4 py-2 text-sm text-white transition hover:bg-accent-deep disabled:opacity-70"
              >
                {pending ? "删除中…" : "确认删除"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
