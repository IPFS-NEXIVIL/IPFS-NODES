import { Pure } from "@design-express/fabrica";
export class add extends Pure {
  static path = "Math";
  static title = "Add";
  static description = "Add";
  static instance = undefined;
//   static triggerMapper = [];

  constructor() {
    super();
    this.addInput("A", "number");
    this.addInput("B", "number");
    this.addInput("C", -1);
    this.addOutput("value", "number");
    this.addOutput("", -1);
    this.properties = { test: 1 };
    this.triggerMapper=[]
    this.triggerMapper.push(() => this.triggerSlot(2));
  }

  async onExecute() {
    console.log("TEST2: ", (this.properties.test += 1));
    this.setOutputData(1, this.getInputData(1) + this.getInputData(2));
  }
  onAction() {
    this.triggerMapper.forEach((func) => func());
    this.triggerSlot(2);
  }

  //   __clone__() {
  //     add.triggerMapper.push(() => this.triggerSlot(2));
  //   }
}
