import { EditIcon } from "@chakra-ui/icons" // Import the EditIcon
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SkeletonText,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { useMemo, useState } from "react"
import type { InquiryPublic } from "../../client/models.ts"
import * as InquiriesService from "../../client/services/inquiriesService.ts"

// Dayjs Configurations
/* eslint-disable */
dayjs.extend(utc)
dayjs.extend(timezone)
/* eslint-enable */

const InquiriesTable = () => {
  // Format ISO date to the user's timezone.
  // ex. Sep 17, 2024 14:13 PM
  function formatDate(date: string): string {
    const invalidDateMessage = "Invalid Date"
    if (typeof date !== "string") return invalidDateMessage
    // Unsafe access to 'error' typed value is handled by dayjs' isValid function
    /* eslint-disable */
    const parsedDate = dayjs.utc(date)
    const userTimezone = dayjs.tz.guess()
    return parsedDate.isValid()
      ? parsedDate.tz(userTimezone).format("MMM DD, YYYY hh:mm A")
      : invalidDateMessage
    /* eslint-enable */
  }

  function getInquiriesQueryOptions() {
    return {
      queryKey: ["inquiries"],
      queryFn: () => InquiriesService.readInquiries(),
    }
  }

  const { data: inquiries, isPending } = useQuery({
    ...getInquiriesQueryOptions(),
  })

  // Sort inquiries from Newest to oldest
  const sortedInquiries = useMemo(() => {
    if (!inquiries?.data) return []
    return inquiries.data.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [inquiries])

  const queryClient = useQueryClient()
  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null)
  const [editText, setEditText] = useState("")

  const updateInquiryMutation = useMutation({
    mutationFn: async (updatedInquiry: InquiryPublic) => {
      // Use the correct type here
      return await InquiriesService.updateInquiry(updatedInquiry)
    },
    onSuccess: () => {
      // Access the updated data if needed
      queryClient.invalidateQueries({ queryKey: ["inquiries"] })
      toast({
        title: "Inquiry updated successfully",
        // You could potentially use data here to show more specific success information
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      onClose()
    },
    onError: (error: any) => {
      console.error("Error updating inquiry:", error) // Log the error for debugging

      toast({
        title: "Error updating inquiry",
        description: error.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    },
  })

  const handleEditClick = (inquiry: any) => {
    setSelectedInquiry(inquiry)
    setEditText(inquiry.text)
    onOpen()
  }

  const handleSave = () => {
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
              <Th>Actions</Th> {/* Added Actions column */}
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
                <></>
              )}
            </Tbody>
          )}
        </Table>
      </TableContainer>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Inquiry</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Text</FormLabel>
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            </FormControl>
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
    </>
  )
}

export default InquiriesTable
