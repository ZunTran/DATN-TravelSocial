"use client";

import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "@/services/graphql/client";

import { AuthProvider } from "@/features/auth/context/auth-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProfileInitializer } from "@/features/user/components/profile";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <TooltipProvider>
           <ProfileInitializer />
          {children}
        </TooltipProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}