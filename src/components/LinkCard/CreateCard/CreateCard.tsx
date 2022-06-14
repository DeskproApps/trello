import { useState, FC } from "react";
import { useFormik } from "formik";
import * as yup from 'yup';
import {
    faPlus,
    faCheck,
    faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
    Button as ButtonUI,
    Dropdown,
    InputWithDisplay,
    TextAreaWithDisplay,
} from "@deskpro/deskpro-ui";
import {
    Label,
    SingleSelect,
} from "../../common";

const workspaceOptions = [
    {
        key: "1",
        label: "Workspace 1",
        type: "value",
        value: "workspace1",
    },
    {
        key: "2",
        label: "Workspace 2",
        type: "value",
        value: "workspace2",
    },
    {
        key: "3",
        label: "Workspace 3",
        type: "value",
        value: "workspace3",
    }
];

const boardOptions = [
    {
        key: "1",
        label: "Board 1",
        type: "value",
        value: "board1",
    },
    {
        key: "2",
        label: "Board 2",
        type: "value",
        value: "board2",
    },
    {
        key: "3",
        label: "Board 3",
        type: "value",
        value: "board3",
    }
];

const listOptions = [
    {
        key: "1",
        label: "List 1",
        type: "value",
        value: "list1",
    },
    {
        key: "2",
        label: "List 2",
        type: "value",
        value: "list2",
    },
    {
        key: "3",
        label: "List 3",
        type: "value",
        value: "list3",
    }
];

const validationSchema = yup.object().shape({
    title: yup.string().required(),
    workspace: yup.string().required(),
    board: yup.string().required(),
    list: yup.string().required(),
    description: yup.string(),
    labels: yup.array(yup.string()),
    // ToDo: update to date
    date: yup.string(),
    // ToDo: check is string[] or number[]
    members: yup.array(yup.number()),
});

const getInitValues = () => ({
    title: "",
    workspace: "",
    board: "",
    list: "",
    description: "",
    labels: "",
    date: "",
    members: "",
});

const CreateCard: FC = () => {
    const [selected, setSelected] = useState<string[]>([]);
    const {
        values,
        errors,
        touched,
        handleSubmit,
        getFieldProps,
        getFieldHelpers,
    } = useFormik({
        initialValues: getInitValues(),
        validationSchema,
        onSubmit: (values) => {
            console.log(">>> create:submit:", { values });
        }
    });

    const isValid = (fieldName): boolean => {
        return !(touched[fieldName] && errors[fieldName]);
    };

    const labelsOptions = [
        {
            key: "1",
            label: "Label 1",
            type: "value",
            value: "label1",
            selected:  selected.includes("label1"),
        },
        {
            key: "2",
            label: "Label 2",
            type: "value",
            value: "label2",
            selected:  selected.includes("label2"),
        },
        {
            key: "3",
            label: "Label 3",
            type: "value",
            value: "label3",
            selected:  selected.includes("label3"),
        },
    ];

    return (
        <form onSubmit={handleSubmit}>
            <Label htmlFor="title" label="Title" required>
                <InputWithDisplay
                    type="text"
                    id="title"
                    {...getFieldProps("title")}
                    error={!isValid("title")}
                    placeholder="Enter title"
                    inputsize="small"
                />
            </Label>

            <SingleSelect label="Workspace" options={workspaceOptions} />

            <SingleSelect label="Board" options={boardOptions} />

            <SingleSelect label="List" options={listOptions} />

            <Label htmlFor="description" label="Description">
                <TextAreaWithDisplay
                    placeholder="Enter description"
                    {...getFieldProps("description")}
                />
            </Label>

            {/*<Label htmlFor="labels" label="Labels" error={errors.labels}>
                <MultiSelect
                    id="labels"
                    helpers={getFieldHelpers("labels")}
                    options={labelsOptions}
                    placeholder=""
                    values={values.labels}
                />
            </Label>*/}

            <Label htmlFor="labels" label="Labels"/>
                <Dropdown
                    fetchMoreText={"Fetch more"}
                    autoscrollText={"Autoscroll"}
                    selectedIcon={faCheck}
                    externalLinkIcon={faExternalLinkAlt}
                    placement="bottom-start"
                    {/* @ts-ignore */}
                    options={labelsOptions}
                    onSelectOption={(option) => {
                        if (option.value) {
                            selected.includes(option.value)
                                ? setSelected(selected.filter((s) => s !== option.value))
                                : setSelected([...selected, option.value]);
                        }
                    }}
                    closeOnSelect={false}
                >
                    {({ active, targetProps, targetRef }) => (
                        <ButtonUI ref={targetRef} {...targetProps} active={active} text="Add" icon={faPlus} minimal />
                    )}
                </Dropdown>
        </form>
    );
};

export { CreateCard };
