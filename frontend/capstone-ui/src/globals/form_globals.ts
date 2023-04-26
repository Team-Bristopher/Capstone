export const REQUIRED_FIELD_ERROR: string = "This is required.";


// Name verification (first & last).
export const NAME_REGEX: RegExp = /^[a-zA-Z]{3,15}$/;

export const INVALID_NAME_ERROR: string = "Name not valid.";

export const NAME_TOO_SHORT_ERROR: string = "Name must exceed 3 characters.";

export const NAME_TOO_LONG_ERROR: string = "Name must not exceed 15 characters.";

// Email verification.
export const EMAIL_REGEX: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{3,}$/;

export const INVALID_EMAIL_ERROR: string = "Email is not valid.";

export const EMAIL_TOO_SHORT_ERROR: string = "Email must exceed 3 characters.";

export const EMAIL_TOO_LONG_ERROR: string = "Email must not exceed 25 characters.";

// Password verification.
export const PASSWORD_REGEX: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{5,50})/;

export const INVALID_PASSWORD_ERROR: string = "Password is not valid.";

export const PASSWORD_TOO_SHORT_ERROR: string = "Password must exceed 5 characters.";

export const PASSWORD_TOO_LONG_ERROR: string = "Password must not exceed 50 characters.";

export const PASSWORDS_DONT_MATCH = "Passwords don't match.";

// Fundraiser verification.
export const FUNDRAISER_TITLE_REGEX: RegExp = new RegExp("^.{3,256}$");

export const FUNDRAISER_DESCRIPTION_REGEX: RegExp = /^.{3,5026}$/;

export const INVALID_FUNDRAISER_TITLE_ERROR: string = "Title is not valid.";

export const INVALID_FUNDRAISER_DESCRIPTION_ERROR: string = "Description is not valid.";

export const INVALID_FUNDRAISER_DESCRIPTION_TITLE_ERROR: string = "Description is not valid.";

export const FUNDRAISER_TITLE_TOO_SHORT_ERROR: string = "Title must exceed 3 characters.";

export const FUNDRAISER_TITLE_TOO_LONG_ERROR: string = "Title must not exceed 256 characters.";

export const FUNDRAISER_DESCRIPTION_TOO_SHORT_ERROR: string = "Description must exceed 3 characters.";

export const FUNDRAISER_DESCRIPTION_TOO_LONG_ERROR: string = "Description must not exceed 5026 characters.";

export const GOAL_TOO_SMALL_ERROR: string = "Goal cannot be 0.";

// Donation verification.
export const DONATION_TOO_SMALL_ERROR: string = "Donation cannot be 0."

export const DONATION_MESSAGE_TOO_LONG: string = "Donation message must not exceed 500 characters."

// Payment page verification.
export const CARDHOLDER_NAME_REGEX: RegExp = /^[A-Za-z]+(?: [A-Za-z]+)+$/;

export const CARDHOLDER_NAME_REQUIRED: string = "Cardholder name is required.";

export const INVALID_CARDHOLDER_NAME_ERROR: string = "Please enter a valid name containing only letters and spaces between 3 and 50 characters long.";

export const SHORT_CARDHOLDER_NAME_ERROR: string = "Please enter a name containing at least 3 characters.";

export const LONG_CARDHOLDER_NAME_ERROR: string = "Please enter a name containing no more than 50 characters.";

export const CARDHOLDER_NAME_INVALID: string = "Please enter a valid first and last name";

export const CREDIT_CARD_NUMBER_REGEX: RegExp = /^(?:[0-9]{4}[- ]){3}[0-9]{4}|[0-9]{16}$/;

export const CREDIT_CARD_NUMBER_REQUIRED: string = "Credit card number is required.";

export const CREDIT_CARD_INVALID: string = "Please enter a valid 16 digit credit/debit card number.";

export const INVALID_CREDIT_CARD_NUMBER: string = "Please enter a valid credit card number.";

export const CREDIT_CARD_NUMBER_LENGTH_NOT_VALID: string = "Credit card number must be 16 digits.";

export const EXPIRATION_DATE_REGEX: RegExp = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;

export const EXPIRATION_DATE_REQUIRED_ERROR: string = "Expiration date is required."

export const EXPIRATION_DATE_INVALID: string = "Please enter a valid expiration date in the form MM/YY";

export const INVALID_EXPIRATION_DATE_ERROR: string = "Invalid expiration date. Please use the format MM/YY.";

export const SECURITY_CODE_REGEX: RegExp = /^[0-9]{3}$/;

export const SECURITY_CODE_REQUIRED_ERROR: string = "Security code is required.";

export const SECURITY_CODE_INVALID_ERROR: string = "Security code is invalid.";

// Account recovery.
export const ACCOUNT_RECOVERY_CODE_REGEX: RegExp = /^\d{6}$/;

export const INVALID_RECOVERY_CODE_ERROR: string = "Invalid recovery code.";


