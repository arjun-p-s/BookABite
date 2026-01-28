/**
 * Generate a random alphanumeric confirmation code
 * @param length Length of the code (default: 8)
 * @returns Upper-case alphanumeric string
 */
export const generateConfirmationCode = (length: number = 8): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like I, 1, O, 0
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Validates an email address
 * @param email Email string to validate
 */
export const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

/**
 * Validates a phone number
 * @param phone Phone string to validate
 */
export const validatePhone = (phone: string): boolean => {
    // Basic validation: allows +, spaces, dashes, parentheses, and digits. Min 7 chars.
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone) || phone.replace(/\D/g, '').length >= 10;
};
