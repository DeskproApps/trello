import "regenerator-runtime/runtime";
import "@testing-library/jest-dom/extend-expect";
import { useQuery } from "@tanstack/react-query";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { TextDecoder, TextEncoder } from "util";
import React from "react";
import { lightTheme } from "@deskpro/deskpro-ui";
import { mockClient } from "./testing";
import type { IDeskproClient } from "@deskpro/app-sdk";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
global.TextEncoder = TextEncoder;
//for some reason the types are wrong, but this works
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
global.TextDecoder = TextDecoder;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
global.React = React;

const deskproAppEventsObj = {
  type: "ticket",
  settings: {},
  data: {
    ticket: { id: "215", subject: "Big ticket", permalinkUrl: "https://permalink.url" },
    app: {},
    env: {},
    currentAgent: {},
  },
};

jest.mock("@deskpro/app-sdk", () => ({
  ...jest.requireActual("@deskpro/app-sdk"),
  useDeskproAppClient: () => ({ client: mockClient }),
  useDeskproLatestAppContext: () => ({
    context: deskproAppEventsObj,
  }),
  useDeskproAppEvents: (
    hooks: { [key: string]: (param: Record<string, unknown>) => void },
    deps: [] = []
  ) => {
    React.useEffect(() => {
      !!hooks.onChange && hooks.onChange(deskproAppEventsObj);
      !!hooks.onShow && hooks.onShow(deskproAppEventsObj);
      !!hooks.onReady && hooks.onReady(deskproAppEventsObj);
      !!hooks.onAdminSettingsChange && hooks.onAdminSettingsChange(deskproAppEventsObj.settings);
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, deps);
  },
  useInitialisedDeskproAppClient: (
    callback: (param: Record<string, unknown>) => void
  ) => {
    callback({
      registerElement: () => {},
      deregisterElement: () => {},
      setTitle: () => {},
    });
  },
  useDeskproAppTheme: () => ({ theme: lightTheme }),
  proxyFetch: async () => fetch,
  LoadingSpinner: () => React.createElement("span", {}, "LoadingSpinner..."),
  useQueryWithClient: (
    queryKey: string[],
    queryFn: (client: IDeskproClient) => Promise<void>,
    options: object,
  ) => useQuery(queryKey, () => queryFn(mockClient as never), options),
}));
