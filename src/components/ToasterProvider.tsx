"use client";

import { ToastContainer } from "react-toastify";

export default function ToasterProvider() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      newestOnTop
      closeOnClick
      theme="colored"
    />
  );
}