"use client";

import "react-datepicker/dist/react-datepicker.css";

import clsx from "clsx";
import { default as ReactDatePicker } from "react-datepicker";
import { Controller, FieldPath, FieldValues, useFormContext } from "react-hook-form";
import { getEndOfMonth } from "utils";
interface IDatePickerProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  width?: string;
  onValid?: (value: Date) => void;
}

const DatePicker = <T extends FieldValues>({ label, name, width, onValid }: IDatePickerProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur, ref, ...rest }, fieldState: { error } }) => (
        <label className={`${width || "w-full"} relative text-left text-zinc-500`}>
          {label && <span className="block">{label}</span>}
          <ReactDatePicker
            className={clsx("border h-12 rounded border px-2 text-2xl outline-[1px] w-full", {
              "border-red-500 focus:border-red-500": !!error?.message,
            })}
            {...rest}
            dateFormat="MM/yyyy"
            onBlur={onBlur}
            onChange={(v) => {
              onChange(getEndOfMonth(v));
              onBlur();
              if (onValid) {
                onValid(v as Date);
              }
            }}
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            portalId="root"
            ref={(elem) => {
              // This is workaround as react-datepicker implements a custom ref and handling from rhf is not triggered
              // https://github.com/orgs/react-hook-form/discussions/5413#discussioncomment-805331
              elem && ref((elem as unknown as { input: HTMLInputElement })?.input);
            }}
            selected={value}
            showMonthYearPicker
          />
          {error && <span className="absolute left-0 top-full mt-1 text-xs text-red-500">{error?.message}</span>}
        </label>
      )}
    ></Controller>
  );
};

export default DatePicker;
