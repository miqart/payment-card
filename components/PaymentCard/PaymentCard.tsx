"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  getCvvErrorMessage,
  paymentCardSchema,
  paymentCardSchemaWithEffects,
  TPaymentCardSchema,
} from "components/PaymentCard/validation";
import { DatePicker, Input } from "components/reusable";
import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { getEndOfMonth } from "utils";

import CardView from "./CardView";

const PaymentCard = () => {
  const methods = useForm<TPaymentCardSchema>({
    defaultValues: {
      name: "",
      number: "",
      expires: getEndOfMonth(),
      cvv: "",
    },
    mode: "onTouched",
    resolver: zodResolver(paymentCardSchemaWithEffects),
  });
  const {
    handleSubmit,
    setFocus,
    control,
    formState: { isSubmitting },
  } = methods;

  const [focused, setFocused] = useState("");

  const number = useWatch({ control, name: "number" });

  const onSubmit: SubmitHandler<TPaymentCardSchema> = async (data) => {
    await new Promise((resolve) =>
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log(data);
        resolve(data);
      }, 2000)
    );
  };

  return (
    <FormProvider {...methods}>
      <div className="relative w-[600px] text-center">
        <CardView focused={focused} />
        <form
          className="flexCenter flex-col  gap-y-9 rounded bg-white p-12 pt-32 shadow-xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Number"
            name="number"
            onValid={(value) => {
              if (paymentCardSchema.shape.number.safeParse(value).success) {
                setFocus("expires");
              }
            }}
            type="number"
          />
          <div className="flex w-full gap-x-8">
            <DatePicker
              label="Expires"
              name="expires"
              onValid={(value) => {
                if (paymentCardSchema.shape.expires.safeParse(value).success) {
                  setFocus("cvv");
                }
              }}
              width="w-1/2"
            />
            <Input
              label="CVV"
              name="cvv"
              onValid={(cvv) => {
                const cvvErrorMessage = getCvvErrorMessage({ number, cvv });
                if (!cvvErrorMessage) {
                  setFocus("name");
                }
              }}
              setFocused={setFocused}
              type="number"
              width="w-1/2"
            />
          </div>
          <Input label="Name" name="name" />
          <div>
            <button className="w-full" disabled={isSubmitting} type="submit">
              Pay
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};
export default PaymentCard;
