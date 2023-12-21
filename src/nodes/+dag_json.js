import { Pure } from "@design-express/fabrica";
import { dagJson } from "@helia/dag-json";

export class DagJSONModule extends Pure {
  static path = "IPFS";
  static title = "DagJSON";
  static description = "add and get dagJson from IPFS Node";
  static instance = undefined;

  constructor() {
    super();
    this.addInput("instance", "helia,object");
    this.addOutput("fs", "object");
  }

  onExecute() {
    if (DagJSONModule.instance) this.setOutputData(1, DagJSONModule.instance);
    else {
      const _helia = this.getInputData(1);
      this.setOutputData(1, (DagJSONModule.instance = dagJson(_helia)));
    }
  }
  //   __clone__() {}
}
