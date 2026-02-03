import * as React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({
  className = "",
  variant = "primary",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "ui-button pressable inline-flex w-full" +
    (variant === "ghost" ? " bg-transparent" : "");

  return (
    <button
      {...props}
      className={`${base} ${className}`}
      disabled={disabled}
      aria-disabled={disabled ? "true" : undefined}
    />
  );
}
