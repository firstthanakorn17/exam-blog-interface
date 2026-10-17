export default function ArticleParallelLayout({
  children,
  comments,
  related,
}: {
  children: React.ReactNode;
  comments: React.ReactNode;
  related: React.ReactNode;
}) {
  return (
    <div className="space-y-12">
      <div>{children}</div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-zinc-200/80">
        <div className="lg:col-span-7">{comments}</div>
        <div className="lg:col-span-5">{related}</div>
      </div>
    </div>
  );
}
