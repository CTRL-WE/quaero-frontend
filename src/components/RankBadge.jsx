function RankBadge({ rank }) {
  return (
    <span
      className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1
                 text-xs font-bold tracking-wide text-blue-400 ring-1 ring-blue-500/25"
    >
      {rank}
    </span>
  );
}

export default RankBadge;
