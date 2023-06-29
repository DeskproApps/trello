import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: false,
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
    },
  },
});

enum QueryKey {
  LINKED_CARDS = "linkedCards",
  CARD = "card",
  COMMENTS = "comments",
  ORGANIZATIONS = "organizations",
}

export { queryClient, QueryKey };
