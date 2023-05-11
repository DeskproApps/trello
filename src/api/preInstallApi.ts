import { adminGenericProxyFetch, IDeskproClient } from "@deskpro/app-sdk";

export const getMember = async (
  client: IDeskproClient,
  apiKey: string,
  apiToken: string
) => {
  const fetch = await adminGenericProxyFetch(client);

  return await fetch(
    `https://api.trello.com/1/members/me/?key=${apiKey}&token=${apiToken}`,
    {
      method: "GET",
    }
  ).then((res) => res.json());
};
