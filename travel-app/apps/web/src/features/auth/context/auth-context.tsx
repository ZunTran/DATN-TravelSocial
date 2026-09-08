"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  setAccessToken as setStoredAccessToken,
  clearAccessToken,
} from "@/services/auth/token-store";

import { useAuth } from "../hooks/use-auth";
import { apolloClient } from "@/services/graphql/client";
import { usePathname } from "next/navigation";

type AuthContextType = {
  accessToken: string | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    email: string,
    password: string,
  ) => Promise<void>;

   register: (
    email: string,
    password: string,
  ) => Promise<void>;

  refreshSession: () => Promise<string>;

  logout: () => Promise<void>;

  logoutAll: () => Promise<void>;
};



const AuthContext =createContext<AuthContextType | undefined>(undefined,);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();

const isAdminRoute =
  pathname.startsWith("/admin");
  
  const {
    login: loginMutation,
    register: registerMutation,

    refreshToken,
    logout: logoutMutation,
    logoutAll: logoutAllMutation,
  } = useAuth();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] =useState(true);
  const hasRestoredSession = useRef(false);
  const refreshPromiseRef =useRef<Promise<string> | null>(null);
  const refreshSession = async () : Promise<string> => {
    if (refreshPromiseRef.current) {
    console.log(
      "[Auth] Refresh already running, waiting...",
    );

    return refreshPromiseRef.current;
  }

  const refreshPromise = (async () => {
    try {
      console.log( "[Auth] Refreshing session..." );
      const result = await refreshToken();
      const newAccessToken =  result.accessToken;

      if (!newAccessToken) {
        throw new Error( "Không nhận được access token" );
      }

      setAccessToken(
        newAccessToken,
      );

      setStoredAccessToken(
        newAccessToken,
      );

      console.log(
        "[Auth] Access token restored",
      );

      return newAccessToken;
    } catch (error) {
      console.error(
        "[Auth] Refresh session failed:",
        error,
      );

      setAccessToken(null);
      clearAccessToken();

      throw error;
    }
    finally {
      refreshPromiseRef.current = null;
    }
  })();

    refreshPromiseRef.current = refreshPromise;
    return refreshPromise;
  };


  useEffect(() => {
    if (isAdminRoute) {
    setIsLoading(false);
    return;
  }
    if (hasRestoredSession.current) {
      return;
    }

    hasRestoredSession.current = true;

    const restoreSession = async () => {
      console.log(
        "[Auth] Starting session restore...",
      );

      try {
        await refreshSession();

        console.log(
          "[Auth] Session restored successfully",
        );
      } catch {
        console.log(
          "[Auth] No valid session",
        );
      } finally {
        setIsLoading(false);

        console.log(
          "[Auth] Auth loading finished",
        );
      }
    };

    restoreSession();
  }, []);


  useEffect(() => {
    if (isAdminRoute) {
    return;
  }
    if (!accessToken) {
      return;
    }

    const scheduleRefresh = () => {
      try {
        const payload = JSON.parse(
          atob(
            accessToken.split(".")[1],
          ),
        );

        const expiresAt =payload.exp * 1000;
        const now =Date.now();
        const refreshBefore =60 * 1000;

        const delay =
          Math.max(
            expiresAt -
              now -
              refreshBefore,
            5000,
          );

        console.log(
          "[Auth] Next refresh in:",
          Math.round(
            delay / 1000,
          ),
          "seconds",
        );

        return window.setTimeout(
          async () => {
            try {
              await refreshSession();
            } catch {
              console.log(
                "[Auth] Auto refresh failed",
              );
            }
          },
          delay,
        );
      } catch (error) {
        console.error(
          "[Auth] Invalid access token:",
          error,
        );

        return undefined;
      }
    };

    const timer =
      scheduleRefresh();

    return () => {
      if (timer) {
        window.clearTimeout(
          timer,
        );
      }
    };
  }, [accessToken,isAdminRoute]);



  const login = async (
    email: string,
    password: string,
  ) => {
    const result =
      await loginMutation(
        email,
        password,
      );

    const newAccessToken =
      result.accessToken;

    if (!newAccessToken) {
      throw new Error(
        "Login không trả về access token",
      );
    }

    setAccessToken(
      newAccessToken,
    );

    setStoredAccessToken(
      newAccessToken,
    );
  };


  const register = async (
  email: string,
  password: string,
) => {
  const result =
    await registerMutation(
      email,
      password,
    );

  const newAccessToken =
    result.accessToken;

  if (!newAccessToken) {
    throw new Error(
      "Register không trả về access token",
    );
  }

  setAccessToken(
    newAccessToken,
  );

  setStoredAccessToken(
    newAccessToken,
  );
};


  const logout = async () => {
    try {
      await logoutMutation();
    } finally {
      setAccessToken(null);
      clearAccessToken();
      await apolloClient.clearStore();
    }
  };


  const logoutAll = async () => {
    try {
      await logoutAllMutation();
    } finally {
      setAccessToken(null);
      clearAccessToken();
      await apolloClient.clearStore();
    }
  };


  return (
    <AuthContext.Provider
  value={{
    accessToken,
    isAuthenticated: !!accessToken,

    isLoading,
    login,
    register,
    refreshSession,
    logout,
    logoutAll,
  }}
>
  {children}
</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used inside AuthProvider",
    );
  }

  return context;
}