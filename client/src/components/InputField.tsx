import React from "react";

type Props = {
  label: string;
  type: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

const InputField: React.FC<Props> = ({
  label,
  type,
  value,
  name,
  onChange,
  required,
}) => (
  <div className="input-field">
    <label>{label}</label>
    <input
      type={type}
      value={value}
      name={name}
      onChange={onChange}
      required={required}
      placeholder={label}
    />
  </div>
);

export default InputField;
