export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand">
      <img src="/brand/mark.svg" alt="" width="38" height="38" />
      {!compact && (
        <span>
          Still<span className="brand-light">Due</span>
          <span className="brand-period">.</span>
        </span>
      )}
    </span>
  );
}
