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
import type { InquiryPublic, InquiryUpdate } from "../../client/models"
import * as InquiriesService from "../../client/services"
import useCustomToast from "../../hooks/useCustomToast"
import { handleError } from "../../utils"

export const MIN_INQUIRY_LENGTH = 10
export const MAX_INQUIRY_LENGTH = 256

function isValidUnicode(str: string): boolean {
  try {
    return str === decodeURIComponent(encodeURIComponent(str))
  } catch {
    return false
  }
}

interface AddOrEditInquiryModalProps {
  isOpen: boolean
  onClose: () => void
  inquiry?: InquiryPublic | null
  onSave: (updatedInquiry: InquiryUpdate) => void
}

const AddOrEditInquiryModal = ({
  isOpen,
  onClose,
  inquiry,
  onSave,
}: AddOrEditInquiryModalProps) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryUpdate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      text: inquiry?.text ?? "",
      id: inquiry?.id ?? "", // Include id in default values
    },
  })

  const isEditing = !!inquiry

  const mutation = useMutation({
    mutationFn: (data: InquiryUpdate) =>
      InquiriesService.updateInquiry(data as InquiryPublic),
    onSuccess: () => {
      showToast(
        "Success!",
        isEditing
          ? "Inquiry updated successfully."
          : "Inquiry created successfully.",
        "success",
      )
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

  const onSubmit: SubmitHandler<InquiryUpdate> = (data) => {
    onSave(data)
    mutation.mutate(data)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>{isEditing ? "Edit Inquiry" : "Add Inquiry"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl isInvalid={!!errors.text}>
            <FormLabel htmlFor="text">Inquiry Text</FormLabel>
            <Textarea
              id="text"
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
              placeholder={
                isEditing
                  ? "Edit the text of your inquiry."
                  : "Enter the text of your inquiry."
              }
            />
            {errors.text && (
              <FormErrorMessage>{errors.text.message}</FormErrorMessage>
            )}
          </FormControl>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button isLoading={isSubmitting} type="submit" colorScheme="blue">
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AddOrEditInquiryModal
