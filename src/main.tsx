import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { DeskproAppProvider, LoadingSpinner } from "@deskpro/app-sdk";
import { queryClient } from "./query";
import { ReplyBoxProvider } from "./hooks";
import { App } from "./App";
import { ErrorFallback } from "./components";
import "flatpickr/dist/themes/light.css";
import "tippy.js/dist/tippy.css";
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import "./main.css";
import "simplebar/dist/simplebar.min.css";
import { Scrollbar } from "@deskpro/deskpro-ui";

TimeAgo.addDefaultLocale(en);

const root = ReactDOM.createRoot(document.getElementById("root") as Element);
root.render(
    <React.StrictMode>
        <Scrollbar style={{ height: "100%", width: "100%" }}>
            <DeskproAppProvider>
                <HashRouter>
                    <QueryClientProvider client={queryClient}>
                        <Suspense fallback={<LoadingSpinner />}>
                            <ErrorBoundary FallbackComponent={ErrorFallback}>
                                <ReplyBoxProvider>
                                    <App />
                                </ReplyBoxProvider>
                            </ErrorBoundary>
                        </Suspense>
                    </QueryClientProvider>
                </HashRouter>
            </DeskproAppProvider>
        </Scrollbar>
    </React.StrictMode>
);
