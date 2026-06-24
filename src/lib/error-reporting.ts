type ErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type ErrorEvents = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: ErrorOptions,
  ) => void;
};

declare global {
  interface Window {
    __appEvents?: ErrorEvents;
  }
}

export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  
  // Log to console as fallback
  console.error("Error reported:", error, context);
  
  // If there's a custom error handler configured, use it
  window.__appEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    },
  );
}
