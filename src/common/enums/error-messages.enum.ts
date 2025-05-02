export enum ErrorMessages {
  INVALID_TOKEN = 'Invalid Token',
  INVALID_REFRESH_TOKEN = 'Refresh token is invalid',
  INVALID_CREDS = 'Wrong Credentials',
  EMAIL_EXISTS = 'Email already in use',
  ACCESS_DENIED = 'Access denied for your role',
  INVALID_SLOT_END_TIME= 'End time must be after start time',
  PROVIDER_NOT_FOUND = 'Provider not found',
  SLOT_NOT_FOUND = 'Slot not found',
  INVALID_SLOT_OWNERSHIP = 'You can only update your own slots',
  USER_NOT_FOUND = 'User not found',
  SLOT_ALREADY_BOOKED = 'This slot is already booked',
  APPOINTMENT_NOT_FOUND = 'Appointment not found',
  INVALID_APPOINTMENT_OWNERSHIP = 'You can only delete your own appointments'

}
