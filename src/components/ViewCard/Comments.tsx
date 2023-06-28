import size from "lodash/size";
import { Title } from "@deskpro/app-sdk";
import { Comment, Container } from "../common";
import type { FC } from "react";
import type { Comment as CommentType } from "../../services/trello/types";
import type { Maybe } from "../../types";

const Comments: FC<{
    comments: Maybe<CommentType[]>,
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
                    <Comment
                        key={id}
                        name={memberCreator.fullName}
                        text={data.text}
                        date={new Date(date)}
                    />
                ))}
            </Container>
        )
        : null;
}

export { Comments };
