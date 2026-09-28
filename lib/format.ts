export function formatDate(value: string) {
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function readingMinutes(content: string) {
  const length = content.replace(/\s/g, "").length;
  return Math.max(1, Math.round(length / 400));
}

export function excerpt(post: { summary: string; content: string }) {
  if (post.summary.trim()) {
    return post.summary.trim();
  }

  return post.content.replace(/\s+/g, " ").trim().slice(0, 96);
}
