import { H3, Title, useDeskproElements } from "@deskpro/app-sdk";
import { useLogIn } from "./hooks";
import { AnchorButton, Container } from "../../components/common";

const LogInPage = () => {
  const { poll, authUrl, isAuthing } = useLogIn();

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("trelloRefreshButton", { type: "refresh_button" });
  });

  return (
    <Container>
      <Title as={H3} title="Log into your Trello Account" />
      <AnchorButton
        intent="secondary"
        text="Sign In"
        target="_blank"
        href={authUrl || "#"}
        onClick={poll}
        loading={isAuthing}
        disabled={!authUrl || isAuthing}
      />
    </Container>
  );
};

export { LogInPage };
