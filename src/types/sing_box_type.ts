interface TransportInSingbox {
    type: string;
    service_name?: string; // grpc
    headers?: Record<string, string>; // ws
    host?: string[]; // h2
    path?: string; // h2 ws
    max_early_data?: number; // ws
}

interface TlsInSingbox {
    enabled?: boolean;
    insecure?: boolean;
    server_name?: string;
    alpn?: string[];
    utls?: {
        enabled: boolean;
        fingerprint: string;
    };
}

interface BaseOutbound {
    type: string;
    tag: string;
    outbounds?: string[];
    server?: string;
    server_port?: number;
    network?: string;
    tls?: TlsInSingbox;
    transport?: TransportInSingbox;
}

interface SelectorInSingbox extends BaseOutbound {
    outbounds: string[]
    default?: string;
}

interface SsInSingbox extends BaseOutbound {
    method: string;
    password: string;
}

interface VmessInSingbox extends BaseOutbound {
    uuid: string;
    security: string;
    alter_id: number;
}

interface TrojanInSingbox extends BaseOutbound {
    password: string;
}

interface VlessInSingbox extends BaseOutbound {
    uuid: string;
    flow: string;
    packet_encoding?: string;
}

export {
    BaseOutbound,
    TlsInSingbox,
    TransportInSingbox,
    SelectorInSingbox,
    SsInSingbox,
    VmessInSingbox,
    TrojanInSingbox,
    VlessInSingbox,
};
