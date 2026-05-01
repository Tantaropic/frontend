"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface GlobalLoaderContextProps {
  isLoading: boolean;
  triggerLoading: (callback: () => void) => void;
}

const GlobalLoaderContext = createContext<GlobalLoaderContextProps | undefined>(
  undefined,
);

export function GlobalLoaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  // Initial load transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds for the magical effect
    return () => clearTimeout(timer);
  }, []);

  const triggerLoading = (callback: () => void) => {
    setIsLoading(true);
    // Give it 1.5 seconds to show the rings, then execute callback
    setTimeout(() => {
      callback();
      // Hide the loader a bit after the callback executes (e.g. navigation finishes)
      setTimeout(() => setIsLoading(false), 500);
    }, 1500);
  };

  return (
    <GlobalLoaderContext.Provider value={{ isLoading, triggerLoading }}>
      {children}
    </GlobalLoaderContext.Provider>
  );
}

export function useGlobalLoader() {
  const context = useContext(GlobalLoaderContext);
  if (!context) {
    throw new Error(
      "useGlobalLoader must be used within a GlobalLoaderProvider",
    );
  }
  return context;
}
