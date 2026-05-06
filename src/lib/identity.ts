const KEY = "sukuk:identity";

export interface Identity {
  profileId: string;
  userId: string;
}

export function getIdentity(): Identity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Identity) : null;
  } catch {
    return null;
  }
}

export function setIdentity(identity: Identity): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(identity));
}

export function clearIdentity(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
