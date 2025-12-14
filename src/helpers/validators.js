
/**
 * Uses a regex to validate a text
 * @param {string} text
 * @param {string} regex
 * @param {int} minLength
 * @param {int} maxLength
 * @returns {boolean}
 */
export function validateText(text, regex = null, minLength = 3, maxLength = 50) {
  if (text.length < minLength || text.length > maxLength) {
    return false;
  }
  if (!regex) {
    regex = new RegExp(`^(?=.*[\\p{L}\\p{N}])[\\p{L}\\p{N}\\s''"\\-.,!?]{${minLength},${maxLength}}$`, 'u');
  }
  const regexValidator = RegExp(regex);
  return regexValidator.test(text);
}


/**
 * Uses a regex to validate a number
 * @param {number} number
 * @param {string} regex
 * @returns {boolean}
 */
export function validateNumber(number, regex = null) {
  if (!regex) regex = /^[0-9.]+$/u;
  const regexValidator = RegExp(regex);
  return regexValidator.exec(number) ? true : false;
}


/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


/**
 * Validate password strength
 * @param {string} password
 * @param {number} minLength
 * @returns {boolean}
 */
export function validatePassword(password, minLength = 8) {
  return password && password.length >= minLength;
}

