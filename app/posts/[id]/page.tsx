import Link from "next/link";
import { notFound } from "next/navigation";
import { DeletePostButton } from "@/components/delete-post-button";
import { isLoggedIn } from "@/lib/auth";
import { toDbMessage } from "@/lib/db";
import { formatDate, readingMinutes } from "@/lib/format";
import { getPost } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    notFound();
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

  const paragraphs = post.content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const edited = post.updatedAt !== post.createdAt;
  const loggedIn = await isLoggedIn();

  return (
    <main className="mx-auto max-w-3xl">
      <Link href="/" className="text-sm text-muted transition hover:text-ink">
        返回文章
      </Link>
      <article className="mt-8">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
          <time>{formatDate(post.createdAt)}</time>
          <span className="h-1 w-1 rounded-full bg-accent" />
          <span>约 {readingMinutes(post.content)} 分钟</span>
          {edited ? <span>已于 {formatDate(post.updatedAt)} 修改</span> : null}
        </div>
        <h1 className="mt-5 font-serif text-5xl leading-tight">{post.title}</h1>
        {post.summary ? (
          <p className="mt-6 border-l-2 border-accent/50 pl-4 text-lg leading-8 text-muted">
            {post.summary}
          </p>
        ) : null}
        <div className="mt-10 space-y-6 text-[1.05rem] leading-9">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
      {loggedIn ? (
        <div className="mt-12 flex items-center gap-3 border-t border-line pt-6">
          <Link
            href={`/posts/${post.id}/edit`}
            className="rounded-full bg-ink px-4 py-2 text-sm text-paper"
          >
            编辑
          </Link>
          <DeletePostButton id={post.id} />
        </div>
      ) : null}
    </main>
  );
}
