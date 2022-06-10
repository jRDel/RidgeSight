import React from "react";
import Button from "react-bootstrap/Button";
import { BsArrowRepeat } from "react-icons/bs";
import "./LoaderButton.css";

export default function LoaderButton({
  isLoading,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <div className="d-flex justify-content-center">
    <Button
      disabled={disabled || isLoading}
      className={`LoaderButton ${className}`}
      {...props}
      variant="dark"
    >
      {isLoading && <BsArrowRepeat className="spinning" />}
      {props.children}
    </Button>
    </div>
  );
}