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
      allowedTopics: [],
      directPeers: [],
      emitSelf: true,

      //   doPX: false,
      //   messageCache: ,
      //   scoreParams: ,
      //   scoreThresholds: ,
    };
    // this.addInput("topic", "string");
    this.addInput("directPeers", "array");
    this.addInput("allowedTopics", "array");
    this.addOutput("service", "ipfs::service,object");

    if (Gossipsub.#isDebug) {
      this.addWidget(
        "text",
        "directPeers",
        this.properties.directPeers,
        "directPeers"
      );
      this.addWidget(
        "text",
        "allowedTopics",
        this.properties.allowedTopics,
        "allowedTopics"
      );
      this.addWidget(
        "toggle",
        "emitSelf",
        this.properties.emitSelf,
        "emitSelf"
      );
      this.widgets_up = true;
    }
  }
  getTitle() {
    return "Gossipsub [Service]";
  }
  onExecute() {
    const _directPeers = this.getInputData(1) ?? this.properties.directPeers;
    const _allowedTopics =
      this.getInputData(2) ?? this.properties.allowedTopics;
    const _emitSelf = this.properties.emitSelf;
    this.setOutputData(
      1,
      this.instance ??
        (this.instance = {
          pubsub: gossipsub({
            enabled: true,
            allowPublishToZeroPeers: true,
            // directPeers: _directPeers,
            allowedTopics:
              (_allowedTopics?.length ?? 0) < 1 ? undefined : _allowedTopics,
            // Dscore: 1,
            emitSelf: _emitSelf,
            canRelayMessage: true,
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
  static "@msgType" = {
    type: "enum",
    values: ["raw", "text", "json"],
  };
  static funcAsType = {
    raw: function (v) {
      return v;
    },
    text: function (v) {
      // subscribe.decoder.decode(e.detail.data)
      return subscribe.decoder.decode(v);
    },
    json: function (v) {
      try {
        return JSON.parse(this.text(v));
      } catch {
        console.error("Invalid Msg");
        return {};
      }
    },
  };
  constructor() {
    super();
    this.onSubscribe = undefined;
    this.properties = {
      topic: "",
      msgType: subscribe["@msgType"].values[0],
      filterids: [],
      isBroadcast: false,
    };
    this.addInput("node", "ipfs::node,object");
    this.addInput("topic", "string");
    this.addOutput("onEvnet", -1);
    this.addOutput("message", "string,buffer,object");

    this.onmessage = (e) => {
      const _data = e.detail?.data;
      const _parsedData = _data
        ? subscribe.funcAsType[this.properties.msgType](_data)
        : undefined;
      console.log(
        `isBroad: ${this.properties.isBroadcast}\nthis: ${this.cid}\nfrom: ${_parsedData.id}\nfilterids:`,
        this.properties.filterids
      );
      if (this.properties.isBroadcast || this.cid !== _parsedData.id) return;
      if (
        this.properties.filterids.length > 0 &&
        this.properties.filterids.indexOf(e.detail.from?.toString()) < 0
      )
        return;
      this.setOutputData(
        2,
        _parsedData
        // subscribe.funcAsType[this.properties.msgType](_parsedData)
      );
      this.triggerSlot(1);
    };
    if (subscribe.#isDebug) {
      this.addWidget("text", "topic", this.properties.topic, "topic");
      this.addWidget("combo", "msgType", this.properties.msgType, "msgType", {
        values: subscribe["@msgType"].values,
      });
      this.filterWidget = this.addWidget(
        "text",
        "from",
        this.properties.filterids.join(", "),
        (v) => {
          let s = v.startsWith("[") ? 1 : 0,
            e = v.endsWith("]") ? v.length - 1 : v.length;

          this.properties.filterids = (v ?? "")
            .substring(s, e)
            .split(",")
            .map((i) => {
              i = i.trim();
              let _i = Number(i);
              return Number.isNaN(_i) ? i : _i;
            });
          // this.properties.filterids=
          return true;
        }
      );
      this.addWidget(
        "toggle",
        "isBroadcast",
        this.properties.isBroadcast,
        "isBroadcast"
      );
      //   this.widgets_up = true;
      //   this.widgets_start_y = 22;
    }
  }
  onPropertyChanged(name, value, prevValue) {
    if (name === "filterids" && prevValue !== undefined) {
      if (value === "string") {
        let s = value.startsWith("[") ? 1 : 0,
          e = value.endsWith("]") ? value.length - 1 : value.length;

        this.properties.filterids = (value ?? "")
          .substring(s, e)
          .split(",")
          .map((i) => {
            i = i.trim();
            let _i = Number(i);
            return Number.isNaN(_i) ? i : _i;
          });
        this.filterWidget.value = this.properties.filterids.join(", ");
        // this.properties.filterids=
        return;
      }
      this.properties.filterids = value;
      this.filterWidget.value = this.properties.filterids.join(", ");

      return;
    }
  }

  async onExecute() {
    const _node = this.getInputData(1);
    const _topic = this.getInputData(2) ?? this.properties.topic;
    if (!this.cid) this.cid = _node.libp2p.peerId.toString();
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
  static anyToBuffer(v) {
    if (typeof v === "string" || typeof v === "number") {
      return new TextEncoder().encode(v);
    }
    if (Buffer.isBuffer(v) || v.byteLength !== undefined) {
      return v;
    }
    return new TextEncoder().encode(JSON.stringify(v));
  }

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
    _node.libp2p.services.pubsub.publish(_topic, publish.anyToBuffer(_msg));
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
