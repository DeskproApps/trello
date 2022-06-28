import { FC } from "react";
import styled from "styled-components";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { DatePicker, Input, useDeskproAppTheme } from "@deskpro/app-sdk";
import { Label } from "../Label";

export type MappedFieldProps = {
    id: string;
    label: string,
    error: boolean,
    value?: string,
    onChange: (date: [Date]) => void,
}

const LabelDueDate = styled(Label)`
    width: calc(100% - 25px);
`;

export const DateField: FC<MappedFieldProps> = ({
    id,
    value,
    label,
    error,
    onChange,
}: MappedFieldProps) => {
    const { theme } = useDeskproAppTheme();

    return (
        <DatePicker
            options={{ position: "left" }}
            value={value}
            onChange={onChange}
            render={(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                _: any, ref: any
            ) => (
                <LabelDueDate
                    htmlFor={id}
                    label={label}
                >
                    <Input
                        id={id}
                        ref={ref}
                        error={error}
                        readOnly
                        variant="inline"
                        inputsize="small"
                        placeholder="YYYY-MM-DD"
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
