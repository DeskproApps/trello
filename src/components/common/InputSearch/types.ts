import { InputProps } from "@deskpro/deskpro-ui";

export type Props = {
    value: string,
    label?: string,
    required?: boolean,
    onClear: () => void,
    onChange: InputProps['onChange'],
};
