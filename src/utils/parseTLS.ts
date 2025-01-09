import { VmessInClash, VlessInClash, TrojanInClash } from "../types/clash_type";
import { TlsInSingbox } from "../types/sing_box_type";

export function parseTLS(
    oldNode: VmessInClash | VlessInClash | TrojanInClash
): TlsInSingbox | undefined {
    const tlsconfig: TlsInSingbox = {
        enabled: oldNode.tls ?? true,
        insecure: oldNode["skip-cert-verify"],
        alpn: oldNode.alpn,
        utls: oldNode["client-fingerprint"]
            ? {
                  enabled: true,
                  fingerprint: oldNode["client-fingerprint"],
              }
            : undefined,
    };

    if (oldNode.sni) {
        tlsconfig.server_name = oldNode.sni;
    } else if (oldNode.servername) {
        tlsconfig.server_name = oldNode.servername;
    } else {
        tlsconfig.server_name = oldNode.server;
    }

    return tlsconfig;
}
