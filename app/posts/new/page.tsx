import Link from "next/link";
import { redirect } from "next/navigation";
import { createPost } from "@/app/actions";
import { PostForm } from "@/components/post-form";
import { isLoggedIn } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  if (!(await isLoggedIn())) {
    redirect("/login?from=/posts/new");
  }

  return (
    <main className="mx-auto max-w-3xl">
      <Link href="/" className="text-sm text-muted transition hover:text-ink">
        返回文章
      </Link>
      <h1 className="mt-6 font-serif text-4xl">新的一篇</h1>
      <p className="mt-3 mb-8 text-sm leading-7 text-muted">
        标题和正文是必填的。摘要会显示在首页，留空时会从正文里截取。
      </p>
      <section className="rounded-[2rem] border border-line bg-card px-6 py-8 sm:px-8">
        <PostForm action={createPost} submitLabel="发布" />
      </section>
    </main>
  );
}
