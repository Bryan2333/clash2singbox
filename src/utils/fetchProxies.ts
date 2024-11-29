import axios from "axios";
import YAML from "yaml";
import { BaseProxyInClash } from "../types/clash_type";

export async function fetchProxies(): Promise<BaseProxyInClash[]> {
    try {
        const subscriptionURL = process.env.subURL || "";
        if (!subscriptionURL) throw new Error("Missing subscription URL");

        const content = (await axios.get(subscriptionURL)).data;
        const res = YAML.parse(content);

        return res.proxies || [];
    } catch (error) {
        console.error("Failed to fetch proxies:", error);
        throw error;
    }
}
