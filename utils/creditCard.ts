export const isValidByLuhn = (cardNo: string): boolean => {
  const nDigits = cardNo.length;

  let nSum = 0;
  let isSecond = false;
  for (let i = nDigits - 1; i >= 0; i--) {
    let d = cardNo[i].charCodeAt(0) - "0".charCodeAt(0);

    if (isSecond) d = d * 2;

    // We add two digits to handle
    // cases that make two digits
    // after doubling
    nSum += Math.floor(d / 10);
    nSum += d % 10;

    isSecond = !isSecond;
  }
  return nSum % 10 == 0;
};

interface IGetCardTypeReturn {
  isVisa: boolean;
  isMaster: boolean;
  isAmex: boolean;
  isUnknown: boolean;
}

export const getCardType = (cardNumber: string): IGetCardTypeReturn => {
  return {
    isVisa: cardNumber.startsWith("4"),
    isMaster: cardNumber.startsWith("5"),
    isAmex: cardNumber.startsWith("3"),
    isUnknown: !["3", "4", "5"].includes(cardNumber[0]),
  };
};
