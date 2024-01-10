import { ImPure, Pure } from "@design-express/fabrica";
import { gossipsub } from "@chainsafe/libp2p-gossipsub";

export class Gossipsub extends ImPure {
  static path = "IPFS/Service";
  static title = "Gossipsub";
  static description = "IPFS Gossipsub service instance node";
  static #isDebug = !!window.__DESIGN_EXPRESS__DO_NOT_USE_THIS__;

  constructor() {
    super();
    this.instance = undefined;
    this.properties = {
      directPeers: [],
      emitSelf: true,

      //   doPX: false,
      //   messageCache: ,
      //   scoreParams: ,
      //   scoreThresholds: ,
    };
    // this.addInput("topic", "string");
    this.addInput("directPeers", "array");
    this.addOutput("service", "ipfs::service,object");

    if (Gossipsub.#isDebug) {
      this.addWidget(
        "text",
        "directPeers",
        this.properties.directPeers,
        "directPeers"
      );
      this.addWidget(
        "toggle",
        "emitSelf",
        this.properties.emitSelf,
        "emitSelf"
      );
      this.widgets_up = true;
      this.widgets_start_y = 22;
    }
  }
  getTitle() {
    return "Gossipsub [Service]";
  }
  onExecute() {
    const _directPeers = this.getInputData(3) ?? this.properties.directPeers;
    const _emitSelf = this.properties.emitSelf;
    this.setOutputData(
      1,
      this.instance ??
        (this.instance = {
          pubsub: gossipsub({
            enabled: true,
            allowPublishToZeroPeers: true,
            directPeers: _directPeers,
            // allowedTopics: ["fruits"],
            // Dscore: 1,
            emitSelf: _emitSelf,
            // canRelayMessage: true,
          }),
        })
    );
  }
}

export class subscribe extends ImPure {
  static path = "IPFS/Gossipsub";
  static title = "Subscribe";
  static description = "IPFS Gossipsub node";
  static #isDebug = !!window.__DESIGN_EXPRESS__DO_NOT_USE_THIS__;
  static decoder = new TextDecoder();
  constructor() {
    super();
    this.onSubscribe = undefined;
    this.properties = {
      topic: "",
    };
    this.addInput("node", "ipfs::node,object");
    this.addInput("topic", "string");
    this.addOutput("onEvnet", -1);
    this.addOutput("message", "string,buffer");

    this.onmessage = (e) => {
      // console.log(e);
      this.setOutputData(2, subscribe.decoder.decode(e.detail.data));
      this.triggerSlot(1);
    };

    if (subscribe.#isDebug) {
      this.addWidget("text", "topic", this.properties.topic, "topic");

      //   this.widgets_up = true;
      //   this.widgets_start_y = 22;
    }
  }

  async onExecute() {
    const _node = this.getInputData(1);
    const _topic = this.getInputData(2) ?? this.properties.topic;

    if (!!this.onSubscribe) {
      _node.libp2p.services.pubsub.unsubscribe(this.onSubscribe);
    } else {
      _node.libp2p.services.pubsub.addEventListener("message", this.onmessage);
    }
    _node.libp2p.services.pubsub.subscribe((this.onSubscribe = _topic));
  }
}

export class publish extends Pure {
  static path = "IPFS/Gossipsub";
  static title = "Publish";
  static description = "IPFS Gossipsub node";
  static #isDebug = !!window.__DESIGN_EXPRESS__DO_NOT_USE_THIS__;

  constructor() {
    super({ mode: 1 });
    this.properties = {
      topic: "",
    };
    this.addInput("node", "ipfs::node,object");
    this.addInput("topic", "string");
    this.addInput("message", "string,buffer");
    this.addOutput("onEvnet", -1);
    // this.addOutput("message", "string,buffer");
  }

  async onExecute() {
    const _node = this.getInputData(1);
    const _topic = this.getInputData(2) ?? this.properties.topic;
    const _msg = this.getInputData(3);
    if (!_msg) return;
    _node.libp2p.services.pubsub.publish(
      _topic,
      new TextEncoder().encode(_msg)
    );
  }
}
// export class unssubscribe extends Pure {
//   static path = "IPFS/Gossipsub";
//   static title = "Unsubscribe";
//   static description = "IPFS Gossipsub node";
//   static #isDebug = !!window.__DESIGN_EXPRESS__DO_NOT_USE_THIS__;

//   constructor() {
//     super();
//     this.onSubscribe = undefined;
//     this.properties = {
//       topic: "",
//     };
//     this.addInput("node", "ipfs::node,object");
//     this.addInput("topic", "string");
//     this.addOutput("onEvnet", -1);
//     this.addOutput("message", "string,buffer");

//     this.onmessage = (e) => {
//       console.log(e);
//       this.setOutputData(2, e);
//       this.triggerSlot(1);
//     };

//     if (unssubscribe.#isDebug) {
//       this.addWidget("text", "topic", this.properties.topic, "topic");

//       //   this.widgets_up = true;
//       //   this.widgets_start_y = 22;
//     }
//   }

//   async onExecute() {
//     const _node = this.getInputData(1);
//     const _topic = this.getInputData(2) ?? this.properties.topic;

//     if (!!this.onSubscribe) {
//       _node.libp2p.services.pubsub.unsubscribe(this.onSubscribe);
//     } else {
//       _node.libp2p.services.pubsub.addEventListener("message", this.onmessage);
//     }
//     _node.libp2p.services.pubsub.subscribe((this.onSubscribe = _topic));
//   }
// }
