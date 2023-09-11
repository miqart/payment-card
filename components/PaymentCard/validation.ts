import { getCardType, isValidByLuhn } from "utils";
import { z } from "zod";

export const paymentCardSchema = z.object({
  name: z
    .string()
    .min(1, "Card holder name can not be empty!")
    .max(25, "Card holder name must be maximum 25 digits long!"),
  cardnumber: z
    .string()
    .min(16, "Card number must be at least 16 digits long!")
    .max(19, "Card number must be maximum 19 digits long!")
    .refine(isValidByLuhn, "Invalid card number"),
  expires: z.date().min(new Date(), "Past date is not allowed!"),
  cvv: z.string().regex(/^\d+$/),
});

export const paymentCardSchemaWithEffects = paymentCardSchema.superRefine((data, ctx) => {
  const cvvErrorMessage = getCvvErrorMessage(data);

  if (cvvErrorMessage) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: cvvErrorMessage,
      path: ["cvv"],
    });
  }
});

export type TPaymentCardSchema = z.infer<typeof paymentCardSchemaWithEffects>;

// getCvvErrorMessage
const cardNumberAndCvv = paymentCardSchema.pick({ cardnumber: true, cvv: true });
type CardNumberAndCvv = z.infer<typeof cardNumberAndCvv>;

export const getCvvErrorMessage = ({ cardnumber, cvv }: CardNumberAndCvv): string | null => {
  const { isVisa, isMaster, isAmex } = getCardType(cardnumber);

  if ((isVisa || isMaster) && cvv.length !== 3) {
    return "Visa/Master card should have 3 digits long CVV!";
  } else if (isAmex && cvv.length !== 4) {
    return "Amex card should have 4 digits long CVV!";
  } else if (cvv.length < 3 || cvv.length > 4) {
    return "CVV length should be 3 or 4 digits long!";
  }

  return null;
};
