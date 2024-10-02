import { type ColumnDef, createColumnHelper } from "@tanstack/react-table"
import type { InquiryPublic } from "../../client"
import { formatDate } from "../../utils/dateUtils"

const columnHelper = createColumnHelper<InquiryPublic>()

export const columns: ColumnDef<InquiryPublic, string>[] = [
  columnHelper.accessor("text", {
    header: "Text",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("created_at", {
    header: "Created At",
    cell: (info) => formatDate(info.getValue()),
  }),
]
