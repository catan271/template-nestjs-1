export enum ErrorCode {
  // system errors
  UNKNOWN = "999999",
  VALIDATION = "999422",
  FORBIDDEN = "999403",
  UNAUTHORIZED = "999401",

  // authorization errors
  WRONG_CREDENTIALS = "000001",
  USER_REGISTERED = "000002",
  EMAIL_NOT_FOUND = "000003",
  AUTH_USER_NOT_FOUND = "000004",
  INVALID_TOKEN = "000005",
  WRONG_OLD_PASSWORD = "000006",
  AUTH_USER_INACTIVE = "000007",
}

export const errorMessages: Record<ErrorCode, string> = {
  // system
  "999999": "Unknown error",
  "999422": "Validation error",
  "999403": "Forbidden",
  "999401": "Unauthorized",
  // authorization
  "000001": "ID or password is incorrect",
  "000002": "User registered",
  "000003": "Email not found",
  "000004": "You should login in first",
  "000005": "Invalid reset password token",
  "000006": "Current password is incorrect",
  "000007": "This account is INACTIVE",
};
