"use client";

import { ApolloProvider } from "@apollo/client/react";

import {
  adminApolloClient,
} from "@/services/graphql/admin-client";

export function AdminApolloProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApolloProvider
      client={adminApolloClient}
    >
      {children}
    </ApolloProvider>
  );
}