import {
  type CellContext,
  type ColumnDef,
  type ColumnHelper as ColumnHelperType,
  createColumnHelper,
} from "@tanstack/react-table"
import type { InquiryPublic } from "../../client"
import { formatISODateToUserTimezone } from "../../utils/date"
import AddScheduledInquiry from "../ScheduledInquiries/AddScheduledInquiry"

const columnHelper: ColumnHelperType<InquiryPublic> =
  createColumnHelper<InquiryPublic>()

export const columns: ColumnDef<InquiryPublic, string>[] = [
  columnHelper.display({
    header: "Action",
    cell: ({ row }) => <AddScheduledInquiry inquiry={row.original} />,
  }),
  columnHelper.accessor("text", {
    header: "Text",
    cell: (info: CellContext<InquiryPublic, string>) => info.getValue(),
  }),
  columnHelper.accessor("created_at", {
    header: "Created At",
    cell: (info: CellContext<InquiryPublic, string>) =>
      formatISODateToUserTimezone(info.getValue()),
  }),
]
