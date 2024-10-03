import { EditIcon } from "@chakra-ui/icons"
import {
  IconButton,
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
import AddOrEditInquiryModal from "./AddOrEditInquiryModal.tsx"

// Dayjs Configurations
dayjs.extend(utc)
dayjs.extend(timezone)

const InquiriesTable = () => {
  // Format ISO date to the user's timezone.
  // ex. Sep 17, 2024 14:13 PM
  const queryClient = useQueryClient()
  const toast = useToast() as ReturnType<typeof useToast>

  function formatDate(date: string): string {
    const invalidDateMessage = "Invalid Date"
    if (typeof date !== "string") return invalidDateMessage

    const parsedDate = dayjs.utc(date)
    const userTimezone = dayjs.tz.guess()
    return parsedDate.isValid()
      ? parsedDate.tz(userTimezone).format("MMM DD, YYYY hh:mm A")
      : invalidDateMessage
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

  const { isOpen, onOpen, onClose } = useDisclosure() as {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
  }
  const [selectedInquiry, setSelectedInquiry] = useState<
    InquiryPublic | undefined
  >(undefined)
  const [editText, setEditText] = useState("")

  const updateInquiryMutation = useMutation({
    mutationFn: async (updatedInquiry: InquiryPublic) => {
      return await InquiriesService.updateInquiry(updatedInquiry)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["inquiries"] })
      toast({
        title: "Inquiry updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    },
    onError: (error: Error) => {
      console.error("Error updating inquiry:", error)

      toast({
        title: "Error updating inquiry",
        description: error ? "Something went wrong" : "",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    },
  })

  const handleEditClick = (inquiry: InquiryPublic) => {
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
                        onClick={() => {
                          handleEditClick(inquiry)
                        }}
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
      <AddOrEditInquiryModal
        isOpen={isOpen}
        onClose={onClose}
        mode={selectedInquiry ? "edit" : "add"}
        onSave={handleSave}
        inquiry={selectedInquiry}
      />
    </>
  )
}

export default InquiriesTable
