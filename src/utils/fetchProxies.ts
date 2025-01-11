import axios from "axios";
import YAML from "yaml";
import { BaseProxyInClash } from "../types/clash_type";

function parseEnvVar(input: string) {
    const pairs = input.match(/(\S+?=[^\s]+)/g); // 匹配每组 name=url
    if (!pairs) return [];

    return pairs.map((pair) => {
        const [name, ...urlParts] = pair.split("=");
        return {
            name,
            url: urlParts.join("="),
        };
    });
}

export async function fetchProxies(): Promise<
    { name: string; content: BaseProxyInClash[] }[]
> {
    try {
        const subscriptionURL = process.env.subURL || "";
        if (!subscriptionURL) throw new Error("Missing subscription URL");

        const proxies = [];

        const subGroup = parseEnvVar(subscriptionURL);

        for (const sub of subGroup) {
            const content = (await axios.get(sub.url)).data;
            const res = YAML.parse(content);

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
