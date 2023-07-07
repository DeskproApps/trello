import { FC } from "react";
import styled from "styled-components";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import {
    Input,
    DatePicker,
    DatePickerProps,
    useDeskproAppTheme,
} from "@deskpro/app-sdk";
import { Label } from "../Label";
import "./DateField.css";

export type MappedFieldProps = DatePickerProps & {
    id: string;
    label: string,
    error: boolean,
    value?: string,
    onChange: (date: [Date]) => void,
}

const LabelDueDate = styled(Label)`
    width: calc(100% - 25px);
`;

const DateInput = styled(Input)`
    :read-only {
      cursor: pointer;
    }
`;

export const DateField: FC<MappedFieldProps> = ({
    id,
    value,
    label,
    error,
    onChange,
    ...props
}: MappedFieldProps) => {
    const { theme } = useDeskproAppTheme();

    return (
        <DatePicker
            options={{
                position: "left",
                dateFormat: "d/m/Y",
            }}
            value={value}
            onChange={onChange}
            {...props}
            render={(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                _: any, ref: any
            ) => (
                <LabelDueDate
                    htmlFor={id}
                    label={label}
                >
                    <DateInput
                        id={id}
                        ref={ref}
                        error={error}
                        variant="inline"
                        inputsize="small"
                        placeholder="DD/MM/YYYY"
                        leftIcon={{
                            icon: faCalendarDays,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            style: { color: theme.colors.grey40 }
                        }}
                    />
                </LabelDueDate>
            )}
        />
    );
}
