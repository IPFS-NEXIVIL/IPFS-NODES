import { Pure } from "@design-express/fabrica";
import { peerIdFromBytes } from "@libp2p/peer-id";
import { createEd25519PeerId } from "@libp2p/peer-id-factory";
import fileWorker from "../../worker/opsf.worker";

export class peerId extends Pure {
  static path = "IPFS/Peer";
  static title = "PeerID";
  static description = "create or get PeerID";

  constructor() {
    super();
    this.worker = new fileWorker();
    this.worker.onmessage = (v) => {
      console.log(v);
    };
    // console.log(this.worker)
    this.addOutput("peerid", "ipfs::peerid,object");
  }
  changeMode() {
    return 0;
  }
  async onExecute() {
    // console.log(this.worker.postMessage)
    const peerInfo = await new Promise((r) => {
      this.worker.onmessage = (v) => {
        r(Array.isArray(v.data) ? [v.data.peerId, v.data.privateKey] : v.data);
      };
      this.worker.postMessage({ type: "read" });
    });

    if (peerInfo) {
      const _peer = peerIdFromBytes(peerInfo.peerId);
      _peer.privateKey = Buffer.from(peerInfo.privateKey.buffer);
      this.setOutputData(1, _peer);
      return;
    }

    const _id = await createEd25519PeerId();
    this.worker.postMessage({
      type: "write",
      data: _id.toBytes(),
      privKey: _id.privateKey,
    });
    this.setOutputData(1, _id);
    return;

    // if (fileSize === 0) {
    //   // const textEncoder = new TextEncoder();
    //   // textEncoder.encode();
    //   const _id = await createEd25519PeerId();
    //   accessHandle.write(_id.toBytes());
    //   this.setOutputData(1, _id);
    //   return;
    // }
    // const buffer = new DataView(new ArrayBuffer(fileSize));
    // const readBuffer = accessHandle.read(buffer, { at: 0 });
  }

  onRemoved() {
    this.worker?.terminate();
  }
}
