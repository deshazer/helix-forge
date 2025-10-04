import { clsx, type ClassValue } from 'clsx'
import XLSX from 'xlsx'
import { twMerge } from 'tailwind-merge'
import dayjs from 'dayjs'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const exportToExcel = (data, filename, sheetName = 'Sheet1') => {
  const dateKeyPatterns = [
    /(_at|At)$/i, // Ends with _at or At (case-insensitive)
    /(date|Date)$/i, // Ends with date or Date (case-insensitive)
    /^(time|datetime)$/i, // Exactly "time" or "datetime" (case-insensitive)
  ]

  const formattedData = data.map((obj) => {
    const formattedObj = {}
    for (const key in obj) {
      if (dateKeyPatterns.some((pattern) => pattern.test(key))) {
        const date = dayjs(obj[key])
        formattedObj[key] = date.isValid() ? date.toDate() : obj[key]
      } else {
        formattedObj[key] = obj[key]
      }
    }
    return formattedObj
  })
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(formattedData)
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  XLSX.writeFile(wb, filename || `data-export-${Date.now()}.xlsx`)
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})
export const formatCurrency = (amount) => formatter.format(amount)

export const isZodError = (error) =>
  Boolean(error?.code && error?.path && error?.message)
export const fromZodError = (error) => `Validation Error: ${error.message}`

export function getErrorMessage(error) {
  if (typeof error === 'string') {
    return error
  }

  // Handle zod validation errors
  if (isZodError(error)) {
    return fromZodError(error)
  }

  // Recursively map through arrays
  if (Array.isArray(error)) {
    return error.map(getErrorMessage).join(', ')
  }

  // Handle route search validation errors
  if (error?.cause?.issues) {
    return getErrorMessage(error.cause.issues)
  }

  // Handle axios responses
  if (error?.response) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.response?.statusText ||
      error?.message ||
      JSON.stringify(error.response?.data)
    )
  }

  // Get error message from normal JS errors
  if (error instanceof Error) {
    return error.message || error.toString()
  }

  // For objects, loop over the entries
  if (typeof error === 'object' && error !== null) {
    return Object.values(error)
      .map((value) => getErrorMessage(value))
      .join(', ')
  }

  if (error?.message) {
    return error.message
  }

  // Final fallback
  return JSON.stringify(error, null, 2)
}
