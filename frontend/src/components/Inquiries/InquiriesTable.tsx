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
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import type { InquiryPublic } from "../../client/models.ts"
import { InquiriesService } from "../../client/services"
import { useInquiries } from "../../hooks/useInquiries.ts"
import { formatISODateToUserTimezone } from "../../utils/date.ts"
import AddOrEditInquiryModal from "./AddOrEditInquiryModal.tsx"

const InquiriesTable = () => {
  const { data: inquiriesData, isLoading } = useInquiries()
  function getInquiriesQueryOptions() {
    return {
      queryKey: ["inquiries"],
      queryFn: async () => {
        const inquiries = await InquiriesService.readInquiries()
        return {
          ...inquiries,
          data: inquiries.data.map((inquiry: InquiryPublic) => ({
            ...inquiry,
            created_at: formatISODateToUserTimezone(inquiry.created_at),
          })),
        }
      },
    }
  }

  const { data: inquiries, isPending } = useQuery({
    ...getInquiriesQueryOptions(),
  })

  // Sort inquiries from Newest to oldest
  const sortedInquiries = useMemo(() => {
    if (!inquiriesData?.data) return []
    return inquiriesData.data.sort((a: InquiryPublic, b: InquiryPublic) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [inquiries])

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedInquiry, setSelectedInquiry] = useState<
    InquiryPublic | undefined
  >(undefined)

  const handleEditClick = (inquiry: InquiryPublic) => {
    setSelectedInquiry(inquiry)
    onOpen()
  }

  const handleRowClick = (inquiry: InquiryPublic) => {
    console.log("Row clicked:", inquiry)
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
                sortedInquiries.map((inquiry: InquiryPublic) => (
                  <Tr key={inquiry.id} data-testid="inquiry-row">
                    <Td data-testid="inquiry-text">{inquiry.text}</Td>
                    <Td data-testid="inquiry-datetime">
                      {formatISODateToUserTimezone(inquiry.created_at)}
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
        inquiry={selectedInquiry}
      />
    </>
  )
}

export default InquiriesTable
