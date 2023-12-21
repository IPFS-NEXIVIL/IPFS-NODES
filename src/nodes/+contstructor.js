import { Pure } from "@design-express/fabrica";
import { createHelia } from "helia";
import { MemoryDatastore } from "datastore-core";
import { MemoryBlockstore } from "blockstore-core";
import { bootstrap } from "@libp2p/bootstrap";

import { createLibp2p } from "./bootstraps";

export class Helia extends Pure {
  static path = "IPFS";
  static title = "Constructor";
  static description = "Create Helia(IPFS) instance.";
  static instance = undefined;

  constructor() {
    super();
    this.addOutput("instance", "helia");
    this.addOutput("datastore", "store");
    this.addOutput("blockstore", "store");
    this.addWidget("button", "stop", null, async () => {
      (await Helia.instance).stop();
    });
    this.addWidget("button", "start", null, async () => {
      (await Helia.instance).start();
    });
  }

  async onExecute() {
    if (!Helia.instance) {
      let _r;
      Helia.instance = new Promise((r) => {
        _r = r;
      });
      const datastore = new MemoryDatastore();
      const blockstore = new MemoryBlockstore();
      const _helia = await createHelia({
        datastore,
        blockstore,
        libp2p: await createLibp2p({
          peerDiscovery: [
            bootstrap({
              list: [
                // "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
                // "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
                // "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
                // "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
                "/dns4/libp2p.nexivil.com/tcp/4001/p2p/12D3KooWRGFPv1thjW5pHnxpgsLBZ9DM9Z9TLbASCHNMEifbuymb",
                "/dns4/libp2p.nexivil.com/tcp/4002/ws/p2p/12D3KooWRGFPv1thjW5pHnxpgsLBZ9DM9Z9TLbASCHNMEifbuymb",
                "/dns4/libp2p.nexivil.com/udp/4001/quic-v1/p2p/12D3KooWRGFPv1thjW5pHnxpgsLBZ9DM9Z9TLbASCHNMEifbuymb",
                "/dns4/libp2p.nexivil.com/udp/4001/quic-v1/webtransport/certhash/uEiDcT6nmedXW_BUmlQLjwcfiveF_ZudscfDoo7c1r07d5w/certhash/uEiBBOLgTfL10I6WHQgZAotvPanIpMH1HwEKKjUGyNapFWA/p2p/12D3KooWRGFPv1thjW5pHnxpgsLBZ9DM9Z9TLbASCHNMEifbuymb",
                "/dns4/libp2p.nexivil.com/udp/4001/quic/p2p/12D3KooWRGFPv1thjW5pHnxpgsLBZ9DM9Z9TLbASCHNMEifbuymb",
              ],
            }),
          ],
          // addresses: {
          //   listen: [],
          // },
        }),
      });
      // {
      //   libp2p: await createLibp2p({
      //     connectionGater: { denyDialMultiaddr: () => false },
      //     transports: [webSockets({ filter: all }), wrtcStar.transport],
      //     connectionEncryption: [noise()],
      //     streamMuxers: [mplex()],
      //     services: {
      //       identify: identifyService(),
      //       pubsub: gossipsub(),
      //     },
      //     addresses: {
      //       listen: [
      //         isBrowser()
      //           ? "/ip4/0.0.0.0/tcp/12345/ws/p2p-webrtc-star"
      //           : "/ip4/0.0.0.0/tcp/0/ws",
      //       ],
      //     },
      //   }),
      // }
      //   {
      //   libp2p: await createLibp2p({
      //     connectionManager: {
      //       maxParallelDials: 50, // 150 total parallel multiaddr dials
      //       maxDialsPerPeer: 4, // Allow 4 multiaddrs to be dialed per peer in parallel
      //       dialTimeout: 10e3, // 10 second dial timeout per peer dial
      //       autoDial: false,
      //     },
      //     // nat: {
      //     //   enabled: false,
      //     // },
      //   }),
      // }
      _r(_helia);
      // console.log(_helia.libp2p.services.pubsub.subscribe);
    }
    const _instance = await Helia.instance;
    this.setOutputData(1, _instance);
    this.setOutputData(2, _instance.datastore);
    this.setOutputData(3, _instance.blockstore);
  }
  // __clone__() {}
}
