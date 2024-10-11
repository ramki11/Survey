import type { InquiryCreate } from "../../client/models"
import { InquiriesService } from "../../client/services"
import FormModal from "../Common/FormModal"

export const MIN_INQUIRY_LENGTH = 10
export const MAX_INQUIRY_LENGTH = 256

interface AddInquiryProps {
  isOpen: boolean
  onClose: () => void
}

const AddInquiry = ({ isOpen, onClose }: AddInquiryProps) => {
  const mutationFn = async (data: InquiryCreate): Promise<void> => {
    await InquiriesService.inquiriesCreateInquiry({ requestBody: data })
  }
  const content = "Why do birds suddenly appear every time you are near?"
  return (
    <FormModal<InquiryCreate>
      isOpen={isOpen}
      onClose={onClose}
      title="Why birds?"
      content={content}
      mutationFn={mutationFn}
      successMessage="Inquiry created successfully."
      queryKeyToInvalidate={["inquiries"]}
      submitButtonProps={{ "data-testid": "submit-add-inquiry" }}
    />
  )
}

export default AddInquiry
