import ConfigModel from "./config_model";

const ExampleConfig: ConfigModel = {
    log: {
        disabled: false,
        level: "info",
        output: "/dev/null",
        timestamp: true,
    },
    experimental: {
        clash_api: {
            external_controller: "127.0.0.1:9090",
            external_ui: "/usr/share/zashboard",
            secret: "password",
            default_mode: "rule",
        },
        cache_file: {
            enabled: true,
        },
    },
    dns: {
        servers: [
            {
                tag: "dns_tencent",
                type: "udp",
                server: "119.29.29.29",
            },
            {
                tag: "dns_quad9",
                type: "tcp",
                server: "9.9.9.11",
                detour: "select",
            },
        ],
        rules: [
            {
                query_type: ["HTTPS", "SVCB"],
                action: "predefined",
                rcode: "REFUSED",
            },
            {
                rule_set: ["geosite-pcdn_DDCHlsq", "geosite-httpdns_DDCHlsq"],
                action: "predefined",
                rcode: "REFUSED",
            },
            {
                inbound: ["direct-only-v4", "direct-only-v6"],
                server: "dns_tencent",
            },
            {
                rule_set: [
                    "geosite-private",
                    "geosite-microsoft-cn",
                    "geosite-apple-cn",
                    "geosite-google-cn",
                    "geosite-games-cn",
                    "geosite-cn",
                    "geosite-jetbrains-cn",
                    "geosite-steam-cn",
                ],
                domain_suffix: [
                    "ping.archlinux.org",
                    "download.jetbrains.com",
                    "download-cdn.jetbrains.com",
                    "ustclug.org",
                    "steamserver.net",
                ],
                domain: ["steamcdn-a.akamaihd.net"],
                server: "dns_tencent",
            },
            {
                type: "logical",
                mode: "and",
                rules: [
                    {
                        rule_set: ["geosite-geolocation-!cn"],
                        invert: true,
                    },
                    {
                        rule_set: "geoip-cn",
                    },
                ],
                server: "dns_quad9",
                client_subnet: "202.96.134.133",
            },
            {
                query_type: ["A", "AAAA"],
                server: "dns_quad9",
            },
        ],
        final: "dns_tencent",
        disable_cache: false,
        disable_expire: false,
        cache_capacity: 2048,
    },
    inbounds: [
        {
            type: "mixed",
            tag: "direct-only-v4",
            listen: "127.0.0.1",
            listen_port: 30000,
        },
        {
            type: "mixed",
            tag: "direct-only-v6",
            listen: "::1",
            listen_port: 30000,
        },
        {
            type: "mixed",
            tag: "mixed-in-v4",
            listen: "127.0.0.1",
            listen_port: 7890,
        },
        {
            type: "mixed",
            tag: "mixed-in-v6",
            listen: "::1",
            listen_port: 7890,
        },
        {
            type: "tproxy",
            tag: "tproxy-in-v4",
            listen: "127.0.0.1",
            listen_port: 7894,
        },
        {
            type: "tproxy",
            tag: "tproxy-in-v6",
            listen: "::1",
            listen_port: 7894,
        },
    ],
    outbounds: [
        {
            type: "selector",
            tag: "select",
            outbounds: ["direct", "naiveproxy"],
            default: "direct",
        },
        {
            type: "http",
            tag: "naiveproxy",
            server: "127.0.0.1",
            server_port: 1081,
        },
        {
            type: "direct",
            tag: "direct",
        },
    ],
    route: {
        rules: [
            {
                action: "sniff",
            },
            {
                protocol: "dns",
                action: "hijack-dns",
            },
            {
                rule_set: ["geosite-pcdn_DDCHlsq", "geosite-httpdns_DDCHlsq"],
                action: "reject",
            },
            {
                network: "udp",
                outbound: "direct",
            },
            {
                inbound: ["direct-only-v4", "direct-only-v6"],
                outbound: "direct",
            },
            {
                clash_mode: "direct",
                outbound: "direct",
            },
            {
                clash_mode: "global",
                outbound: "select",
            },
            {
                domain_suffix: ["suse.org.cn", "xiaomi.eu"],
                outbound: "select",
            },
            {
                rule_set: [
                    "geosite-private",
                    "geosite-microsoft-cn",
                    "geosite-apple-cn",
                    "geosite-google-cn",
                    "geosite-games-cn",
                    "geosite-cn",
                    "geosite-jetbrains-cn",
                    "geosite-steam-cn",
                    "geosite-category-public-tracker",
                ],
                outbound: "direct",
            },
            {
                domain_suffix: [
                    "download.jetbrains.com",
                    "download-cdn.jetbrains.com",
                    "ustclug.org",
                    "steamserver.net",
                ],
                domain: ["steamcdn-a.akamaihd.net"],
                outbound: "direct",
            },
            {
                rule_set: "geosite-bahamut",
                outbound: "动画疯",
            },
            {
                rule_set: [
                    "geosite-geolocation-!cn",
                    "geosite-bytedance-!cn",
                    "geosite-tiktok",
                ],
                outbound: "select",
            },
            {
                rule_set: "geoip-cn",
                outbound: "direct",
            },
            {
                ip_is_private: true,
                outbound: "direct",
            },
        ],
        rule_set: [
            {
                tag: "geosite-microsoft-cn",
                type: "local",
                format: "binary",
                path: "/usr/share/sing-box/rule-set/geosite/geosite-microsoft@cn.srs",
            },
            {
                tag: "geosite-apple-cn",
                type: "local",
                format: "binary",
                path: "/usr/share/sing-box/rule-set/geosite/geosite-apple-cn.srs",
            },
            {
                tag: "geosite-google-cn",
                type: "local",
                format: "binary",
                path: "/usr/share/sing-box/rule-set/geosite/geosite-google-cn.srs",
            },
            {
                tag: "geosite-games-cn",
                type: "local",
                format: "binary",
                path: "/usr/share/sing-box/rule-set/geosite/geosite-category-games@cn.srs",
            },
            {
                tag: "geoip-cn",
                type: "local",
                format: "binary",
                path: "/usr/share/sing-box/rule-set/geoip/geoip-cn.srs",
            },
            {
                tag: "geosite-cn",
                type: "local",
                format: "binary",
                path: "/usr/share/sing-box/rule-set/geosite/geosite-cn.srs",
            },
            {
                tag: "geosite-geolocation-!cn",
                type: "local",
                format: "binary",
                path: "/usr/share/sing-box/rule-set/geosite/geosite-geolocation-!cn.srs",
            },
            {
                tag: "geosite-bytedance-!cn",
                type: "local",
                format: "binary",
                path: "/usr/share/sing-box/rule-set/geosite/geosite-bytedance@!cn.srs",
            },
            {
                tag: "geosite-tiktok",
                type: "local",
                format: "binary",
                path: "/usr/share/sing-box/rule-set/geosite/geosite-tiktok.srs",
            },
            {
                tag: "geosite-private",
                type: "local",
                format: "binary",
                path: "/usr/share/sing-box/rule-set/geosite/geosite-private.srs",
            },
            {
                tag: "geosite-jetbrains-cn",
                type: "local",
                format: "binary",
                path: "/usr/share/sing-box/rule-set/geosite/geosite-jetbrains@cn.srs",
            },
            {
                tag: "geosite-bahamut",
                type: "local",
                format: "binary",
                path: "/usr/share/sing-box/rule-set/geosite/geosite-bahamut.srs",
            },
            {
                tag: "geosite-steam-cn",
                type: "local",
                format: "binary",
                path: "/usr/share/sing-box/rule-set/geosite/geosite-steam@cn.srs",
            },
            {
                tag: "geosite-category-public-tracker",
                type: "local",
                format: "binary",
                path: "/usr/share/sing-box/rule-set/geosite/geosite-category-public-tracker.srs",
            },
            {
                tag: "geosite-httpdns_DDCHlsq",
                type: "local",
                format: "binary",
                path: "/usr/share/sing-box/rule-set/geosite/httpdns_DDCHlsq.srs",
            },
            {
                tag: "geosite-pcdn_DDCHlsq",
                type: "local",
                format: "binary",
                path: "/usr/share/sing-box/rule-set/geosite/pcdn_DDCHlsq.srs",
            },
        ],
        final: "select",
        default_domain_resolver: "dns_tencent",
    },
};

export default ExampleConfig;
