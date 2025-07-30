import {
    BaseOutbound,
    SelectorInSingbox,
    SsInSingbox,
    VmessInSingbox,
    VlessInSingbox,
    TrojanInSingbox,
} from "../types/sing_box_type";

interface LogConfig {
    disabled: boolean;
    level: string;
    output: string;
    timestamp: boolean;
}

interface ExperimentalConfig {
    clash_api: {
        external_controller: string;
        external_ui: string;
        secret: string;
        default_mode: string;
    };
    cache_file: {
        enabled?: boolean;
        store_fakeip?: boolean;
    };
}

interface CommonRule {
    action?: string;
    rules?: CommonRule[];
    rule_set?: string | string[];
    network?: string | string[];
    protocol?: string | string[];
    inbound?: string | string[];
    outbound?: string | string[];
    port?: number | number[];
    domain?: string | string[];
    domain_suffix?: string | string[];
    domain_keyword?: string | string[];
    domain_regex?: string | string[];
    query_type?: string | string[];
    clash_mode?: string;
    ip_is_private?: boolean;
    invert?: boolean;
    type?: string;
    mode?: string;
}

interface DnsRule extends CommonRule {
    server: string;
    disable_cache?: boolean;
    rewrite_ttl?: number;
    client_subnet?: string;
}

interface DnsConfig {
    servers: {
        tag: string;
        address: string;
        detour?: string;
        strategy?: string;
        address_resolver?: string;
        address_strategy?: string;
    }[];
    rules: DnsRule[];
    final: string;
    strategy?: string;
    disable_cache?: boolean;
    disable_expire: boolean;
    independent_cache?: boolean;
    reverse_mapping?: boolean;
    fakeip?: {
        enabled: boolean;
        inet4_range?: string;
        inet6_range?: string;
    };
}

interface Inbound {
    type: string;
    tag: string;
    listen: string;
    listen_port: number;
    sniff?: boolean;
}

interface RouteRule extends CommonRule {}

interface RouteConfig {
    rules: RouteRule[];
    rule_set?: {
        tag: string;
        type: string;
        format?: string;
        url?: string;
        path?: string;
        download_detour?: string;
    }[];
    final?: string;
}

export default interface ConfigModel {
    log: LogConfig;
    experimental: ExperimentalConfig;
    dns: DnsConfig;
    outbounds: (
        | BaseOutbound
        | SelectorInSingbox
        | SsInSingbox
        | VmessInSingbox
        | VlessInSingbox
        | TrojanInSingbox
    )[];
    inbounds: Inbound[];
    route: RouteConfig;
}
