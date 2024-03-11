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

    await _node.libp2p.dial(__maddr);

    const pid = setInterval(() => {
      if (
        !_node.libp2p
          .getDialQueue()
          .some(({ peerId }) => peerId.toString() === _reqPeerId)
      ) {
        this.triggerSlot(1);
        clearInterval(pid);
      }
    }, 500);
  }

  onRemoved() {
    this._dispose?.();
  }
}