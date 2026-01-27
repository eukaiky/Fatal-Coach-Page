import React from 'react';

export const FormInput = ({ id, label, type = 'text', required = false, ...props }) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="mb-2 text-sm font-semibold text-white">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      required={required}
      className="rounded-md border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600"
      {...props}
    />
  </div>
);

export default FormInput;