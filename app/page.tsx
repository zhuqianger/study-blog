import Link from "next/link";
import { DbNotice } from "@/components/db-notice";
import { isLoggedIn } from "@/lib/auth";
import { toDbMessage } from "@/lib/db";
import { excerpt, formatDate, readingMinutes } from "@/lib/format";
import { listPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof listPosts>> = [];
  let error = "";

  try {
    posts = await listPosts();
  } catch (cause) {
    error = toDbMessage(cause);
  }

  const loggedIn = await isLoggedIn();
  const [featured, ...rest] = posts;

  return (
    <main>
      <section className="mb-12 max-w-2xl">
        <p className="text-xs tracking-[0.28em] text-accent uppercase">Notes</p>
        <h1 className="mt-4 max-w-xl font-serif text-4xl leading-tight text-ink sm:text-5xl">
          把学习写成
          <br />
          可以回看的文章
        </h1>
        <p className="mt-5 text-base leading-8 text-muted">
          记录概念、踩坑和还没想明白的问题。登录后可以写文章，也可以修改或删除。
        </p>
      </section>

      {error ? <DbNotice message={error} /> : null}

      {!error && posts.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-line bg-card/70 px-8 py-16 text-center">
          <h2 className="font-serif text-3xl">还没有文章</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
            从今天读过的一页书、一个报错，或者一个突然想通的点开始。
          </p>
          {loggedIn ? (
            <Link
              href="/posts/new"
              className="mt-8 inline-flex rounded-full bg-ink px-5 py-3 text-sm text-paper"
            >
              写第一篇
            </Link>
          ) : null}
        </section>
      ) : null}

      {!error && featured ? (
        <div className="space-y-4">
          <Link
            href={`/posts/${featured.id}`}
            className="group block rounded-[2rem] border border-line bg-card px-8 py-10 shadow-[0_24px_60px_-40px_rgba(70,40,16,0.55)] transition hover:-translate-y-0.5"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs tracking-wide text-muted">
              <span>{formatDate(featured.createdAt)}</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span>约 {readingMinutes(featured.content)} 分钟</span>
            </div>
            <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-tight transition group-hover:text-accent-deep">
              {featured.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
              {excerpt(featured)}
            </p>
          </Link>

          {rest.length > 0 ? (
            <ul className="divide-y divide-line overflow-hidden rounded-[2rem] border border-line bg-card">
              {rest.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/posts/${post.id}`}
                    className="grid gap-3 px-8 py-6 transition hover:bg-[#fbf7f0] sm:grid-cols-[9rem_1fr] sm:items-baseline"
                  >
                    <time className="text-sm text-muted">{formatDate(post.createdAt)}</time>
                    <span>
                      <span className="block font-serif text-2xl text-ink">{post.title}</span>
                      <span className="mt-2 block text-sm leading-7 text-muted">
                        {excerpt(post)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </main>
  );
}
