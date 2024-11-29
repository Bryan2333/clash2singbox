#!/usr/bin/node

import { fetchProxies } from "./utils/fetchProxies";
import { convertProxies } from "./utils/convertProxies";
import { generateConfig } from "./utils/generateConfig";

async function main() {
    try {
        const oldProxies = await fetchProxies();
        const newProxies = convertProxies(oldProxies);
        generateConfig(newProxies);
    } catch (error) {
        console.error("Error in main process:", error);
    }
}

main();
