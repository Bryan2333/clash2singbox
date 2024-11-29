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
                address: "local",
                detour: "direct",
            },
            {
                tag: "dns_fakeip",
                address: "fakeip",
            },
            {
                tag: "dns_block",
                address: "rcode://success",
            },
            {
                tag: "dns_dnssb",
                address: "tcp://45.11.45.11",
                detour: "select",
            },
        ],
        rules: [
            {
                server: "dns_block",
                disable_cache: true,
                rule_set: "geosite-category-ads-all",
            },
            {
                server: "dns_local",
                rule_set: ["geosite-private"],
                domain: ["ping.archlinux.org"],
                domain_keyword: ["ntp"],
            },
            {
                server: "dns_fakeip",
                rewrite_ttl: 10,
                rule_set: [
                    "geosite-private",
                    "geosite-microsoft-cn",
                    "geosite-apple-cn",
                    "geosite-google-cn",
                    "geosite-games-cn",
                    "geosite-cn",
                    "geosite-jetbrains-cn",
                    "geosite-geolocation-!cn",
                    "geosite-bytedance-!cn",
                    "geosite-tiktok",
                ],
            },
            {
                server: "dns_dnssb",
                rewrite_ttl: 10,
                client_subnet: "114.114.114.114",
                type: "logical",
                mode: "and",
                rules: [
                    {
                        rule_set: "geosite-cn",
                        invert: true,
                    },
                ],
            },
        ],
        final: "dns_local",
        strategy: "ipv4_only",
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
            tag: "mixed-in",
            listen: "127.0.0.1",
            listen_port: 7890,
            sniff: true,
        },
        {
            type: "mixed",
            tag: "mixed-in",
            listen: "::1",
            listen_port: 7890,
            sniff: true,
        },
        {
            type: "tproxy",
            tag: "tproxy-in",
            listen: "127.0.0.1",
            listen_port: 7894,
            sniff: true,
        },
        {
            type: "tproxy",
            tag: "tproxy-in",
            listen: "::1",
            listen_port: 7894,
            sniff: true,
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
        {
            type: "block",
            tag: "block",
        },
        {
            type: "dns",
            tag: "dns-out",
        },
    ],
    route: {
        rules: [
            {
                inbound: "direct-only",
                outbound: "direct",
            },
            {
                protocol: "dns",
                outbound: "dns-out",
            },
            {
                network: "udp",
                outbound: "direct",
            },
            {
                type: "logical",
                mode: "and",
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
                rule_set: "geosite-category-ads-all",
                outbound: "block",
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
                tag: "geosite-category-ads-all",
                type: "remote",
                format: "binary",
                url: "https://gcore.jsdelivr.net/gh/SagerNet/sing-geosite@rule-set/geosite-category-ads-all.srs",
                download_detour: "direct",
            },
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
