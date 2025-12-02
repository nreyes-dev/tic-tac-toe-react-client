function ResultPill({ result }) {
  let label = "";
  let classes = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ";

  switch (result) {
    case "ongoing":
      label = "ONGOING";
      classes += "bg-slate-800 text-slate-200 border border-slate-600";
      break;
    case "human won":
      label = "W";
      classes += "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40";
      break;
    case "CPU won":
      label = "L";
      classes += "bg-rose-500/10 text-rose-300 border border-rose-500/40";
      break;
    case "draw":
      label = "D";
      classes += "bg-amber-500/10 text-amber-300 border border-amber-500/40";
      break;
    default:
      label = "?";
      classes += "bg-slate-800 text-slate-300 border border-slate-600";
  }

  return <span className={classes}>{label}</span>;
}

export default ResultPill;
