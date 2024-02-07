import { Pure } from "@design-express/fabrica";
import { multiaddr } from "@multiformats/multiaddr";

// import { peerIdFromString } from "@libp2p/peer-id";

export class dial extends Pure {
  static path = "IPFS/Peer";
  static title = "Dial";
  static description = "Dial";

  constructor() {
    super({ out: false });
    this.addInput("node", "ipfs::node,object");
    this.addInput("multiAddr", "libp2p::multiAddr,string");
    this.addOutput("onConnect", -1);
  }

  async onExecute() {
    const _node = this.getInputData(1);
    const _maddr = this.getInputData(2);
    if (typeof _maddr !== "string") return;
    const __maddr = multiaddr(_maddr);
    const _reqPeerId = __maddr.getPeerId().toString();
    const onConnection = (e) => {
      console.log("ttttttt", e.detail, e.detail.toString(), _reqPeerId);
      if (e.detail?.toString() === _reqPeerId) {
        this.triggerSlot(1);
        this._dispose?.();
      }
      // if (
      //   _node.libp2p
      //     .getPeers()
      //     .some((peerId) => peerId.toString() === _reqPeerId)
      // ) {
      //   this.triggerSlot(1);
      //   this._dispose?.();
      // }
    };

    _node.libp2p.addEventListener("peer:connect", onConnection);
    this._dispose = () =>
      _node.libp2p.removeEventListener("peer:connect", onConnection);

    await _node.libp2p.dial(__maddr);
  }

  onRemoved() {
    this._dispose?.();
  }
}
