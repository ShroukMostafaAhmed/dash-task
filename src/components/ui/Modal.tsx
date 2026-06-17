"use client";

import { useEffect, useRef, ReactNode } from "react";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="modal-title"
      className={[
        "w-full rounded-xl shadow-xl p-0 backdrop:bg-black/50",
        "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100",
        sizeClasses[size],
      ].join(" ")}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 id="modal-title" className="text-lg font-semibold">
          {title}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close modal"
          className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-100"
        >
          ✕
        </Button>
      </div>
      <div className="px-6 py-4">{children}</div>
    </dialog>
  );
}
