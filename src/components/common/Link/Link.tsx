import { DeskproAppTheme } from "@deskpro/app-sdk";
import styled from "styled-components";

const Link = styled.a<DeskproAppTheme>`
  color: ${({ theme }) => theme.colors.cyan100};
  text-decoration: none;
`;

export { Link };
