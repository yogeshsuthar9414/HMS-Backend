// ============= common ===========
export const invalidBasicAuthTkn = 'Invalid Basic Authentication Token';

export const inconvenienceHappened = 'we are sorry for inconvenience happened';

export const invalidMultipleAtp = "You have been logged out due to multiple invalid OTP attempts. Please try again later.";

export const tempUserLock = "For security reasons, your account has been locked due to unusual activity. You can attempt to log in again after <DURATION> minutes.";
export const invaliGFAuthCode = "Invalid Google Authenticator code. Please provide a valid code.";
export const invalidExpireTkn = "Your token has been expire or invalid. Please login again";
export const invalidTkn = "Your requsted token is invalid. ";
export const invalidDomain = "Your requested domain doesn't match the logged domain. Please check and log in again.";
export const noHaveLoginPermission = "You can't log in to this application because you don't have permission. To gain access, please contact your administrator.";
export const inactiveUserAcct = "Your account is currently inactive. Please contact your system administrator for help.";
export const unauthorizedUser = "You are unauthorized";
export const notPermission = "You don't have the necessary permissions to complete this action.";
export const noDataFound = "No data found";


export const validationError = (feildNm: string) => {
  return `Missing required field: ${feildNm}. Please try again.`;
};


// Validate OTP
export const invalidGAuthOTP = "The GAuth code you entered is invalid. Please provide a valid code and try again.";
export const otpExpire = "The OTP has expired. Please request a new one or log in again to continue.";
export const invalidOTP = "The OTP you entered is invalid. Please provide a valid code and try again.";
export const otpVerifySuccess = "OTP Verified Successfully.";

// Logout
export const logoutSuccess = "Logout successfully";

// refresh token
export const refreshTknSuccess = "Token refreshed successfully";