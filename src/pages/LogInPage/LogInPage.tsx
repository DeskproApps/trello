import { useDeskproElements } from "@deskpro/app-sdk";
import { useLogIn } from "./hooks";
import { LogIn } from "../../components";

const LogInPage = () => {
  const { poll, authUrl, isAuthing } = useLogIn();

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("trelloRefreshButton", { type: "refresh_button" });
  });

  return (
    <LogIn poll={poll} authUrl={authUrl} isAuthing={isAuthing} />
  );
};

export { LogInPage };
