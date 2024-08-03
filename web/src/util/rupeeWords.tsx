import { ToWords } from 'to-words';

const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
  }
});

const RupeeInWords = ({ amount }) => {
  const words = toWords.convert(amount, { currency: true });

  return <span>{words}</span>;
};

export default RupeeInWords;