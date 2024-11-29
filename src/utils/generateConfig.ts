import { BaseOutbound, SelectorInSingbox } from "../types/sing_box_type";
import ExampleConfig from "../config/example_config";

export function generateConfig(newProxies: BaseOutbound[]) {
    const newProxiesNames = newProxies.map((proxy) => proxy.tag);

    try {
        const selectOutbound = ExampleConfig.outbounds.find(
            (outbound) => outbound.tag === "select"
        );

        if (selectOutbound) {
            (selectOutbound as SelectorInSingbox).outbounds?.push(
                ...newProxiesNames
            );
        }

        ExampleConfig.outbounds.push(...newProxies);

        console.log(JSON.stringify(ExampleConfig, null, 2));
    } catch (error) {
        console.error("Failed to generate configuration:", error);
        throw error;
    }
}
