// import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { bootstrap } from "@libp2p/bootstrap";
import { ipniContentRouting } from "@libp2p/ipni-content-routing";
import { kadDHT } from "@libp2p/kad-dht";
import { mplex } from "@libp2p/mplex";
import { webRTC, webRTCDirect } from "@libp2p/webrtc";
import { webSockets } from "@libp2p/websockets";
import { all } from "@libp2p/websockets/filters";
import { ipnsSelector } from "ipns/selector";
import { ipnsValidator } from "ipns/validator";
import { autoNATService } from "libp2p/autonat";
import { circuitRelayTransport } from "libp2p/circuit-relay";
import { identifyService } from "libp2p/identify";
// import { webTransport } from "@libp2p/webtransport";
import { webRTCStar } from "@libp2p/webrtc-star";

// import { delegatedContentRouting } from "@libp2p/delegated-content-routing";
// import { create as createKuboRpcClient } from "kubo-rpc-client";
// import { pubsubPeerDiscovery } from "@libp2p/pubsub-peer-discovery";
import { pingService } from "libp2p/ping";
const star = webRTCStar();

export function libp2pDefaults(addrs, services) {
  return {
    addresses: {
      listen: [
        "/webrtc",
        "/wss",
        "/ws"
        // "/webtransport",
        // "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
        // "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
        // "/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star",
        // "/dns4/libp2p-rdv.vps.revolunet.com/tcp/443/wss/p2p-webrtc-star",
        // "/dns4/star.thedisco.zone/tcp/9090/wss/p2p-webrtc-star",
        // "/dns6/star.thedisco.zone/tcp/9090/wss/p2p-webrtc-star",
      ],
    },
    transports: [
      star.transport,
      // webTransport({ maxInboundStreams: 210 }),
      webSockets({ filter: all }),
      webRTC(),
      webRTCDirect(),
      circuitRelayTransport({
        discoverRelays: 3,
      }),
    ],
    streamMuxers: [yamux(), mplex()],
    connectionGater: {
      denyDialMultiaddr: async () => false,
    },
    connectionEncryption: [noise()],
    connectionManager: {
      maxConnections: 15,
      minConnections: 2,
    },
    peerDiscovery: [
      bootstrap({
        list: [
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp",
          "/dnsaddr/node-1.ingress.cloudflare-ipfs.com/p2p/QmcFf2FH3CEgTNHeMRGhN7HNHU1EXAxoEk6EFuSyXCsvRE",
          "/dns4/hoverboard-staging.dag.haus/tcp/443/wss/p2p/Qmc5vg9zuLYvDR1wtYHCaxjBHenfCNautRwCjG3n5v5fbs",
          "/dns4/localhost/tcp/4002/ws/p2p/12D3KooWJvMFqsvvSojDmBeffhQFfRPNQRCmErvbYFsN89i5Czwy",
          // "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
          // "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
          // "/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star",
          // "/dns4/libp2p-rdv.vps.revolunet.com/tcp/443/wss/p2p-webrtc-star",
          // "/dns6/ipfs.thedisco.zone/tcp/4430/wss/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt",
          // "/dns4/ipfs.thedisco.zone/tcp/4430/wss/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt",
          // "/ip4/127.0.0.1/tcp/60502/ws/p2p/12D3KooWBVxpNK6BMygDvizDLjGMsJgU3jLkk7UkHYiaGnswy4Mx",
          ...addrs,
        ],
      }),
      //   pubsubPeerDiscovery({ interval: 10000 }),
    ],
    contentRouters: [
      ipniContentRouting("https://cid.contact"),
      //   delegatedContentRouting(
      //     createKuboRpcClient({
      //       protocol: "https",
      //       port: 443,
      //       host: "node0.delegate.ipfs.io",
      //     })
      //   ),
    ],
    relay: {
      enabled: true,
      hop: {
        enabled: true,
      },
    },
    services: {
      ...services,
      identify: identifyService(),
      autoNAT: autoNATService(),
      //   pubsub: gossipsub({
      //     enabled: true,
      //     allowPublishToZeroPeers: true,
      //     // allowedTopics: ["fruits"],
      //     // Dscore: 1,
      //     emitSelf: true,
      //     canRelayMessage: true,
      //   }),
      dht: kadDHT({
        clientMode: true,
        validators: {
          ipns: ipnsValidator,
        },
        selectors: {
          ipns: ipnsSelector,
        },
      }),
      ping: pingService(),
    },
  };
}
