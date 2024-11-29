import { TransportInClash } from "../types/clash_type";
import { TransportInSingbox } from "../types/sing_box_type";

export function parseTransport(
    node: TransportInClash
): TransportInSingbox | undefined {
    switch (node.network) {
        case "grpc":
            return parseGrpcOptions(node);
        case "ws":
            return parseWsOptions(node);
        case "h2":
            return parseH2Options(node);
        default:
            return undefined;
    }
}

function parseGrpcOptions(node: TransportInClash): TransportInSingbox {
    const ret: TransportInSingbox = {
        type: "grpc",
    };

    if (node["grpc-opts"]) {
        ret.service_name = node["grpc-opts"]["grpc-service-name"];
    }

    return ret;
}

function parseWsOptions(node: TransportInClash): TransportInSingbox {
    const ret: TransportInSingbox = {
        type: "ws",
    };

    if (node["ws-opts"]) {
        const newPath = node["ws-opts"].path?.replace(/\?ed=\d+/g, "");
        const match = node["ws-opts"].path?.match(/ed=(\d+)/);
        const earlyDataSize = match ? parseInt(match[1], 10) : undefined;

        ret.headers = node["ws-opts"].headers;
        ret.path = newPath;
        ret.max_early_data = earlyDataSize;
    }

    return ret;
}

function parseH2Options(node: TransportInClash): TransportInSingbox {
    const ret: TransportInSingbox = {
        type: "http",
    };

    if (node["h2-opts"]) {
        ret.path = node["h2-opts"].path;
    }

    return ret;
}
