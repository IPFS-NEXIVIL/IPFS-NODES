import { Pure } from "@design-express/fabrica";

export class Subscibe extends Pure {
  static path = "IPFS";
  static title = "Subscibe";
  static description = "Subscribe topic";
  //   static instance = undefined;

  constructor() {
    super();
    this.addInput("instance", "helia,object");
    this.addInput("topic", "string");
    this.addOutput("evt", -1);
  }

  onExecute() {
    const _helia = (this._helia = this.getInputData(1));
    if (this._topic) {
      this._helia?.libp2p.services.pubsub.unsubscribe(this._topic);
    }
    this._topic = this.getInputData(2);
    _helia.libp2p.services.pubsub.subscribe(this._topic);
    _helia.libp2p.services.pubsub.addEventListener("message", (msg) => {
      console.log(
        `${msg.detail.topic}:`,
        new TextDecoder().decode(msg.detail.data)
      );
    });
  }
  __clone__() {}
  onRemoved() {
    this._helia?.libp2p.services.pubsub.unsubscribe(this._topic);
  }
}
export class Publish extends Pure {
  static path = "IPFS";
  static title = "Publish";
  static description = "Publish topic";
  //   static instance = undefined;

  constructor() {
    super();
    this.addInput("instance", "helia,object");
    this.addInput("topic", "string");
    this.addInput("evt", -1);
    this.addInput("data", "string");
  }

  onExecute() {
    this._helia = this.getInputData(1);
    // if (this._topic) return;
    this._topic = this.getInputData(2);
  }
  onAction(name) {
    if (name === "evt") {
      this._helia.libp2p.services.pubsub.publish(
        this._topic,
        Buffer.from(this.getInputData(4), "utf-8")
      );
    } else super.onAction();
  }
  __clone__() {}
  onRemoved() {
    this._helia?.libp2p.services.pubsub.unsubscribe(this._topic);
  }
}
