import { z } from "zod"

export const emailPattern = {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: "Invalid email address",
}

export const namePattern = {
  value: /^[A-Za-z\s\u00C0-\u017F]{1,30}$/,
  message: "Invalid name",
}

export const isISODateTimeString = (date: string): boolean => {
  const isoDateTimeSchema = z.string().datetime({ local: true })
  const parseResult = isoDateTimeSchema.safeParse(date)
  return parseResult.success
}

export const isISODateTimeString = (date: string): boolean => {
  // Unsafe access to 'error' type value is handled by zod's safeParse function
  /* eslint-disable */
  const isoDateTimeSchema = z.string().datetime({ local: true })
  const parseResult = isoDateTimeSchema.safeParse(date)
  return parseResult.success
  /* eslint-enable */
}

