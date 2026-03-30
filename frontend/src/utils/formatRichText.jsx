/** Converts simple **bold** and newlines to JSX (original content; not HTML paste). */
export function formatRichText(text) {
  if (!text) return null;
  const lines = text.split(/\n/);
  return lines.map((line, idx) => (
    <p key={idx} className={line.trim() === "" ? "mb-2" : "mb-3"}>
      {formatLine(line)}
    </p>
  ));
}

function formatLine(line) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) {
      return (
        <strong key={i} className="text-[var(--text-strong)]">
          {m[1]}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
