import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updatePost } from "@/app/actions";
import { PostForm } from "@/components/post-form";
import { isLoggedIn } from "@/lib/auth";
import { toDbMessage } from "@/lib/db";
import { getPost } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  if (!(await isLoggedIn())) {
    redirect(`/login?from=/posts/${id}/edit`);
  }

  let post: Awaited<ReturnType<typeof getPost>> = null;
  try {
    post = await getPost(id);
  } catch (cause) {
    return (
      <main className="mx-auto max-w-3xl">
        <p className="text-sm leading-7 text-muted">{toDbMessage(cause)}</p>
      </main>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl">
      <Link
        href={`/posts/${post.id}`}
        className="text-sm text-muted transition hover:text-ink"
      >
        返回文章
      </Link>
      <h1 className="mt-6 font-serif text-4xl">编辑文章</h1>
      <p className="mt-3 mb-8 text-sm leading-7 text-muted">{post.title}</p>
      <section className="rounded-[2rem] border border-line bg-card px-6 py-8 sm:px-8">
        <PostForm
          action={updatePost}
          id={post.id}
          submitLabel="保存修改"
          initial={{
            title: post.title,
            summary: post.summary,
            content: post.content,
          }}
        />
      </section>
    </main>
  );
}
