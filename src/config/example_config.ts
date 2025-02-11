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
                address: "dhcp://auto",
                detour: "direct",
            },
            {
                tag: "dns_fakeip",
                address: "fakeip",
            },
            {
                tag: "dns_opendns",
                address: "tcp://208.67.222.222",
                detour: "select",
                strategy: "ipv4_only",
            },
        ],
        rules: [
            {
                server: "dns_local",
                rewrite_ttl: 10,
                type: "logical",
                mode: "and",
                rules: [
                    {
                        domain_regex: [".*suse\\.org\\.cn$"],
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
                        ],
                        domain: ["ping.archlinux.org"],
                    },
                ],
            },
            {
                server: "dns_fakeip",
                rule_set: [
                    "geosite-geolocation-!cn",
                    "geosite-bytedance-!cn",
                    "geosite-tiktok",
                ],
            },
            {
                server: "dns_opendns",
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
            type: "socks",
            tag: "direct-only-v4",
            listen: "127.0.0.1",
            listen_port: 30000,
        },
        {
            type: "socks",
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
            type: "socks",
            tag: "akko",
            server: "127.0.0.1",
            server_port: 1081,
            network: "tcp",
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
                network: "udp",
                outbound: "direct",
            },
            {
                inbound: [
                    "direct-only-v4",
                    "direct-only-v6",
                ],
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
                domain_regex: [".*suse\\.org\\.cn$"],
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
                ],
                outbound: "direct",
            },
            {
                domain_regex: [
                    "^(download|download-cdn)\\.jetbrains\\.com$",
                    ".*ustclug\\.org$",
                ],
                outbound: "direct",
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
                type: "remote",
                format: "binary",
                url: "https://gcore.jsdelivr.net/gh/SagerNet/sing-geosite@rule-set/geosite-microsoft@cn.srs",
                download_detour: "direct",
            },
            {
                tag: "geosite-apple-cn",
                type: "remote",
                format: "binary",
                url: "https://gcore.jsdelivr.net/gh/SagerNet/sing-geosite@rule-set/geosite-apple@cn.srs",
                download_detour: "direct",
            },
            {
                tag: "geosite-google-cn",
                type: "remote",
                format: "binary",
                url: "https://gcore.jsdelivr.net/gh/SagerNet/sing-geosite@rule-set/geosite-google@cn.srs",
                download_detour: "direct",
            },
            {
                tag: "geosite-games-cn",
                type: "remote",
                format: "binary",
                url: "https://gcore.jsdelivr.net/gh/SagerNet/sing-geosite@rule-set/geosite-category-games@cn.srs",
                download_detour: "direct",
            },
            {
                tag: "geoip-cn",
                type: "remote",
                format: "binary",
                url: "https://gcore.jsdelivr.net/gh/SagerNet/sing-geoip@rule-set/geoip-cn.srs",
                download_detour: "direct",
            },
            {
                tag: "geosite-cn",
                type: "remote",
                format: "binary",
                url: "https://gcore.jsdelivr.net/gh/SagerNet/sing-geosite@rule-set/geosite-cn.srs",
                download_detour: "direct",
            },
            {
                tag: "geosite-geolocation-!cn",
                type: "remote",
                format: "binary",
                url: "https://gcore.jsdelivr.net/gh/SagerNet/sing-geosite@rule-set/geosite-geolocation-!cn.srs",
                download_detour: "direct",
            },
            {
                tag: "geosite-bytedance-!cn",
                type: "remote",
                format: "binary",
                url: "https://gcore.jsdelivr.net/gh/SagerNet/sing-geosite@rule-set/geosite-bytedance@!cn.srs",
                download_detour: "direct",
            },
            {
                tag: "geosite-tiktok",
                type: "remote",
                format: "binary",
                url: "https://gcore.jsdelivr.net/gh/SagerNet/sing-geosite@rule-set/geosite-tiktok.srs",
                download_detour: "direct",
            },
            {
                tag: "geosite-private",
                type: "remote",
                format: "binary",
                url: "https://gcore.jsdelivr.net/gh/SagerNet/sing-geosite@rule-set/geosite-private.srs",
                download_detour: "direct",
            },
            {
                tag: "geosite-jetbrains-cn",
                type: "remote",
                format: "binary",
                url: "https://gcore.jsdelivr.net/gh/SagerNet/sing-geosite@rule-set/geosite-jetbrains@cn.srs",
                download_detour: "direct",
            },
        ],
        final: "select",
    },
};

export default ExampleConfig;
