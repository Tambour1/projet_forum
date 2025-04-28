const peers = new Set();

export default defineWebSocketHandler({
  open(peer) {
    console.log("[ws] open", peer);
    peers.add(peer);
  },
  message(peer, message) {
    console.log("[ws] message", peer, message);
    if (message.text().includes("ping")) {
      // Broadcast à tout le monde
      for (const p of peers) {
        p.send("pong");
      }
    }
  },
  close(peer, event) {
    console.log("[ws] close", peer, event);
    peers.delete(peer);
  },
  error(peer, error) {
    console.log("[ws] error", peer, error);
  },
});
