import axios from "axios";

export const API_BASE_URL = "http://localhost:8080";
const LS_PLAYER_ID_KEY = "nreyes_tic_tac_toe_player_id";

export function getPlayerId() {
  let playerId = localStorage.getItem(LS_PLAYER_ID_KEY);
  return playerId;
}

function setPlayerId(playerId) {
  localStorage.setItem(LS_PLAYER_ID_KEY, playerId);
}

export function refreshIdentity() {
  localStorage.removeItem(LS_PLAYER_ID_KEY);
  window.location.reload();
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

function withPlayerHeader() {
  const playerId = getPlayerId();
  return playerId ? { "X-Player-Id": playerId } : {};
}

export async function createGame() {
  const res = await api.post("/game", null, {
    headers: withPlayerHeader(),
  });

  // Persist player_id if it’s the first time we get one
  if (!getPlayerId() && res.data?.player_id) {
    setPlayerId(res.data.player_id);
  }

  return res.data;
}

export async function getGame(gameId) {
  const res = await api.get(`/game/${gameId}`, {
    headers: withPlayerHeader(),
  });
  return res.data;
}

export async function makeMove(gameId, x, y) {
  const res = await api.post(
    `/game/${gameId}/move`,
    { x, y },
    { headers: withPlayerHeader() }
  );
  return res.data;
}

export async function getGameHistory() {
  try {
    const res = await api.get("/game/history", {
      headers: withPlayerHeader(),
    });
    return res.data;
  } catch (err) {
    if (err.response?.status === 404) {
      return { games: [] };
    }
    throw err;
  }
}