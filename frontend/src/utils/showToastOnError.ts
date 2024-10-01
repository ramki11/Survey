import type { ApiError } from "../client"

interface ErrorDetail {
  msg: string
}

interface ApiErrorBody {
  detail?: string | ErrorDetail[]
}

type ShowToastFunction = (
  title: string,
  description: string,
  status: "success" | "error",
) => void

export const handleError = (err: ApiError, showToast: ShowToastFunction) => {
  const errDetail = (err.body as ApiErrorBody)?.detail
  let errorMessage = "Something went wrong."
  if (errDetail) {
    if (typeof errDetail === "string") {
      errorMessage = errDetail
    } else if (Array.isArray(errDetail) && errDetail.length > 0) {
      errorMessage = errDetail[0].msg
    }
  }
  showToast("Error", errorMessage, "error")
}
