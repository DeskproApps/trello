import { FC } from "react";
import styled from "styled-components";
import { Stack, VerticalDivider } from "@deskpro/app-sdk";
import { TextBlockWithLabel } from "../TextBlockWithLabel";
import { Props as TextBlockWithLabelProps } from "../TextBlockWithLabel/types";

export type Props = {
    leftLabel: TextBlockWithLabelProps["label"],
    leftText: TextBlockWithLabelProps["text"],
    rightLabel: TextBlockWithLabelProps["label"],
    rightText: TextBlockWithLabelProps["text"],
};

const Side = styled.div``;

const TwoSider: FC<Props> = ({ leftLabel, leftText, rightLabel, rightText }) => (
    <Stack wrap="nowrap" align="stretch" gap={6} style={{ marginBottom: 10 }}>
        <Side style={{ width: "50%" }}>
            <TextBlockWithLabel
                label={leftLabel}
                text={leftText}
            />
        </Side>
        <VerticalDivider width={1} />
        <Side>
            <TextBlockWithLabel
                label={rightLabel}
                text={rightText}
            />
        </Side>
    </Stack>
);

export { TwoSider };
