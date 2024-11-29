import {
    VmessInClash,
    SsInClash,
    TrojanInClash,
    VlessInClash,
    BaseProxyInClash,
} from "../types/clash_type";
import {
    SsInSingbox,
    VmessInSingbox,
    TrojanInSingbox,
    VlessInSingbox,
    BaseOutbound,
} from "../types/sing_box_type";
import { parseTransport } from "./parseTransport";
import { parseTLS } from "./parseTLS";

export function convertProxies(
    proxies: BaseProxyInClash[]
): BaseOutbound[] {
    return proxies.map((proxy) => {
        switch (proxy.type) {
            case "ss":
                return convertShadowsocks(proxy as SsInClash);
            case "vmess":
                return convertVmess(proxy as VmessInClash);
            case "vless":
                return convertVless(proxy as VlessInClash);
            case "trojan":
                return convertTrojan(proxy as TrojanInClash);
            default:
                throw new Error(`Unsupported proxy ${proxy}`);
        }
    });
}

function convertVmess(oldNode: VmessInClash): VmessInSingbox {
    return {
        type: "vmess",
        tag: oldNode.name,
        server: oldNode.server,
        server_port: oldNode.port,
        uuid: oldNode.uuid,
        security: oldNode.cipher,
        alter_id: oldNode.alterId,
        network: oldNode.udp ? undefined : "tcp",
        tls: parseTLS(oldNode),
        transport: parseTransport(oldNode),
    };
}

function convertVless(oldNode: VlessInClash): VlessInSingbox {
    return {
        type: "vless",
        tag: oldNode.name,
        server: oldNode.server,
        server_port: oldNode.port,
        uuid: oldNode.uuid,
        flow: oldNode.flow,
        network: oldNode.udp ? undefined : "tcp",
        tls: parseTLS(oldNode),
        transport: parseTransport(oldNode),
    };
}

function convertTrojan(oldNode: TrojanInClash): TrojanInSingbox {
    return {
        type: "trojan",
        tag: oldNode.name,
        server: oldNode.server,
        server_port: oldNode.port,
        password: oldNode.password,
        network: oldNode.udp ? undefined : "tcp",
        tls: parseTLS(oldNode),
        transport: parseTransport(oldNode),
    };
}

function convertShadowsocks(oldNode: SsInClash): SsInSingbox {
    return {
        type: "shadowsocks",
        tag: oldNode.name,
        server: oldNode.server,
        server_port: oldNode.port > 65535 ? 1024 : oldNode.port,
        method: oldNode.cipher,
        password: oldNode.password,
        network: oldNode.udp ? undefined : "tcp",
    };
}
