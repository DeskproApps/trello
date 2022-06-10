import {
    proxyFetch,
    IDeskproClient,
} from "@deskpro/app-sdk";
import { ApiRequestMethod } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const baseRequest = async (client: IDeskproClient, url: string, method: ApiRequestMethod = "GET", content?: any) => {
    const dpFetch = await proxyFetch(client);

    let body = undefined;

    if (content instanceof FormData) {
        body = content;
    } else if(content) {
        body = JSON.stringify(content);
    }

    const headers: Record<string, string> = {
        "Accept": "application/json",
    };

    if (body instanceof FormData) {
        headers["X-Atlassian-Token"] = "no-check";
    } else if (content) {
        headers["Content-Type"] = "application/json";
    }

    const res = await dpFetch(url, {
        method,
        body,
        headers,
    });

    if (res.status === 400) {
        return res.json();
    }

    if (res.status === 401) {
        return Promise.resolve({
            error: {
                code: 401,
                status: "Unauthorized"
            }
        })
    }

    if (res.status < 200 || res.status >= 400) {
        throw new Error(`${method} ${url}: Response Status [${res.status}]`);
    }

    try {
        return await res.json();
    } catch (e) {
        return {};
    }
};

export { baseRequest };
