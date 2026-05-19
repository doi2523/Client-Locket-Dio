const FilterButton = ({
  label,
  count,
  active,
  activeClass = "bg-blue-500 text-white",
  inactiveClass = "bg-base-200",
  onClick,
}) => {
  return (
    <button
      className={`px-3 py-1 rounded-lg flex items-center transition ${
        active ? activeClass : inactiveClass
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <p>{label}</p>

        <div
          className={`w-px h-4 ${
            active ? "bg-white/30" : "bg-base-content/20"
          }`}
        />

        <span className="text-sm font-bold">({count})</span>
      </div>
    </button>
  );
};
export default FilterButton;
