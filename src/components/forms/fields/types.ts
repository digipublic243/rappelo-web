"use client";

export type FormFieldOption = {
  label: string;
  value: string | number;
};

export type CommonFieldProps = {
  name: string;
  label?: string;
  helperText?: string;
  className?: string;
  inputClassName?: string;
  required?: boolean;
  disabled?: boolean;
};

export type InputLikeFieldProps = CommonFieldProps & {
  defaultValue?: string | number;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  maxLength?: number;
  step?: number | string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

export type TextareaFieldProps = CommonFieldProps & {
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
};

export type SelectFieldProps = CommonFieldProps & {
  options: FormFieldOption[];
  defaultValue?: string | number;
};

export type HiddenFieldProps = {
  type: "hidden";
  name: string;
  value: string | number;
};

export type PhoneFieldProps = CommonFieldProps & {
  type: "phone";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  prefix?: string;
};

export type CheckboxFieldProps = CommonFieldProps & {
  type: "checkbox";
  value?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export type RadioGroupFieldProps = CommonFieldProps & {
  type: "radio-group";
  value?: string;
  options: Array<{
    label: string;
    value: string;
    description?: string;
  }>;
  onChange?: (value: string) => void;
  optionClassName?: string;
  activeOptionClassName?: string;
  inactiveOptionClassName?: string;
};

export type BasicInputFieldProps = InputLikeFieldProps & {
  type?: "text" | "password" | "number" | "date" | "email" | "file";
};

export type FormFieldProps =
  | BasicInputFieldProps
  | (TextareaFieldProps & { type: "textarea" })
  | (SelectFieldProps & { type: "select" })
  | PhoneFieldProps
  | CheckboxFieldProps
  | RadioGroupFieldProps
  | HiddenFieldProps;
