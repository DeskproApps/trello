import styled from "styled-components";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import {
    Icon,
    Stack,
    RoundedLabelTag,
} from "@deskpro/deskpro-ui";
import { DeskproAppTheme, useDeskproAppTheme } from "@deskpro/app-sdk";
import { TrelloLogo } from "./TrelloLogo";
import { Props } from "./types";

const Container = styled(Stack)`
  align-items: center; 
  padding: 2px;
`;

const Link = styled.a<DeskproAppTheme>`
    :hover {
      border-color: ${({ theme }) => (theme.colors.brandShade60)};
    };
    border-radius: 9px;
    border: 1px solid transparent;
    color: ${({ theme }) => (theme.colors.brandShade100)}
`;

export const TrelloIcon = styled(Icon)`
    display: inline-block !important;
    width: 12px;
    height: 12px;
    padding: 0 6px 0 0;
`;

const TrelloLink = ({ href }: Props) => {
    const { theme } = useDeskproAppTheme();

    return (
        <Link target="_blank" href={href}>
            <RoundedLabelTag
                size="small"
                withClose={false}
                backgroundColor={theme.colors.brandShade20}
                textColor={theme.colors.grey100}
                borderColor={theme.colors.brandShade20}
                closeIcon={faArrowUpRightFromSquare}
                label={(
                    <Container>
                        <TrelloIcon icon={<TrelloLogo/>} />
                        <Stack>
                            <Icon icon={faArrowUpRightFromSquare} />
                        </Stack>
                    </Container>
                )}
            />
        </Link>
    );
}

export { TrelloLink }
