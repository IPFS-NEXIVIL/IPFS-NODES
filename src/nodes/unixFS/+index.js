import { Pure } from "@design-express/fabrica";
import { unixfs } from "@helia/unixfs";

export class unixFS extends Pure {
  static path = "IPFS/UnixFS";
  static title = "UnixFS";
  static description = "IPFS unixFS";
  constructor() {
    super();
    this.addInput("node", "ipfs::node,object");
    this.addOutput("FS", "ipfs::fs");
  }
  onExecute() {
    const _node = this.getInputData(1);
    const _fs = unixfs(_node);

    this.setOutputData(1, _fs);
  }
}

export class Add extends Pure {
  static path = "IPFS/UnixFS/Cmd";
  static title = "Add";
  static description = "IPFS unixFS Add Command";

  static ["@operation"] = {
    type: "enum",
    values: ["bytes", "stream", "file", "directory", "multiple"],
  };
  static #mapper = {
    bytes: "addBytes",
    stream: "addByteStream",
    file: "addFile",
    directory: "addDirectory",
    multiple: "addAll",
  };
  constructor() {
    super();
    this.properties = { operation: Add["@operation"].values[0] };
    this.addInput("FS", "ipfs::fs,object");
    this.addInput("Bytes", "arraybuffer,uint8array,array");
    this.addOutput("cid", "ipfs::cid,string");
    this.addWidget(
      "combo",
      "operation",
      this.properties.operation,
      "operation"
    );
  }

  async onExecute() {
    const _fs = this.getInputData(1);
    const _data = this.getInputData(2);
    const result = await _fs[Add.#mapper[this.properties.operation]](_data);
    this.setOutputData(1, result);
  }
}

export class cat extends Pure {
  static path = "IPFS/UnixFS/Cmd";
  static title = "Cat";
  static description = "IPFS unixFS Cat Command";
  static #decoder = new TextDecoder();

  constructor() {
    super();
    this.addInput("FS", "ipfs::fs,object");
    this.addInput("cid", "ipfs::cid,string");
    this.addOutput("bytes", "arraybuffer,array,string");
  }

  async onExecute() {
    const _fs = this.getInputData(1);
    const _cid = this.getInputData(2);
    let _res = "";
    for await (let chunk of _fs.cat(_cid)) {
      _res += cat.#decoder.decode(chunk, {
        stream: true,
      });
    }
    this.setOutputData(1, _res);
  }
}

// addAll
// addBytes
// addByteStream
// addFile
// addDirectory
// cat
// chmod
// cp
// ls
// mkdir
// rm
// stat
// touch
