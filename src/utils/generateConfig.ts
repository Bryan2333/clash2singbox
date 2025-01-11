import { BaseOutbound, SelectorInSingbox } from "../types/sing_box_type";
import ExampleConfig from "../config/example_config";

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

        console.log(JSON.stringify(ExampleConfig, null, 2));
    } catch (error) {
        console.error("Failed to generate configuration:", error);
        throw error;
    }
}
