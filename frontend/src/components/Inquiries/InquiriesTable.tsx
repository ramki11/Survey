import { useDisclosure } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { useMemo, useState } from "react"
import type { InquiryPublic } from "../../client/models"
import * as InquiriesService from "../../client/services/inquiriesService"
import useCustomToast from "../../hooks/useCustomToast"

// Dayjs Configurations
dayjs.extend(utc)
dayjs.extend(timezone)

const InquiriesTable = () => {
  const showToast = useCustomToast()

  // Format ISO date to the user's timezone.
  // ex. Sep 17, 2024 14:13 PM
  const formatDate = (date: string): string => {
    const invalidDateMessage = "Invalid Date"
    if (typeof date !== "string") return invalidDateMessage

    const parsedDate = dayjs.utc(date)
    const userTimezone = dayjs.tz.guess()
    return parsedDate.isValid()
      ? parsedDate.tz(userTimezone).format("MMM DD, YYYY hh:mm A")
      : invalidDateMessage
  }

  const { data: inquiries, isPending } = useQuery({
    queryKey: ["inquiries"],
    queryFn: () => InquiriesService.readInquiries(),
  })

  // Sort inquiries from Newest to oldest
  const sortedInquiries = useMemo(() => {
    return inquiries?.data
      ? [...inquiries.data].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
      : []
  }, [inquiries])

  const queryClient = useQueryClient()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryPublic | null>(
    null,
  )
  const [editText, setEditText] = useState("")

  const updateInquiryMutation = useMutation({
    mutationFn: async (updatedInquiry: InquiryPublic) => {
      return await InquiriesService.updateInquiry(updatedInquiry)
    },
    onSuccess: () => {
      showToast("Success!", "Inquiry updated successfully.", "success")
      onClose()
    },
    onError: (err) => {
      handleError(err as ApiError, showToast)
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["inquiries"] })
    },
  })

  const handleEditClick = (inquiry: InquiryPublic) => {
    setSelectedInquiry(inquiry)
    setEditText(inquiry.text)
    onOpen()
  }

  const handleSave = () => {
    if (editText.length < 10) {
      showToast("Error", "Inquiry must be at least 10 characters.", "error")
      return
    }

    if (selectedInquiry) {
      updateInquiryMutation.mutate({
        ...selectedInquiry,
        text: editText,
      })
    }
  }

  return (
    <>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Text</Th>
              <Th>Created At</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          {isPending ? (
            <Tbody>
              <Tr>
                {new Array(3).fill(null).map((_, index) => (
                  <Td key={index}>
                    <SkeletonText noOfLines={1} />
                  </Td>
                ))}
              </Tr>
            </Tbody>
          ) : (
            <Tbody>
              {sortedInquiries.length > 0 ? (
                sortedInquiries.map((inquiry) => (
                  <Tr key={inquiry.id} data-testid="inquiry-row">
                    <Td data-testid="inquiry-text">{inquiry.text}</Td>
                    <Td data-testid="inquiry-datetime">
                      {formatDate(inquiry.created_at)}
                    </Td>
                    <Td>
                      <IconButton
                        aria-label="Edit Inquiry"
                        icon={<EditIcon />}
                        onClick={() => handleEditClick(inquiry)}
                      />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={3}>No inquiries found</Td>
                </Tr>
              )}
            </Tbody>
          )}
        </Table>
      </TableContainer>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Inquiry</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSave}>
                Save
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}

export default InquiriesTable
