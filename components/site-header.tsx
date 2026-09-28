import Link from "next/link";
import { logout } from "@/app/auth-actions";
import { isLoggedIn } from "@/lib/auth";

export async function SiteHeader() {
  const loggedIn = await isLoggedIn();

  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-accent/40 font-serif text-sm text-accent">
            记
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-lg tracking-wide text-ink">
              墨记
            </span>
            <span className="block text-[11px] tracking-[0.22em] text-muted uppercase">
              Study Blog
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="rounded-full px-3 py-2 text-muted transition hover:text-ink"
          >
            文章
          </Link>
          {loggedIn ? (
            <>
              <Link
                href="/posts/new"
                className="rounded-full bg-ink px-4 py-2 text-paper transition hover:bg-accent-deep"
              >
                写一篇
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-full px-3 py-2 text-muted transition hover:text-ink"
                >
                  退出
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-ink px-4 py-2 text-paper transition hover:bg-accent-deep"
            >
              登录
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
