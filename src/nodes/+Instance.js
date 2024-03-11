import { ImPure } from "@design-express/fabrica";
import { libp2pDefaults } from "../config/libp2p-config";
import { createHelia } from "helia";
import { peerIdFromString } from "@libp2p/peer-id";
// the block/data Store will be optional
import { IDBDatastore } from "datastore-idb";
import { IDBBlockstore } from "blockstore-idb";
import { multiaddr } from "@multiformats/multiaddr";

export class ipfsInstance extends ImPure {
  static path = "IPFS";
  static title = "Instance";
  static description = "Create instance";

  constructor() {
    super();
    this.addInput("bootstraps", "array,string");
    this.addInput("peer_id", "ipfs::peerid,string");
    this.addInput("service", "ipfs::service,object", {
      name: "service",
      nameLocked: true,
    });
    this.addInput("dispose", -1);
    this.addOutput("node", "ipfs::node,object");
    this.addOutput("peer_id", "ipfs::peerid,string");
    this.node = undefined;
  }

  getInputs() {
    return [
      [
        "service",
        "ipfs::service,object",
        { name: "service", nameLocked: true },
      ],
    ];
  }

  async onExecute() {
    let addrs = this.getInputData(1) ?? [];
    if (typeof addrs === "string") {
      addrs = [addrs];
    }
    if (!this.node) {
      const services = {};
      let _data = undefined;
      for (let i = 3, _slot; i < this.inputs.length; i++) {
        _slot = this.inputs[i];
        if (_slot.name === "service") {
          _data = this.getInputData(i);
          if (typeof _data !== "object") continue;
          for (let [k, v] of Object.entries(_data)) {
            services[k] = v;
          }
        }
      }

      let _peer_id = this.getInputData(2) ?? undefined;
      if (!!_peer_id && typeof _peer_id === "string") {
        _peer_id = peerIdFromString(_peer_id);
      }
      const datastore = new IDBDatastore("datastore");
      const blockstore = new IDBBlockstore("blockstore");
      await Promise.all([datastore.open(), blockstore.open()]);
      this.node = createHelia({
        libp2p: libp2pDefaults(addrs, services, _peer_id),
        datastore,
        blockstore,
      });
    }
    const node = await this.node;
    const _ids = (addrs ?? []).map((i) => multiaddr(i).getPeerId().toString());

    node.libp2p.addEventListener("peer:disconnect", (e) => {
      const peerId = e.detail;
      const idx = _ids.indexOf(peerId.toString());
      if (idx > -1) node.libp2p.dial(multiaddr(addrs[idx]));
    });

    // node.libp2p.peerRouting.findPeer()
    this.setOutputData(1, node);
    this.setOutputData(2, node.libp2p.peerId.toString());
  }
  async onAction(name) {
    if (name === "dispose") {
      (await this.node)?.stop();
      this.node = undefined;
      return;
    }
    return super.onAction(...arguments);
  }
  async onRemoved() {
    (await this.node)?.stop();
  }
}
