import { Pure } from "@design-express/fabrica";
import { strings } from "@helia/strings";

export class StringModule extends Pure {
  static path = "IPFS";
  static title = "String";
  static description = "add and get strings from IPFS Node";
  static instance = undefined;

  constructor() {
    super();
    this.addInput("instance", "helia,object");
    this.addOutput("fs", "object");
  }

  onExecute() {
    if (StringModule.instance) this.setOutputData(1, StringModule.instance);
    else {
      const _helia = this.getInputData(1);
      this.setOutputData(1, (StringModule.instance = strings(_helia)));
    }
  }
//   __clone__() {}
}
