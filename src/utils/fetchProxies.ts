import axios from "axios";
import YAML from "yaml";
import { BaseProxyInClash } from "../types/clash_type";

export async function fetchProxies(): Promise<
    { name: string; content: BaseProxyInClash[] }[]
> {
    try {
        const args = process.argv.slice(2);

        const subGroup: { name: string; url: string }[] = [];
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

        const proxies = [];

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
