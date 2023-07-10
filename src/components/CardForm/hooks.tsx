import type { Option, Maybe } from "../../types";
import type {
    List,
    Label,
    Board,
    Member,
    Organization,
} from "../../services/trello/types";
import type { Values, MemberOption } from "./types";

type UseCardDeps = () => {
    loading: boolean,
    member: Maybe<Member>,
    memberOptions: MemberOption[],
    organizationOptions: Array<Option<Organization["id"]>>,
    boardOptions: Array<Option<Board["id"]>>,
    listOptions: Array<Option<List["id"]>>,
    labelOptions: Array<Option<Label["id"]>>,
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const useCardDeps: UseCardDeps = (values: Values) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    return {
        //...
    };
};

export { useCardDeps };
