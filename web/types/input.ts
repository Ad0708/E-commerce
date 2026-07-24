import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from "react";

export interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface BaseProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export interface TextInputProps
  extends BaseProps, Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "search"
    | "tel"
    | "url"
    | "date"
    | "datetime-local"
    | "time"
    | "textarea"
    | "select"
    | "checkbox"
    | "switch"
    | "radio"
    | "file";
}

export interface TextareaProps
  extends
    BaseProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "type"> {}

export interface SelectProps
  extends BaseProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, "type" > {}
