import React from "react";
import clsx from "clsx"; // optional for combining class names easily

export const Button = ({ 
  children, 
  variant = "default", 
  size = "md", 
  className = "", 
  ...props 
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium focus:outline-none transition-colors";

  const variantStyles = {
    default: "bg-green-600 text-white hover:bg-green-700",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    outline: "border border-gray-300 hover:bg-gray-100 text-gray-700",
  };

  const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
    icon: "p-2", // for icon-only buttons
  };

  const classes = clsx(baseStyles, variantStyles[variant], sizeStyles[size], className);

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
