export function WarningBlock({ title, children }) {
  return (
    <div className="mt-4 p-4 rounded-xl border border-warning bg-warning/10">
      <h4 className="font-semibold text-sm mb-2 text-warning">{title}</h4>
      <div className="text-sm opacity-80">{children}</div>
    </div>
  );
}
