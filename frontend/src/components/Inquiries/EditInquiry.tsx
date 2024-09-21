import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"

import type { ApiError } from "../../client"
import type { InquiryCreate } from "../../client/models"
import * as InquiriesService from "../../client/services"
import useCustomToast from "../../hooks/useCustomToast"
import { handleError } from "../../utils"

interface EditInquiryProps {
  isOpen: boolean
  onClose: () => void
  inquiry: InquiryCreate
}

export const MIN_INQUIRY_LENGTH = 10
export const MAX_INQUIRY_LENGTH = 256

function isValidUnicode(str: string): boolean {
  let retval: boolean
  try {
    retval = str === decodeURIComponent(encodeURIComponent(str))
  } catch {
    retval = false
  }
  return retval
}

const EditInquiry = ({ isOpen, onClose, inquiry }: EditInquiryProps) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      text: inquiry.text,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: InquiryCreate) =>
      InquiriesService.updateInquiry({
        inquiryId: inquiry.id ?? "",
        requestBody: data,
      }),
    onSuccess: () => {
      showToast("Success!", "Inquiry updated successfully.", "success")
      reset()
      onClose()
    },
    onError: (err: ApiError) => {
      handleError(err, showToast)
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["inquiries"] })
    },
  })

  const onSubmit: SubmitHandler<InquiryCreate> = (data) => {
    mutation.mutate(data)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "sm", md: "md" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader id="edit-inquiry-show-modal">Edit Inquiry</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={!!errors.text}>
              <FormLabel htmlFor="text">Inquiry Text</FormLabel>
              <Textarea
                id="text"
                data-testid="edit-inquiry-text"
                {...register("text", {
                  required: "Inquiry text is required.",
                  minLength: {
                    value: MIN_INQUIRY_LENGTH,
                    message: `Inquiry must be at least ${MIN_INQUIRY_LENGTH} characters.`,
                  },
                  maxLength: {
                    value: MAX_INQUIRY_LENGTH,
                    message: `Inquiry can not be greater than ${MAX_INQUIRY_LENGTH} characters.`,
                  },
                  validate: (value: string) =>
                    isValidUnicode(value) ||
                    "Inquiry must be a valid unicode string.",
                })}
                placeholder="Edit the text of your inquiry."
              />
              {errors.text && (
                <FormErrorMessage>{errors.text.message}</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button
              isLoading={isSubmitting}
              variant="primary"
              type="submit"
              data-testid="submit-edit-inquiry"
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditInquiry
