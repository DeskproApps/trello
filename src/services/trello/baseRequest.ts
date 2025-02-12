import { proxyFetch } from "@deskpro/app-sdk";
import { Request } from "../../types";
import { BASE_URL, placeholders } from "../../constants";
import { getQueryParams } from "../../utils";
import { TrelloError } from "./TrelloError";

const baseRequest: Request = async (client, {
    url,
    data,
    method = "GET",
    queryParams = {},
}) => {
    const dpFetch = await proxyFetch(client);

    let body: FormData | string | undefined = undefined;
    const headers: Record<string, string> = {};

    const requestUrl = `${BASE_URL}${url}/?${
        getQueryParams([
            `key=${placeholders.KEY}`,
            `token=${placeholders.TOKEN}`,
        ].join("&"))
    }&${
        getQueryParams(queryParams)
    }`;

    if (data instanceof FormData) {
        body = data;
    } else if(data) {
        body = JSON.stringify(data);
    }

    if (body instanceof FormData) {
        //...
    } else if (data) {
        headers["Content-Type"] = "application/json";
        headers["Accept"] = "application/json";
    }

    const res = await dpFetch(requestUrl, {
        method,
        body,
        headers,
    });

    if (res.status < 200 || res.status >= 400) {
        throw new TrelloError({
            status: res.status,
            data: await res.json(),
        });
    }

    try {
        return await res.json();
    } catch (e) {
        return {};
    }
};

export { baseRequest };
