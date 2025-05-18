export function splitPhoneNumber(input) {
  const cleaned = input.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return {
      countryCode: '',
      phoneNumber: cleaned
    };
  }

  if (cleaned.length > 10) {
    const phoneNumber = cleaned.slice(-10);
    const countryCode = '+' + cleaned.slice(0, cleaned.length - 10);
    return {
      countryCode,
      phoneNumber
    };
  }
  throw new Error(`${input}-Invalid phone number format`);
  return {
    countryCode: 'Invalid',
    phoneNumber: 'Invalid'
  };
}

