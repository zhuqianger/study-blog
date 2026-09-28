import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { isLoggedIn, safeNextPath } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  if (await isLoggedIn()) {
    redirect("/");
  }

  const { from } = await searchParams;

  return (
    <main className="mx-auto max-w-md py-8">
      <p className="text-xs tracking-[0.28em] text-accent uppercase">Sign in</p>
      <h1 className="mt-4 font-serif text-4xl">登录后才能写文章</h1>
      <p className="mt-3 mb-8 text-sm leading-7 text-muted">
        未登录时可以阅读全部文章。新增、编辑和删除只对登录账号开放。
      </p>
      <section className="rounded-[2rem] border border-line bg-card px-6 py-8">
        <LoginForm from={safeNextPath(from)} />
      </section>
    </main>
  );
}
