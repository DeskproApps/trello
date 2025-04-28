import { CardType, Labels, Member } from "../../services/trello/types";
import { getCardService, getCurrentMemberService, getLabelsOnBoardService, getMembersOfOrganizationService, TrelloError } from "../../services/trello";
import { IDeskproClient } from "@deskpro/app-sdk";

interface CardDefaultData {
    member: Member & TrelloError | null
    card: CardType | null
    organizationMembers: Member[]
    labels: Labels
}
export default async function getCardDefaultData(client: IDeskproClient, cardId: string): Promise<CardDefaultData> {
    // Get the authenticated user
    const member = await getCurrentMemberService(client)

    // Get the card's info
    const card = await getCardService(client, cardId)

    // Get the members of the card's organization
    const organizationMembers = await getMembersOfOrganizationService(client, card.board.idOrganization)

    // Get the labels associated to the card's board
    const labels = await getLabelsOnBoardService(client, card.idBoard)

    return {
        member,
        card,
        organizationMembers,
        labels
    }

}