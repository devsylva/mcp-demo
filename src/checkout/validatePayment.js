/**
 * Server-side payment validation before processing checkout.
 */

const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP'];
const MAX_AMOUNT = 100000; // $1,000.00 in cents

export function validatePaymentPayload(payload) {
  const errors = [];

  if (!payload.cardNumber || !/^\d{16}$/.test(payload.cardNumber)) {
    errors.push('Invalid card number. Must be 16 digits.');
  }

  if (!payload.expiryMonth || !payload.expiryYear) {
    errors.push('Expiry date is required.');
  } else {
    const now = new Date();
    const expiry = new Date(payload.expiryYear, payload.expiryMonth - 1);
    if (expiry < now) {
      errors.push('Card has expired.');
    }
  }

  if (!payload.cvv || !/^\d{3,4}$/.test(payload.cvv)) {
    errors.push('Invalid CVV.');
  }

  if (!payload.amount || payload.amount <= 0 || payload.amount > MAX_AMOUNT) {
    errors.push(`Amount must be between 1 and ${MAX_AMOUNT} cents.`);
  }

  if (!SUPPORTED_CURRENCIES.includes(payload.currency)) {
    errors.push(`Unsupported currency. Must be one of: ${SUPPORTED_CURRENCIES.join(', ')}.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
