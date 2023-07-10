import { useState, useCallback } from "react";
import type { TrelloError } from "../services/trello";

const useAsyncError = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setError] = useState();

  const asyncErrorHandler = useCallback((e: Error|TrelloError) => {
    setError(() => {
      throw e;
    });
  }, [setError]);

  return { asyncErrorHandler };
};

export { useAsyncError };
