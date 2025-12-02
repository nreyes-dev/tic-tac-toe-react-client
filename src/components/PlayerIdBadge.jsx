import { refreshIdentity } from "../api";

function PlayerIdBadge({ playerId }) {
  const hasId = Boolean(playerId);
  const display = hasId ? playerId : "-";

  return (
    <div className="text-xs rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 shadow-sm flex flex-col gap-1 w-fit">
      <div className="text-slate-400 uppercase tracking-wide text-[10px]">
        Player ID
      </div>

      <div className="font-mono text-[11px] text-slate-100 break-all bg-slate-800/40 px-2 py-1 rounded max-w-[200px]">
        {display}
      </div>

      {hasId ? (
        <button
          onClick={refreshIdentity}
          className="self-start mt-1 px-2 py-1 text-[10px] font-medium bg-slate-700 hover:bg-slate-600 rounded transition"
        >
          Refresh identity
        </button>
      ) : (
        <div className="text-[10px] text-slate-500 mt-1">
          A new ID will be created when you start a game.
        </div>
      )}
    </div>
  );
}

export default PlayerIdBadge;
