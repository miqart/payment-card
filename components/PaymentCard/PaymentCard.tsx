"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  getCvvErrorMessage,
  paymentCardSchema,
  paymentCardSchemaWithEffects,
  TPaymentCardSchema,
} from "components/PaymentCard/validation";
import { DatePicker, Input } from "components/reusable";
import React, { FocusEvent, useState } from "react";
import { FormProvider } from "react-hook-form";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { getEndOfMonth } from "utils";

import CardView from "./CardView";

const PaymentCard = () => {
  const methods = useForm<TPaymentCardSchema>({
    defaultValues: {
      name: "",
      cardnumber: "",
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

  const [rotated, setRotated] = useState<boolean>(false);

  const cardnumber = useWatch({ control, name: "cardnumber" });

  const onSubmit: SubmitHandler<TPaymentCardSchema> = async (data) => {
    await new Promise((resolve) =>
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log(data);
        resolve(data);
      }, 2000)
    );
  };

  const onFocusCvv = () => {
    setRotated(true);
  };

  const onBlurCvv = (e: FocusEvent<HTMLInputElement>) => {
    if (e.relatedTarget?.id === "card") return;

    setRotated(false);
  };

  return (
    <FormProvider {...methods}>
      <div className="relative w-[600px] text-center">
        <CardView rotated={rotated} setRotated={setRotated} />
        <form
          className="flexCenter flex-col  gap-y-9 rounded bg-white p-12 pt-32 shadow-xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Number"
            name="cardnumber"
            onValid={(value) => {
              if (paymentCardSchema.shape.cardnumber.safeParse(value).success) {
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
              onBlur={onBlurCvv}
              onFocus={onFocusCvv}
              onValid={(cvv) => {
                const cvvErrorMessage = getCvvErrorMessage({ cardnumber, cvv });
                if (!cvvErrorMessage) {
                  setFocus("name");
                }
              }}
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
