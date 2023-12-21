import { Pure } from "@design-express/fabrica";
import { json } from "@helia/json";

export class JSONModule extends Pure {
  static path = "IPFS";
  static title = "JSON";
  static description = "add and get JS objects from IPFS Node";
  static instance = undefined;

  constructor() {
    super();
    this.addInput("instance", "helia,object");
    this.addOutput("fs", "object");
  }

  onExecute() {
    if (JSONModule.instance) this.setOutputData(1, JSONModule.instance);
    else {
      const _helia = this.getInputData(1);
      this.setOutputData(1, (JSONModule.instance = json(_helia)));
    }
  }
  //   __clone__() {}
}
