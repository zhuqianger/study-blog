export function DbNotice({ message }: { message: string }) {
  return (
    <section className="rounded-3xl border border-accent/20 bg-card px-6 py-8 shadow-[0_20px_50px_-32px_rgba(80,42,18,0.45)]">
      <p className="text-xs tracking-[0.22em] text-accent uppercase">数据库</p>
      <h2 className="mt-3 font-serif text-2xl text-ink">暂时读不到文章</h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-muted">{message}</p>
    </section>
  );
}
