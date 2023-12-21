import { ImPure, Pure } from "@design-express/fabrica";
import { unixfs } from "@helia/unixfs";

export class Add extends Pure {
  static path = "IPFS/impl";
  static title = "Add";
  static description = "Add data to IPFS.";

  constructor() {
    super();
    this.addInput("fs", "fs,object");
    this.addInput("store", "store,object");
    this.addInput("path", "string");
    this.addInput("data", "");
    this.addOutput("CID", "string");
  }

  async onExecute() {
    const decoder = new TextDecoder();

    const fs = this.getInputData(1);
    const _cid = await fs.addFile(
      {
        path: `${this.getInputData(3)}`,
        content: Buffer.from(this.getInputData(4), "utf-8"),
      },
      this.getInputData(2)
    );
    this.setOutputData(1, `${_cid}`);
    let text = "";
    for await (const chunk of fs.cat(_cid)) {
      text += decoder.decode(chunk, {
        stream: true,
      });
    }
    console.log(text);
  }
  // __clone__() {}
}

export class Get extends Pure {
  static path = "IPFS/impl";
  static title = "Get";
  static description = "Get data from IPFS.";

  constructor() {
    super();
    this.addInput("fs", "object");
    this.addInput("CID", "");
    this.addOutput("data", "");
  }

  async onExecute() {
    const fs = this.getInputData(1);
    const _data = await fs.get(this.getInputData(2));
    this.setOutputData(1, _data);
  }
  // __clone__() {}
}

export class UnixFS extends Pure {
  constructor() {
    super();
    this.addInput("instance", "helia,object");
    this.addOutput("fs", "fs");
  }
  onExecute() {
    const _helia = this.getInputData(1);
    this.setOutputData(1, unixfs(_helia));
  }
  __clone__() {
    // this.value = {};
  }
}
