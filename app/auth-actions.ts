"use server";

import { redirect } from "next/navigation";
import { clearSession, credentialsMatch, safeNextPath, setSession } from "@/lib/auth";

export type LoginState = {
  error: string;
};

export async function login(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = safeNextPath(formData.get("from"));

  if (!username || !password || !credentialsMatch(username, password)) {
    return { error: "账号或密码不正确。" };
  }

  try {
    await setSession();
  } catch {
    return { error: "登录配置不完整，请检查环境变量。" };
  }

  redirect(nextPath);
}

export async function logout() {
  await clearSession();
  redirect("/");
}
