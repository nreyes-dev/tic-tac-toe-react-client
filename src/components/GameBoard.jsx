function GameBoard({ game, onMove }) {
  const emptyBoard = [
    [".", ".", "."],
    [".", ".", "."],
    [".", ".", "."],
  ];

  const board = game?.game_state || emptyBoard;
  const result = game?.game_result || "";

  let statusText = "";
  let statusClasses =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ";

  switch (result) {
    case "ongoing":
      statusText = "Your move…";
      statusClasses += "bg-slate-800 text-slate-200 border border-slate-600";
      break;
    case "human won":
      statusText = "You won! 🎉";
      statusClasses +=
        "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40 animate-bounce";
      break;
    case "CPU won":
      statusText = "CPU won. Better luck next time.";
      statusClasses +=
        "bg-rose-500/10 text-rose-300 border border-rose-500/40 animate-pulse";
      break;
    case "draw":
      statusText = "It's a draw 🤝";
      statusClasses +=
        "bg-amber-500/10 text-amber-300 border border-amber-500/40 animate-pulse";
      break;
    default:
      statusText = "";
      statusClasses += "bg-slate-800 text-slate-200 border border-slate-600";
  }

  function handleClickCell(x, y) {
    if (!game) return;
    if (game.game_result !== "ongoing") return;
    const cell = board?.[y]?.[x];
    if (cell && cell !== ".") return;
    onMove(x, y);
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-100">Game</h2>
        {statusText && <span className={statusClasses}>{statusText}</span>}
      </div>

      {!game ? (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-500 text-center px-6">
          No game selected. Create a new game or choose one from the history.
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div
            className={
              "grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-xs " +
              (result === "human won"
                ? "scale-[1.02]"
                : result === "CPU won"
                ? "scale-[0.99]"
                : "scale-100") +
              " transition-transform"
            }
          >
            {board.map((row, y) =>
              row.map((cell, x) => {
                const isEmpty = cell === ".";
                const isClickable = result === "ongoing" && isEmpty;

                let cellClasses =
                  "aspect-square rounded-xl border flex items-center justify-center text-3xl sm:text-4xl font-semibold transition ";

                if (!isEmpty) {
                  const isHuman = cell === game.human_plays_as;
                  if (isHuman) {
                    // human move → green
                    cellClasses +=
                      "border-emerald-400/70 bg-emerald-500/10 text-emerald-300";
                  } else {
                    // CPU move → red
                    cellClasses +=
                      "border-rose-400/70 bg-rose-500/10 text-rose-300";
                  }
                } else {
                  cellClasses +=
                    "border-slate-700 bg-slate-900/60 text-slate-600";
                }

                if (isClickable) {
                  cellClasses +=
                    " cursor-pointer hover:border-emerald-400 hover:bg-slate-800/80";
                } else {
                  cellClasses += " cursor-default";
                }

                return (
                  <button
                    key={`${x}-${y}`}
                    type="button"
                    className={cellClasses}
                    onClick={() => handleClickCell(x, y)}
                  >
                    {isEmpty ? "" : cell}
                  </button>
                );
              })
            )}
          </div>

          <div className="text-xs text-slate-400 text-center mt-2">
            Player plays as{" "}
            <span className="font-mono text-slate-100">
              {game.human_plays_as}
            </span>
            .
          </div>
        </div>
      )}
    </section>
  );
}

export default GameBoard;
