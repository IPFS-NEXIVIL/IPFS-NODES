import { ImPure, Pure } from "@design-express/fabrica";
import { default as OrbitDB } from "orbit-db";

export class DBInstance extends Pure {
  static path = "orbitDB";
  static title = "Instance";
  static description = "Make a ORBIT DB Instance";
  static instance = undefined;
  constructor() {
    super();
    this.addInput("IPFS", "helia,object");
    this.addOutput("OrbitDB", "OrbitDB");
  }
  async onExecute() {
    const ipfs = this.getInputData(1);
    DBInstance.instance = await OrbitDB({ ipfs });
    this.setOutputData(1, DBInstance.instance);
  }
  onRemoved() {
    if (DBInstance.instance) {
      DBInstance.instance.stop();
    }
  }
}

export class DBTable extends Pure {
  static path = "orbitDB";
  static title = "Table";
  static description = "Open or Create a ORBIT DB table";
  constructor() {
    super();
    this.addInput("OrbitDB", "OrbitDB,object");
    this.addInput("name", "string");
    this.addOutput("table", "table,object");
    this.db = undefined;
  }
  async onExecute() {
    const orbitdb = this.getInputData(1);
    const name = this.getInputData(2);
    const db = (this.db = await orbitdb.open(name));
    this.setOutputData(1, db);
  }
  onRemoved() {
    this.db.close();
    this.db = undefined;
  }
}

export class getAddress extends Pure {
  static path = "orbitDB";
  static title = "getAddress";
  static description = "Table address";

  constructor() {
    super();
    this.addInput("table", "table,object");
    this.addOutput("address", "string");
  }

  onExecute() {
    const table = this.getInputData(1);
    this.setOutputData(1, table.address);
  }
}
export class add extends Pure {
  static path = "orbitDB";
  static title = "add";
  static description = "Table add";

  constructor() {
    super();
    this.addInput("table", "table,object");
    this.addInput("data", 0);
    // this.addOutput("address", "string");
  }

  async onExecute() {
    const table = this.getInputData(1);
    const data = this.getInputData(2);
    await table.add(data);
    // this.setOutputData(1, table.address);
  }
}

export class events extends ImPure {
  static path = "orbitDB";
  static title = "eventListener";
  static description = "eventListener";

  constructor() {
    super();
    this.addInput("table", "table,object");
    this.addOutput("join", -1);
    this.addOutput("update", -1);
    this.addOutput("data", "");
  }

  async onExecute() {
    const tb = this.getInputData(1);
    // Add some records to the db when another peers joins.
    tb.events.on("join", async (peerId, heads) => {
      this.triggerSlot(1);
      //   await tb.add("hello world 1");
      //   await tb.add("hello world 2");
    });

    tb.events.on("update", async (entry) => {
      this.setOutputData(3, entry);
      this.triggerSlot(2);

      // To complete full replication, fetch all the records from the other peer.
      //   await db.all();
    });
  }
  onAction() {}
}
