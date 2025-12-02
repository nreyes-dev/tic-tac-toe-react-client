import ResultPill from "./ResultPill";

function formatDate(ts) {
  if (!ts) return "-";
  const d = new Date(ts * 1000);
  return d.toLocaleString();
}

function computeRecord(games) {
  let wins = 0;
  let losses = 0;
  let draws = 0;

  for (const g of games) {
    switch (g.game_result) {
      case "human won":
        wins++;
        break;
      case "CPU won":
        losses++;
        break;
      case "draw":
        draws++;
        break;
      default:
        break;
    }
  }

  return { wins, losses, draws };
}

function GameHistory({ games, loading, error, selectedGameId, onSelectGame }) {
  const { wins, losses, draws } = computeRecord(games || []);

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-100">
          Game history
        </h2>
        <div className="text-xs text-slate-300">
          Record:{" "}
          <span className="font-semibold">
            {wins} - {losses}
          </span>{" "}
          <span className="text-slate-500">(W - L)</span>
          {draws > 0 && (
            <span className="text-slate-400 ml-1">
              · {draws} draw{draws !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-3 text-xs text-rose-400 bg-rose-950/60 border border-rose-700/60 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
          Loading…
        </div>
      ) : games.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-500 text-center px-4">
          No games yet. Click <span className="font-semibold mx-1">New Game</span>{" "}
          to start playing.
        </div>
      ) : (
        <ul className="space-y-1 overflow-y-auto pr-1 text-sm">
          {[...games]
            .slice()
            .reverse() // show newest first
            .map((game) => {
              const isSelected = game.game_id === selectedGameId;
              return (
                <li key={game.game_id}>
                  <button
                    type="button"
                    onClick={() => onSelectGame(game.game_id)}
                    className={
                      "w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-left transition " +
                      (isSelected
                        ? "bg-slate-800 border border-sky-500/60 shadow-sm"
                        : "bg-slate-900/40 border border-slate-800 hover:bg-slate-800/70")
                    }
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">
                          {game.game_id.slice(0, 8)}
                        </span>
                        <ResultPill result={game.game_result} />
                      </div>
                      <span className="text-[11px] text-slate-500 mt-0.5">
                        {formatDate(game.created_at)}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Player:{" "}
                      <span className="font-mono text-slate-200">
                        {game.human_plays_as}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
        </ul>
      )}
    </section>
  );
}

export default GameHistory;
