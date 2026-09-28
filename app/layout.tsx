import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "墨记",
  description: "把学习写成可以回看的文章",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">
        <div className="flex min-h-full flex-col">
          <SiteHeader />
          <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">{children}</div>
          <footer className="border-t border-line/80">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6 text-xs tracking-wide text-muted">
              <span>墨记 · 学习博客</span>
              <span>写下来，才算记住</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
