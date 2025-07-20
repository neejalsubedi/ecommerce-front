/* eslint-disable @typescript-eslint/no-explicit-any */
import { format, parse } from "date-fns";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import type { MultiValue, SingleValue } from "react-select";

const fixedInputClass =
  "rounded-[20px] appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm";

const selectFixedInputClass =  "rounded-[20px] appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm";

type Option = {
  value: string;
  label: string;
};

type FormInputValues = {
  register?: any;
  error?: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange?: (value: string[] | string) => void;
  value?: string | string[] | FileList;
  labelText: string;
  labelFor: string;
  id: string;
  name: string;
  type: string;
  isRequired?: boolean;
  placeholder?: string;
  customClass?: string;
  options?: Option[];
  multiple?: boolean;
  columns?: number;
  disabled?: boolean;
};

export default function FormInput({
  register,
  error,
  handleChange,
  handleSelectChange,
  value,
  labelText,
  labelFor,
  id,
  name,
  type,
  isRequired = false,
  placeholder,
  customClass = "",
  options = [],
  multiple = false,
  columns,
  disabled = false,
}: FormInputValues) {
  const [open, setOpen] = useState(false);

  const handlePassword = () => setOpen(!open);

  const handleSelect = (
    selectedOptions: MultiValue<Option> | SingleValue<Option>
  ) => {
    if (!handleSelectChange) return;

    if (multiple) {
      const selectedValues = (selectedOptions as MultiValue<Option>).map(
        (option) => option.value
      );
      handleSelectChange(selectedValues);
    } else {
      handleSelectChange((selectedOptions as SingleValue<Option>)?.value || "");
    }
  };

  const baseInputClass = `${fixedInputClass} ${error ? "border-red-500" : ""}`;
  const maxDateForInputs =
    type === "date" && id === "dob"
      ? new Date(new Date().setFullYear(new Date().getFullYear() - 18))
      : undefined;

  return (
    <div className={`my-5 ${columns ? `col-span-${columns}` : ""}`}>
      <label htmlFor={labelFor} className="block mb-1 font-medium text-sm">
        {labelText}
        {isRequired && <span className="text-red-700 ml-1">*</span>}
      </label>

      {/* Password */}
      {type === "password" ? (
        <div className="relative">
          <input
            id={id}
            name={name}
            type={open ? "text" : "password"}
            placeholder={placeholder || ""}
            disabled={disabled}
            required={isRequired}
            {...(register ? register(name) : {})}
            onChange={handleChange}
            className={`${baseInputClass} ${customClass}`}
          />
          <span className="absolute top-2.5 right-4 z-10 cursor-pointer">
            {open ? <Eye onClick={handlePassword} /> : <EyeClosed onClick={handlePassword} />}
          </span>
        </div>
      ) : type === "select" ? (
        <Select
          id={id}
          name={name}
          isMulti={multiple}
          isDisabled={disabled}
          required={isRequired}
          options={options}
          onChange={handleSelect}
          value={
            multiple
              ? options.filter((opt) => (value as string[])?.includes(opt.value))
              : options.find((opt) => opt.value === value)
          }
          classNamePrefix="custom-select"
          className={`${customClass} ${selectFixedInputClass}`}
        />
      ) : type === "date" ? (
        <DatePicker
          selected={
            value && typeof value === "string"
              ? parse(value, "yyyy-MM-dd", new Date())
              : null
          }
          onChange={(date) => {
            const formatted = date ? format(date, "yyyy-MM-dd") : "";
            handleChange?.({
              target: { name, value: formatted },
            } as React.ChangeEvent<HTMLInputElement>);
          }}
          dateFormat="yyyy-MM-dd"
          maxDate={maxDateForInputs}
          className={`${baseInputClass} ${customClass}`}
          placeholderText={placeholder || " "}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          disabled={disabled}
        />
      ) : type === "file" ? (
        <input
          id={id}
          name={name}
          type="file"
          disabled={disabled}
          required={isRequired}
          {...(register ? register(name) : {})}
          onChange={handleChange}
          className={`${baseInputClass} ${customClass}`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value as string}
          placeholder={placeholder || ""}
          disabled={disabled}
          required={isRequired}
          {...(register ? register(name) : {})}
          onChange={handleChange}
          className={`${baseInputClass} ${customClass}`}
        />
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
