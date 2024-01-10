import { Pure } from "@design-express/fabrica";

export class peerList extends Pure {
  static path = "IPFS/Peer";
  static title = "GetList";
  static description = "List of Peer";

  constructor() {
    super();
    this.addInput("node", "ipfs::node,object");
  }

  async onExecute() {
    const _node = this.getInputData(1);
    // console.log(_node.libp2p.getPeers())
    // console.log(_node.libp2p.getPeers().map((i) => i.toString()));
  }
}
