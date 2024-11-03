/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useRouter();
  const path = usePathname();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("access-token");
  }, []);

  return <div>{children}</div>;
};

export default AuthProvider;
