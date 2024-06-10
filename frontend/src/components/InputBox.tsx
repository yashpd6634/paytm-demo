import React from "react";

export interface InputBoxProps {
  label: string;
  placeholder: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const InputBox = ({ label, placeholder, onChange }: InputBoxProps) => {
  return (
    <>
      <div className="text-sm font-medium text-left py-2">{label}</div>
      <input
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border rounded border-slate-200 px-2 py-1"
      />
    </>
  );
};
