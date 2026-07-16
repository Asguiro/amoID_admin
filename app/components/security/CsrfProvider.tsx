import { createContext, useContext } from "react";

const CsrfContext = createContext<string>("");

export function CsrfProvider({
  token,
  children,
}: {
  token: string;
  children: React.ReactNode;
}) {
  return (
    <CsrfContext.Provider value={token}>{children}</CsrfContext.Provider>
  );
}

export function useCsrfToken() {
  return useContext(CsrfContext);
}

export function CsrfField() {
  const token = useCsrfToken();
  if (!token) return null;
  return <input type="hidden" name="_csrf" value={token} />;
}
