import { match } from "ts-pattern";
import { DeskproAppTheme } from "@deskpro/app-sdk";

const getLabelColor = (
    theme: DeskproAppTheme['theme'],
    color: string,
) => {
    return match(color)
        .with("red", () => ({
            border: `1px solid ${theme.colors.scarlett100}`,
            textColor: theme.colors.grey100,
            backgroundColor: theme.colors.scarlett10,
        }))
        .with("yellow", () => ({
            border: `1px solid ${theme.colors.ochre100}`,
            textColor: theme.colors.grey100,
            backgroundColor: theme.colors.ochre10,
        }))
        .with("green", () => ({
            border: `1px solid ${theme.colors.green100}`,
            textColor: theme.colors.grey100,
            backgroundColor: theme.colors.green10,
        }))
        .with("purple", () => ({
            border: `1px solid ${theme.colors.amethyst100}`,
            textColor: theme.colors.grey100,
            backgroundColor: theme.colors.amethyst10,
        }))
        .with("blue", () => ({
            border: `1px solid ${theme.colors.cyan100}`,
            textColor: theme.colors.grey100,
            backgroundColor: theme.colors.cyan10,
        }))
        .with("orange", () => ({
            border: `1px solid ${theme.colors.orange100}`,
            textColor: theme.colors.grey100,
            backgroundColor: theme.colors.orange10,
        }))
        .with("lime", () => ({
            border: `1px solid ${theme.colors.yellow100}`,
            textColor: theme.colors.grey100,
            backgroundColor: theme.colors.yellow10,
        }))
        .with("pink", () => ({
            border: `1px solid ${theme.colors.pink100}`,
            textColor: theme.colors.grey100,
            backgroundColor: theme.colors.pink10,
        }))
        .with("black", () => ({
            border: `1px solid ${theme.colors.green100}`,
            textColor: theme.colors.grey100,
            backgroundColor: theme.colors.green10,
        }))
        .with("sky", () => ({
            border: `1px solid ${theme.colors.turquoise100}`,
            textColor: theme.colors.grey100,
            backgroundColor: theme.colors.turquoise10,
        }))
        .otherwise(() => ({
            border: `1px solid ${theme.colors.grey40}`,
            textColor: theme.colors.grey100,
            backgroundColor: theme.colors.grey10,
        }))
};

export { getLabelColor };
