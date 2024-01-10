import { Pure } from "@design-express/fabrica";
import { peerIdFromString } from "@libp2p/peer-id";

export class peerFind extends Pure {
  static path = "IPFS/Peer";
  static title = "Find";
  static description = "Find Peer";

  constructor() {
    super();
    this.addInput("node", "ipfs::node,object");
    this.addInput("peerId", "libp2p::peerid,string");
  }

  async onExecute() {
    const _node = this.getInputData(1);
    let _pid = this.getInputData(2);
    if (typeof _pid === "string") _pid = peerIdFromString(_pid);
    // _node.libp2p.peerRouting.findPeer(_pid).then((i) => console.log(i));
    for await (const event of _node.libp2p.services.dht.findPeer(_pid)) {
      // console.log(event)
      if (event.type === 2 && event.name === "FINAL_PEER") {
        const maddr = event.peer.multiaddrs;
        // .filter((i) => i.getPeerId() !== cid);
        // console.info("FIND", event);
        try {
          await _node.libp2p.dial(maddr);
          // console.log(maddr);
        } catch (e) {
          console.log(e);
          // console.log(maddr);
        }
        return maddr;
      }
      if (event.type === 1 && event.messageType === "FIND_NODE") {
        for (let md of event.closer) {
          try {
            // console.log(md.multiaddrs);

            await _node.libp2p.dial(md.multiaddrs);
          } catch (e) {
            console.log(e);
          }
        }
      }
    }
  }
}
