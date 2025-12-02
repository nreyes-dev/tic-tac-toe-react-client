// src/App.jsx
import { useEffect, useState } from "react";
import {
  createGame,
  getGameHistory,
  makeMove,
  getGame,
  getPlayerId,
  API_BASE_URL,
} from "./api";
import GameHistory from "./components/GameHistory";
import GameBoard from "./components/GameBoard";
import PlayerIdBadge from "./components/PlayerIdBadge";

const NREYES_GH_BASE = "https://github.com/nreyes-dev";
const FRONT_REPO_URL = `${NREYES_GH_BASE}/tic-tac-toe-react-client`;
const BACK_REPO_URL = `${NREYES_GH_BASE}/tic-tac-toe-api`;

function App() {
  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingGame, setLoadingGame] = useState(false);
  const [creatingGame, setCreatingGame] = useState(false);
  const [error, setError] = useState(null);

  // ----- API helpers -----

  async function loadHistory({ selectMostRecentIfNone = true } = {}) {
    try {
      setLoadingHistory(true);
      setError(null);

      const data = await getGameHistory(); // { games: [...] }
      const list = data.games || [];
      setGames(list);

      if (list.length === 0) {
        // No games at all
        setSelectedGameId(null);
        setSelectedGame(null);
        return;
      }

      // If nothing selected yet and caller wants auto-select, pick the most recent one
      if (!selectedGameId && selectMostRecentIfNone) {
        const lastGame = list[list.length - 1];
        setSelectedGameId(lastGame.game_id);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to load game history.");
    } finally {
      setLoadingHistory(false);
    }
  }

  async function loadSingleGame(gameId) {
    if (!gameId) {
      setSelectedGame(null);
      return;
    }

    try {
      setLoadingGame(true);
      setError(null);
      const game = await getGame(gameId);
      setSelectedGame(game);
    } catch (e) {
      console.error(e);
      setError("Failed to load game.");
      setSelectedGame(null);
    } finally {
      setLoadingGame(false);
    }
  }

  // ----- Event handlers -----

  async function handleCreateGame() {
    try {
      setCreatingGame(true);
      setError(null);

      // Create a new game on the server
      const newGame = await createGame();

      // Select it immediately and store full state from server
      setSelectedGameId(newGame.game_id);
      setSelectedGame(newGame);

      // Refresh history, but don't override the selectedGameId we just set
      await loadHistory({ selectMostRecentIfNone: false });
    } catch (e) {
      console.error(e);
      setError("Failed to create a new game.");
    } finally {
      setCreatingGame(false);
    }
  }

  async function handleMove(x, y) {
    if (!selectedGame) return;
    if (selectedGame.game_result !== "ongoing") return;

    const symbolAtSpot = selectedGame.game_state?.[y]?.[x] ?? ".";
    if (symbolAtSpot !== ".") return;

    try {
      setError(null);

      // The server will:
      // 1. apply the human move
      // 2. apply the CPU move if the game is still ongoing
      // 3. return the full, new game state
      const updatedGame = await makeMove(selectedGame.game_id, x, y);

      setSelectedGame(updatedGame);

      // Also refresh the history so W/L/D and timestamps stay in sync
      await loadHistory({ selectMostRecentIfNone: false });
    } catch (e) {
      console.error(e);
      setError("Failed to make move.");
    }
  }

  // ----- Effects -----

  // Initial load of history on mount
  useEffect(() => {
    loadHistory({ selectMostRecentIfNone: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Whenever selectedGameId changes (via history click or auto-select), load that game from the server
  useEffect(() => {
    if (!selectedGameId) {
      setSelectedGame(null);
      return;
    }
    loadSingleGame(selectedGameId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGameId]);

  const playerId = getPlayerId();

  // ----- Render -----

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Noughts and Crosses{" "}
              <br />
              <span className="text-slate-400 text-base">
                (a.k.a Tic-tac-toe)
              </span>
            </h1>
            <p className="text-sm text-slate-400">
              by{" "}
              <a
                className="font-medium text-slate-200 hover:text-sky-300"
                href={NREYES_GH_BASE}
                target="_blank"
                rel="noreferrer"
              >
                Nicolás Reyes
              </a>
            </p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-300">
              <a
                href={BACK_REPO_URL}
                className="underline underline-offset-4 hover:text-sky-300"
                target="_blank"
                rel="noreferrer"
              >
                Backend source
              </a>
              <a
                href={FRONT_REPO_URL}
                className="underline underline-offset-4 hover:text-sky-300"
                target="_blank"
                rel="noreferrer"
              >
                Frontend source
              </a>
              <span className="text-slate-500">|</span>
              <a
                href={API_BASE_URL}
                className="underline underline-offset-4 hover:text-sky-300"
                target="_blank"
                rel="noreferrer"
              >
                Hosted API
              </a>
            </div>
          </div>

          <div className="flex items-end gap-3 justify-between sm:justify-end">
            <button
              onClick={handleCreateGame}
              disabled={creatingGame}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {creatingGame ? "Creating..." : "New Game"}
            </button>
            <PlayerIdBadge playerId={playerId} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6 grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <GameBoard
            game={selectedGame}
            onMove={handleMove}
            loading={loadingGame}
          />
          <GameHistory
            games={games}
            loading={loadingHistory}
            error={error}
            selectedGameId={selectedGameId}
            onSelectGame={setSelectedGameId}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
