import { FC } from "react";
import styled from "styled-components";
import { Icon } from "@deskpro/deskpro-ui";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { Props } from "./types";

const Link = styled.a`
    color: ${({ theme, color }) => color || theme.colors.grey40 };
`;

const LinkIcon: FC<Props> = ({ size, ...props }) => (
    <Link target="_blank" {...props}>
        <Icon size={size} icon={faArrowUpRightFromSquare} />
    </Link>
);

export { LinkIcon };
