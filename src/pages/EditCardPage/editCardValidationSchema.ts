import * as yup from "yup";


const editCardValidationSchema = yup.object().shape({
  title: yup.string().required(),
  board: yup.object({
    key: yup.string().required(),
    label: yup.string().required(),
    value: yup.string().required(),
    type: yup.string().oneOf(["value"]).required(),
  }),
  list: yup.object({
    key: yup.string().required(),
    label: yup.string().required(),
    value: yup.string().required(),
    type: yup.string().oneOf(["value"]).required(),
  }),
  description: yup.string(),
  labels: yup.array(yup.string()),
  members: yup.array(yup.string()),
  dueDate: yup.date(),
})

export default editCardValidationSchema