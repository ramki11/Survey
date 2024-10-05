import {
  type CellContext,
  type ColumnDef,
  type ColumnHelper,
  createColumnHelper,
} from "@tanstack/react-table"
import type { InquiryPublic } from "../../client"
import { formatDate } from "../../utils/dateUtils"

const columnHelper: ColumnHelper<InquiryPublic> =
  createColumnHelper<InquiryPublic>()

export const columns: ColumnDef<InquiryPublic, string>[] = [
  columnHelper.accessor("text", {
    header: "Text",
    cell: (info: CellContext<InquiryPublic, string>) => info.getValue(),
  }),
  columnHelper.accessor("created_at", {
    header: "Created At",
    cell: (info: CellContext<InquiryPublic, string>) =>
      formatDate(info.getValue()),
  }),
]
