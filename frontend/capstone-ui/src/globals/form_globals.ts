// Name verification (first & last).
export const NAME_REGEX: RegExp = new RegExp("^[a-zA-Z]{3,15}$");

export const INVALID_NAME_ERROR: string = "Name not valid.";

export const REQUIRED_FIELD_ERROR: string = "This is required.";

export const NAME_TOO_SHORT_ERROR: string = "Name must exceed 3 characters.";

export const NAME_TOO_LONG_ERROR: string = "Name must not exceed 15 characters.";

// Email verification.
export const EMAIL_REGEX: RegExp = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{3,}$");

export const INVALID_EMAIL_ERROR: string = "Email is not valid.";

export const EMAIL_TOO_SHORT_ERROR: string = "Email must exceed 3 characters.";

export const EMAIL_TOO_LONG_ERROR: string = "Email must not exceed 25 characters.";

// Password verification.
export const PASSWORD_REGEX: RegExp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{5,50})");

export const INVALID_PASSWORD_ERROR: string = "Password is not valid.";

export const PASSWORD_TOO_SHORT_ERROR: string = "Password must exceed 5 characters.";

export const PASSWORD_TOO_LONG_ERROR: string = "Password must not exceed 50 characters.";

export const PASSWORDS_DONT_MATCH = "Passwords don't match.";

