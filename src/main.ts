#!/usr/bin/node

import { fetchProxies } from "./utils/fetchProxies";
import { convertProxies } from "./utils/convertProxies";
import { generateConfig } from "./utils/generateConfig";
import { BaseOutbound } from "./types/sing_box_type";

async function main() {
    try {
        const oldProxies = await fetchProxies();
        const newProxies: { name: string; proxies: BaseOutbound[] }[] = [];
        for (const proxy of oldProxies) {
            const newProxy = convertProxies(proxy.content);
            newProxies.push({ name: proxy.name, proxies: newProxy });
        }
        generateConfig(newProxies);
    } catch (error) {
        console.error("Error in main process:", error);
    }
}

main();
