"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getIdentity,
  setIdentity as persist,
  clearIdentity as wipe,
  type Identity,
} from "@/lib/identity";
import { api } from "@/lib/api/sdk";
import { ApiError } from "@/lib/api/types";

interface IdentityContextValue {
  identity: Identity | null;
  setIdentity: (i: Identity) => void;
  clearIdentity: () => void;
  ready: boolean;
  bootstrapping: boolean;
  bootstrapError: string | null;
}

const IdentityContext = createContext<IdentityContextValue | undefined>(
  undefined,
);

export function IdentityProvider({ children }: { children: React.ReactNode }) {
  const [identity, setLocal] = useState<Identity | null>(null);
  const [ready, setReady] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(false);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);

  const setIdentity = useCallback((i: Identity) => {
    persist(i);
    setLocal(i);
  }, []);

  const clearIdentity = useCallback(() => {
    wipe();
    setLocal(null);
  }, []);

  // On first mount: read existing identity, or auto-bootstrap a random profile.
  // The signup UI isn't wired yet, so we provision a demo tenant on demand.
  useEffect(() => {
    const existing = getIdentity();
    if (existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocal(existing);
      setReady(true);
      return;
    }

    let cancelled = false;
    setBootstrapping(true);
    api.profiles
      .createRandom({})
      .then((res) => {
        if (cancelled) return;
        const userId = res.user?.id;
        const profileId = res.profile?.id;
        if (!userId || !profileId) {
          setBootstrapError("Backend returned no user");
          return;
        }
        const next: Identity = { profileId, userId };
        persist(next);
        setLocal(next);
      })
      .catch((err) => {
        if (cancelled) return;
        setBootstrapError(
          err instanceof ApiError ? err.message : "تعذّر تهيئة الحساب",
        );
      })
      .finally(() => {
        if (cancelled) return;
        setBootstrapping(false);
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <IdentityContext.Provider
      value={{
        identity,
        setIdentity,
        clearIdentity,
        ready,
        bootstrapping,
        bootstrapError,
      }}
    >
      {children}
    </IdentityContext.Provider>
  );
}

export function useIdentity() {
  const ctx = useContext(IdentityContext);
  if (!ctx)
    throw new Error("useIdentity must be used inside <IdentityProvider>");
  return ctx;
}
