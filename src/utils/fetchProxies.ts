import YAML from "yaml";
import {  ClashSubscriptionGroup, ClashFetchedProxyGroup } from "../types/clash_type";

export async function fetchProxies(subGroup: ClashSubscriptionGroup[]): Promise<ClashFetchedProxyGroup[]> {
    try {
        const proxies: ClashFetchedProxyGroup[] = [];

        for (const sub of subGroup) {
            const response = await fetch(sub.url);
            const res = YAML.parse(await response.text());

            if (res) {
                proxies.push({
                    name: sub.name,
                    content: res.proxies,
                });
            }
        }

        return proxies;
    } catch (error) {
        console.error("Failed to fetch proxies:", error);
        throw error;
    }
}
