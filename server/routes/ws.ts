export default defineWebSocketHandler({
  open(peer) {
    peer.send({ user: "server", message: `Welcome ${peer}!` });
    peer.peers.forEach((p) => {
      p.send({ user: "server", message: `${peer} joined!` })
    })
  },
  message(peer, message) {
    if (message.text().includes("ping")) {
      peer.send({ user: "server", message: "pong" });
    } else {
      const msg = {
        user: peer.toString(),
        message: message.toString(),
      };
      peer.send(msg); // echo
      peer.publish("chat", msg);
    }
  },
  close(peer) {
    peer.peers.forEach((p) => {
      p.send({ user: "server", message: `${peer} left!` })
    })
  },
});