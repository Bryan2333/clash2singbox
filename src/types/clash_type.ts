// Subscription and proxy data types
interface ClashSubscriptionGroup {
    name: string;
    url: string;
}

interface ClashFetchedProxyGroup {
    name: string;
    content: BaseProxyInClash[];
}

interface TransportInClash {
    network?: string;
    "h2-opts"?: {
        host?: string[];
        path?: string;
    };
    "ws-opts"?: {
        path?: string;
        headers?: Record<string, string>;
        "max-early-data"?: string;
    };
    "grpc-opts"?: {
        "grpc-service-name"?: string;
    };
}

interface TlsInClash {
    tls?: boolean;
    sni?: string;
    servername?: string;
    fingerprint?: string;
    alpn?: string[];
    "client-fingerprint"?: string;
    "skip-cert-verify"?: boolean;
}

interface BaseProxyInClash {
    type: string;
    name: string;
    server: string;
    port: number;
    udp?: boolean;
}

interface SsInClash extends BaseProxyInClash {
    type: "ss";
    password: string;
    cipher: string;
}

interface VmessInClash
    extends BaseProxyInClash,
        TransportInClash,
        TlsInClash {
    type: "vmess";
    uuid: string;
    alterId: number;
    cipher: string;
}

interface TrojanInClash
    extends BaseProxyInClash,
        TransportInClash,
        TlsInClash {
    type: "trojan";
    password: string;
}

interface VlessInClash
    extends BaseProxyInClash,
        TransportInClash,
        TlsInClash {
    type: "vless";
    uuid: string;
    flow: string;
    tls: boolean;
}

export {
    ClashSubscriptionGroup,
    ClashFetchedProxyGroup,
    BaseProxyInClash,
    TlsInClash,
    TransportInClash,
    SsInClash,
    VmessInClash,
    TrojanInClash,
    VlessInClash,
};
