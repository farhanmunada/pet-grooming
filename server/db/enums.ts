export const AppointmentStatus = {
  REQUESTED: 'Requested',
  CONFIRMED: 'Confirmed',
  IN_PROGRESS: 'InProgress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'NoShow'
} as const

export const PaymentMethod = {
  CASH: 'Cash',
  TRANSFER: 'Transfer',
  E_WALLET: 'EWallet'
} as const

export const PaymentStatus = {
  PENDING: 'Pending',
  PARTIAL: 'Partial',
  PAID: 'Paid',
  REFUNDED: 'Refunded'
} as const

export const UserRole = {
  ADMIN: 'Admin',
  STAFF: 'Staff'
} as const

export const PetSpecies = {
  DOG: 'Dog',
  CAT: 'Cat',
  RABBIT: 'Rabbit',
  OTHER: 'Other'
} as const

export const PetGender = {
  MALE: 'Male',
  FEMALE: 'Female'
} as const

export const VaccineType = {
  CORE: 'Core',
  NON_CORE: 'NonCore'
} as const

export const SizeCategory = {
  SMALL: 'Small',
  MEDIUM: 'Medium',
  LARGE: 'Large',
  GIANT: 'Giant'
} as const

export const TransactionType = {
  SERVICE: 'Service',
  PRODUCT: 'Product',
  MIXED: 'Mixed'
} as const

export const StockAdjustmentReason = {
  DAMAGED: 'Damaged',
  LOST: 'Lost',
  RETURN: 'Return',
  STOCK_OPNAME: 'StockOpname',
  INTERNAL_USE: 'InternalUse'
} as const

export const VaccinationStatus = {
  UP_TO_DATE: 'up-to-date',
  EXPIRING: 'expiring',
  EXPIRED: 'expired',
  UNKNOWN: 'unknown'
} as const
