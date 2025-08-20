#!/usr/bin/node

import { SingboxConvertedProxyGroup } from "./types/sing_box_type";
import { ClashSubscriptionGroup } from "./types/clash_type";
import { convertProxies } from "./utils/convertProxies";
import { fetchProxies } from "./utils/fetchProxies";
import { generateConfig } from "./utils/generateConfig";

async function main() {
    try {
        const args = process.argv.slice(2);

        const subGroup: ClashSubscriptionGroup[] = [];

        args.forEach((arg) => {
            if (arg.startsWith("--sub=")) {
                const pair = arg.slice("--sub=".length);
                const [name, ...urlParts] = pair.split("=");
                subGroup.push({
                    name: name,
                    url: urlParts.join("="),
                });
            }
        });

        if (subGroup.length === 0) {
            console.error(
                "No subscription groups provided. Use --sub=name=url format."
            );
            return;
        }

        const fetchedClashProxies = await fetchProxies(subGroup);
        const convertedSingboxProxies: SingboxConvertedProxyGroup[] = [];
        for (const proxy of fetchedClashProxies) {
            const newProxy = convertProxies(proxy.content);
            convertedSingboxProxies.push({
                name: proxy.name,
                proxies: newProxy,
            });
        }
        generateConfig(convertedSingboxProxies);
    } catch (error) {
        console.error("Error in main process:", error);
    }
}

main();
