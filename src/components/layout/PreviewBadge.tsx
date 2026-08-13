export default function PreviewBadge() {
  return (
    <a
      href="https://in-flu-ential.vercel.app"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-ink/90 px-3 py-2 font-mono text-xs text-cream backdrop-blur transition hover:opacity-90"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-flame" />
      Design Preview &middot; IN-FLU-ENTIAL
    </a>
  );
}
