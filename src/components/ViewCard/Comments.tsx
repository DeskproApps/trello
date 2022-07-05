import { FC } from "react";
import styled from "styled-components";
import { faUser, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@deskpro/deskpro-ui";
import ReactTimeAgo from "react-time-ago";
import {
    H1,
    P1,
    P11,
    Stack,
    Button as ButtonUI,
} from "@deskpro/app-sdk";
import { Comment } from "../../services/trello/types";

const DateTime = styled(ReactTimeAgo)`
    color: ${({ theme }) => theme.colors.grey80};
`;

const CommentBlock = styled(P1)`
    white-space: pre-wrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Comments: FC<{
    comments?: Comment[],
    onClickTitleAction: () => void,
}> = ({ comments, onClickTitleAction }) => {
    return (Array.isArray(comments) && comments.length > 0)
        ? (
            <>
                <Stack gap={6} align="center" style={{ marginBottom: 14 }}>
                    <H1>Comments  ({comments.length})</H1>
                    <ButtonUI
                        icon={faPlus}
                        minimal
                        noMinimalUnderline
                        onClick={onClickTitleAction}
                    />
                </Stack>

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
            </>
        )
        : null;
}

export { Comments };
