"use client";

import clsx from "clsx";
import { FocusEvent, HTMLInputTypeAttribute } from "react";
import { Controller, FieldPath, FieldValues, useFormContext } from "react-hook-form";

interface IInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  fullWidth?: boolean;
  width?: string;
  type?: HTMLInputTypeAttribute;
  onValid?: (value: string) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
}

const Input = <T extends FieldValues>({
  name,
  label,
  width,
  type = "text",
  onValid,
  onFocus,
  onBlur: onHandleBlur,
}: IInputProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value, ...rest }, fieldState: { error } }) => (
        <label className={`${width || "w-full"} relative text-left text-zinc-500`}>
          {label && <span className="block">{label}</span>}
          <input
            className={clsx("h-12 w-full rounded border px-2 text-2xl outline-[1px]", {
              "border-red-500 focus:border-red-500": !!error?.message,
            })}
            onFocus={(e) => {
              onFocus?.(e);
            }}
            type={type}
            value={value}
            {...rest}
            onBlur={(e) => {
              onBlur();
              onHandleBlur?.(e);
            }}
            onChange={(e) => {
              onChange(e);
              if (onValid) {
                onValid(e.target.value);
              }
            }}
          />
          {error && <span className="absolute left-0 top-full mt-1 text-xs text-red-500">{error?.message}</span>}
        </label>
      )}
    ></Controller>
  );
};
export default Input;
