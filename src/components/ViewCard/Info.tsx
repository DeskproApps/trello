import find from "lodash/find";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { Title, useDeskproAppTheme } from "@deskpro/app-sdk";
import { P5, Pill, Icon, Stack } from "@deskpro/deskpro-ui";
import { getDate } from "../../utils/date";
import { getLabelColor } from "../../utils";
import {
  LinkIcon,
  Markdown,
  Container,
  TrelloLogo,
  EmptyInlineBlock,
  TextBlockWithLabel,
} from "../common";
import { Members } from "../common/Cards";
import type { FC } from "react";
import type { CardType, Organization } from "../../services/trello/types";

type Props = {
  card: CardType,
  organizations: Organization[],
};

const Info: FC<Props> = ({ card, organizations }) => {
  const { theme } = useDeskproAppTheme();
  const labels = card?.labels ?? [];
  const due = card?.due;
  const workspace = find(organizations, {
    id: card?.board?.idOrganization,
  });

  return (
    <Container>
      <Title
        title={card?.name ?? "-"}
        icon={<TrelloLogo />}
        link={card?.shortUrl ?? "#"}
      />
      <TextBlockWithLabel
        label="Workspace"
        text={(
          <>
            <P5 style={{ marginRight: 4 }}>{workspace?.displayName ?? "-"}</P5>
            {workspace?.url && (
              <LinkIcon size={10} href={workspace?.url ?? "#"} />
            )}
          </>
        )}
      />
      <TextBlockWithLabel
        label="Board"
        text={(
          <>
            <P5 style={{ marginRight: 4 }}>{card?.board?.name ?? "-"}</P5>
            <LinkIcon size={10} href={card?.board?.url ?? "-"} />
          </>
        )}
      />
      <TextBlockWithLabel
        label="List"
        text={card?.list?.name ?? "-"}
      />
      <TextBlockWithLabel
        label="Description"
        text={(
          <Markdown text={card?.desc ?? "-"} />
        )}
      />
      <TextBlockWithLabel
        label="Labels"
        text={(!labels)
          ? "-"
          : (
            <Stack wrap="wrap" gap={6}>
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                labels.map(({ id, name, color }: any) => (
                  <Pill
                    key={id}
                    label={name ? name : <EmptyInlineBlock />}
                    {...getLabelColor(theme, color)}
                  />
                ))
              }
            </Stack>
          )
        }
      />
      <TextBlockWithLabel
        label="Due date"
        text={(
          <P5>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <Icon icon={faCalendarDays} style={{ color: theme.colors.grey40 }} />&nbsp;
            {!due ? "-" : getDate(due)}
          </P5>
        )}
      />
      <Members members={card?.members ?? []} />
    </Container>
  );
};

export { Info };
