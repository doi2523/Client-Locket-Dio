function RollcallReactions({ reactions = [] }) {
  if (reactions.length === 0) return null;

  return (
    <div className="flex gap-1 text-lg max-w-full overflow-hidden">
      {reactions.slice(0, 10).map((r, i) => (
        <span key={i}>{r.reaction}</span>
      ))}
      {reactions.length > 10 && (
        <span>+{reactions.length - 10}</span>
      )}
    </div>
  );
}

export default RollcallReactions;
