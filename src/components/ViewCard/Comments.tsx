import size from "lodash/size";
import styled from "styled-components";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@deskpro/deskpro-ui";
import ReactTimeAgo from "react-time-ago";
import { P1, P11, Stack } from "@deskpro/deskpro-ui";
import { Title } from "@deskpro/app-sdk";
import { Container } from "../common";
import type { FC } from "react";
import type { Comment } from "../../services/trello/types";
import type { Maybe } from "../../types";

const DateTime = styled(ReactTimeAgo)`
    color: ${({ theme }) => theme.colors.grey80};
`;

const CommentBlock = styled(P1)`
    white-space: pre-wrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Comments: FC<{
    comments: Maybe<Comment[]>,
    onClickTitleAction: () => void,
}> = ({ comments, onClickTitleAction }) => {
    return (Array.isArray(comments) && size(comments))
        ? (
            <Container>
                <Title
                    title={`Comments  (${size(comments)})`}
                    onClick={onClickTitleAction}
                />
                {comments.map(({ id, date, data, memberCreator }) => (
                    <Stack key={id} wrap="nowrap" gap={6} style={{ marginBottom: 10 }}>
                        <Stack vertical>
                            <Avatar size={18} name={memberCreator.fullName} backupIcon={faUser} />
                            <P11>
                                <DateTime date={new Date(date)} timeStyle="mini" />
                            </P11>
                        </Stack>
                        <CommentBlock>{data.text}</CommentBlock>
                    </Stack>
                ))}
            </Container>
        )
        : null;
}

export { Comments };
