import { BaseOutbound } from "../types/sing_box_type";
import ExampleConfig from "../config/example_config";
import { EOL } from "node:os";

export function generateConfig(
    newProxies: { name: string; proxies: BaseOutbound[] }[]
) {
    const selectOutbound = ExampleConfig.outbounds.find(
        (outbound) => outbound.tag === "select"
    );

    try {
        for (const proxy of newProxies) {
            const newProxiesNames = proxy.proxies.map((proxy) => proxy.tag);

            ExampleConfig.outbounds.push({
                type: "selector",
                tag: proxy.name,
                outbounds: newProxiesNames,
            });

            ExampleConfig.outbounds.push(...proxy.proxies);
            selectOutbound?.outbounds?.push(proxy.name);
        }

        ExampleConfig.outbounds.push({
            type: "selector",
            tag: "动画疯",
            outbounds: ExampleConfig.outbounds
                .filter((outbound) => {
                    return (
                        !/selector|dns-out/i.test(outbound.type) &&
                        /TW|Taiwan|香港|台湾|HK|Hong Kong/i.test(outbound.tag)
                    );
                })
                .map((outbound) => outbound.tag),
        });

        console.log(JSON.stringify(ExampleConfig, null, 2) + EOL);
    } catch (error) {
        console.error("Failed to generate configuration:", error);
        throw error;
    }
}
