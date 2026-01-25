/**
 * Development entry point
 * This file is used for local development with vite dev server
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LubForm } from "./core/LubForm";
import "./styles/index.css";

// Mock API response for development
const MOCK_FORM_ID = "demo-123";
const MOCK_BASE_URL = "http://localhost:8080"; // Your local API server

function App() {
  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <h1 style={{ marginBottom: 24 }}>Lub Forms Development</h1>
      <LubForm
        formId={MOCK_FORM_ID}
        baseUrl={MOCK_BASE_URL}
        onSuccess={(data) => {
          console.log("Form submitted successfully:", data);
        }}
        onError={(error) => {
          console.error("Form error:", error);
        }}
        onStepChange={(step, total) => {
          console.log(`Step ${step + 1} of ${total}`);
        }}
      />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
