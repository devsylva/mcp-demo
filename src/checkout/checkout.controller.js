import { validatePaymentPayload } from './validatePayment.js';

export async function handleCheckout(req, res) {
  const validation = validatePaymentPayload(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      errors: validation.errors,
    });
  }

  try {
    // Proceed to payment gateway
    const result = await processPayment(req.body);
    return res.status(200).json({ success: true, transactionId: result.id });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Payment processing failed.' });
  }
}
