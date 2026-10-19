import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// Bọc Component bằng React.forwardRef để React Hook Form nhận ref
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref} // Truyền ref vào thẻ input HTML chuẩn
        className={`flex h-10 w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';