import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

export const StatusCheck = () => {
  const { data: session, status, update } = useSession();

  useEffect(() => {
    const interval = setInterval(() => update(), 1000 * 60 * 10);
    if ((session as any)?.error === "inactive-user") {
      signOut();
    }
    // const interval = setInterval(() => update(), 1000 * 60 * 60)
    return () => clearInterval(interval);
  }, [update]);

  useEffect(() => {
    const visibilityHandler = () => {
      document.visibilityState === "visible" && update(session);
      if ((session as any)?.error === "inactive-user") {
        signOut();
      }
    };

    window.addEventListener("visibilitychange", visibilityHandler, false);
    return () =>
      window.removeEventListener("visibilitychange", visibilityHandler, false);
  }, [update]);

  return null;
};
