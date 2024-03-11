import { Pure } from "@design-express/fabrica";

export class dummyComponent extends Pure {
  static path = "IPFS/Dummy";
  static title = "Component";
  static description = "component";

  constructor() {
    super();

    this.addOutput("", "component");
  }

  async onExecute() {
    this.setOutputData(1, <div>webServer</div>);
  }
}
