import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl py-16 text-center">
      <p className="text-xs tracking-[0.28em] text-accent uppercase">404</p>
      <h1 className="mt-4 font-serif text-4xl">这篇文章不在了</h1>
      <p className="mt-3 text-sm leading-7 text-muted">可能链接写错了，或者文章已经被删除。</p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-ink px-5 py-3 text-sm text-paper"
      >
        回到首页
      </Link>
    </main>
  );
}
