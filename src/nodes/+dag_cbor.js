import { Pure } from "@design-express/fabrica";
import { dagCbor } from "@helia/dag-cbor";

export class DagCBORModule extends Pure {
  static path = "IPFS";
  static title = "DagCBOR";
  static description = "add and get DagCBOR from IPFS Node";
  static instance = undefined;

  constructor() {
    super();
    this.addInput("instance", "helia,object");
    this.addOutput("fs", "object");
  }

  onExecute() {
    if (DagCBORModule.instance) this.setOutputData(1, DagCBORModule.instance);
    else {
      const _helia = this.getInputData(1);
      this.setOutputData(1, (DagCBORModule.instance = dagCbor(_helia)));
    }
  }
  //   __clone__() {}
}
