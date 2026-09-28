"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/auth-actions";

const fieldClass =
  "w-full rounded-2xl border border-line bg-paper/60 px-4 py-3 text-ink outline-none transition placeholder:text-muted/70 focus:border-accent focus:bg-card";

export function LoginForm({ from }: { from: string }) {
  const [state, formAction, pending] = useActionState(login, {
    error: "",
  } satisfies LoginState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="from" value={from} />
      <label className="block">
        <span className="mb-2 block text-sm text-muted">账号</span>
        <input
          name="username"
          required
          autoComplete="username"
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-muted">密码</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={fieldClass}
        />
      </label>
      {state.error ? (
        <p className="rounded-2xl bg-[#f8ebe3] px-4 py-3 text-sm text-accent-deep">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-ink px-6 py-3 text-sm text-paper transition hover:bg-accent-deep disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "登录中…" : "登录"}
      </button>
    </form>
  );
}
