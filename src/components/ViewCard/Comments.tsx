import { FC } from "react";
import styled from "styled-components";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@deskpro/deskpro-ui";
import ReactTimeAgo from "react-time-ago";
import { H1, P1, P11, Stack } from "@deskpro/app-sdk";
import { Comment } from "../../services/trello/types";

const DateTime = styled(ReactTimeAgo)`
    color: ${({ theme }) => theme.colors.grey80};
`;

const Comments: FC<{
    comments?: Comment[],
}> = ({ comments }) => {
    return (Array.isArray(comments) && comments.length > 0)
        ? (
            <>
                <H1 style={{ marginBottom: 14 }}>Comments  ({comments.length})</H1>

                {comments.map(({ id, date, data, memberCreator }) => (
                    <Stack key={id} wrap="nowrap" gap={6} style={{ marginBottom: 10 }}>
                        <Stack vertical>
                            <Avatar size={18} name={memberCreator.fullName} backupIcon={faUser} />
                            <P11>
                                <DateTime date={new Date(date)} timeStyle="mini" />
                            </P11>
                        </Stack>
                        <P1>{data.text}</P1>
                    </Stack>
                ))}
            </>
        )
        : null;
}

export { Comments };
