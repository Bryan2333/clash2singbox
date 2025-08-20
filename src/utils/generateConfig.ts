import { SingboxConvertedProxyGroup } from "../types/sing_box_type";
import ExampleConfig from "../config/example_config";
import { EOL } from "node:os";

export function generateConfig(
    singboxConvertedProxyGroups: SingboxConvertedProxyGroup[]
) {
    const selectOutbound = ExampleConfig.outbounds.find(
        (outbound) => outbound.tag === "select"
    );

    try {
        for (const singboxProxyGroup of singboxConvertedProxyGroups) {
            const singboxProxyNames = singboxProxyGroup.proxies.map(
                (singboxProxy) => singboxProxy.tag
            );

            ExampleConfig.outbounds.push({
                type: "selector",
                tag: singboxProxyGroup.name,
                outbounds: singboxProxyNames,
            });

            ExampleConfig.outbounds.push(...singboxProxyGroup.proxies);
            selectOutbound?.outbounds?.push(singboxProxyGroup.name);
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
