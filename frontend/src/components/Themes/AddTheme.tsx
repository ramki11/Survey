import type { ThemeCreate } from "../../client/models"
import { ThemesService } from "../../client/services"
import { isValidUnicode } from "../../utils"
import FormModal, { type FieldDefinition } from "../Common/FormModal"

const MIN_NAME_LENGTH = 1
const MAX_NAME_LENGTH = 255
const MAX_DESCRIPTION_LENGTH = 1024

interface AddThemeProps {
  isOpen: boolean
  onClose: () => void
}

const AddTheme = ({ isOpen, onClose }: AddThemeProps) => {
  const fields: FieldDefinition<ThemeCreate>[] = [
    {
      name: "name",
      label: "Theme Name",
      placeholder: "Enter theme name.",
      type: "input",
      validation: {
        required: "Theme name is required.",
        minLength: {
          value: MIN_NAME_LENGTH,
          message: `Name must be at least ${MIN_NAME_LENGTH} characters.`,
        },
        maxLength: {
          value: MAX_NAME_LENGTH,
          message: `Name cannot exceed ${MAX_NAME_LENGTH} characters.`,
        },
      },
    },
    {
      name: "description",
      label: "Description",
      placeholder: "Enter theme description (optional).",
      type: "textarea",
      validation: {
        validate: (value: string | null | undefined) => {
          if (!value) return true
          if (value.length > MAX_DESCRIPTION_LENGTH)
            return `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`
          return (
            isValidUnicode(value) ||
            "Description must be a valid unicode string."
          )
        },
      },
    },
  ]

  const mutationFn = async (data: ThemeCreate): Promise<void> => {
    await ThemesService.themesCreateTheme({ requestBody: data })
  }

  return (
    <FormModal<ThemeCreate>
      isOpen={isOpen}
      onClose={onClose}
      title="Add Theme"
      fields={fields}
      mutationFn={mutationFn}
      successMessage="Theme created successfully."
      queryKeyToInvalidate={["themes"]}
    />
  )
}

export default AddTheme