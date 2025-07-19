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
            external_ui: "/usr/share/metacubexd",
            secret: "password",
            default_mode: "rule",
        },
        cache_file: {
            enabled: true,
            store_fakeip: false,
        },
    },
    dns: {
        servers: [
            {
                tag: "dns_local",
                address: "udp://119.29.29.29",
                detour: "direct",
            },
            {
                tag: "dns_block",
                address: "rcode://refused",
            },
            {
                tag: "dns_fakeip",
                address: "fakeip",
            },
        ],
        rules: [
            {
                query_type: ["HTTPS", "SVCB"],
                disable_cache: true,
                server: "dns_block",
            },
            {
                server: "dns_block",
                disable_cache: true,
                rule_set: ["geosite-pcdn-cn", "geosite-category-httpdns-cn"],
            },
            {
                server: "dns_local",
                inbound: ["direct-only-v4", "direct-only-v6"],
            },
            {
                server: "dns_local",
                type: "logical",
                mode: "and",
                rules: [
                    {
                        domain_suffix: ["suse.org.cn", "xiaomi.eu"],
                        invert: true,
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
                    },
                ],
            },
            {
                server: "dns_local",
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
            },
            {
                server: "dns_fakeip",
                query_type: ["A", "AAAA"],
            },
        ],
        final: "dns_local",
        disable_cache: false,
        disable_expire: false,
        fakeip: {
            enabled: true,
            inet4_range: "198.18.0.0/15",
            inet6_range: "fc00::/18",
        },
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
            outbounds: ["direct", "akko"],
            default: "direct",
        },
        {
            type: "http",
            tag: "akko",
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
                rule_set: ["geosite-pcdn-cn", "geosite-category-httpdns-cn"],
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
                type: "logical",
                mode: "or",
                rules: [
                    {
                        protocol: ["tls", "http", "quic", "ssh"],
                    },
                    {
                        port: [
                            22, 80, 53, 123, 143, 194, 443, 465, 587, 853, 993,
                            995, 5222, 8080, 8443,
                        ],
                    },
                ],
                invert: true,
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
                rule_set: ["geosite-bahamut"],
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
                tag: "geosite-pcdn-cn",
                type: "remote",
                format: "binary",
                url: "https://gh-proxy.com/github.com/Yuu518/sing-box-rules/blob/rule_set/rule_set_site/pcdn-cn.srs",
                download_detour: "direct",
            },
            {
                tag: "geosite-category-httpdns-cn",
                type: "local",
                format: "binary",
                path: "/usr/share/sing-box/rule-set/geosite/geosite-category-httpdns-cn.srs",
            },
            {
                tag: "geosite-steam-cn",
                type: "local",
                format: "binary",
                path: "/usr/share/sing-box/rule-set/geosite/geosite-steam@cn.srs",
            },
        ],
        final: "select",
    },
};

export default ExampleConfig;
