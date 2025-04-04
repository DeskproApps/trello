import { Title } from "@deskpro/app-sdk";
import { Comment, Container } from "../common";
import type { FC } from "react";
import type { Comment as CommentType } from "../../services/trello/types";

const Comments: FC<{
  comments: CommentType[],
  onClickTitleAction: () => void,
}> = ({ comments, onClickTitleAction }) => {
  return (
    <Container>
      <Title
        title={`Comments  (${comments.length})`}
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
  );
}

export { Comments };
