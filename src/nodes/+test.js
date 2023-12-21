import { Pure } from "@design-express/fabrica";
// import { strings } from "@helia/strings";

export class asdasdasd extends Pure {
  static path = "wrwwr";
  static title = "String";
  static description = "add and get strings from IPFS Node";
  static instance = undefined;

  constructor() {
    super();
    this.addInput("instance", "helia,object");
    this.addOutput("fs", "object");
  }

  onExecute() {
    console.log("EXEC");
  }
  __clone__() {
    console.log("CLONE");
  }
}
