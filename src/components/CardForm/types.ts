import type { Option } from "../../types";
import type {
    List,
    Board,
    Label,
    CardType,
    Organization, Member,
} from "../../services/trello/types";

export type MemberOption = Option<Member["id"]> & {
    metadata: {
        id: Member["id"]
        fullName: Member["fullName"],
    },
};

export type Values = {
    title: CardType["name"];
    workspace: Option<Organization["id"]>,
    board: Option<Board["id"]>,
    list: Option<List["id"]>
    description: CardType["desc"];
    labels: Array<Label["id"]>;
    dueDate: Date,
    members: Array<Member["id"]>,
};
