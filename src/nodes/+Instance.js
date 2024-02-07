import { ImPure } from "@design-express/fabrica";
import { libp2pDefaults } from "../config/libp2p-config";
import { createHelia } from "helia";
import { peerIdFromString } from "@libp2p/peer-id";
// the block/data Store will be optional
import { IDBDatastore } from "datastore-idb";
import { IDBBlockstore } from "blockstore-idb";

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
    if (!this.node) {
      let addrs = this.getInputData(1) ?? [];
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

      if (typeof addrs === "string") {
        addrs = [addrs];
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

    // node.libp2p.peerRouting.findPeer()
    this.setOutputData(1, node);
    this.setOutputData(2, node.libp2p.peerId.toString());
  }
}
