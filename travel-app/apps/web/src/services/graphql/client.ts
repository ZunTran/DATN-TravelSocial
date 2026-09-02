"use client";

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";

import {
  getAccessToken,
} from "@/services/auth/token-store";

const httpLink =
  new HttpLink({
    uri:
      process.env.NEXT_PUBLIC_GRAPHQL_URL ||
      "http://localhost:4000/graphql",

    credentials: "include",
  });

const authLink =
  setContext((_, { headers }) => {
    const token =
      getAccessToken();

    return {
      headers: {
        ...headers,

        ...(token
          ? {
              Authorization:
                `Bearer ${token}`,
            }
          : {}),
      },
    };
  });

export const apolloClient =
  new ApolloClient({
    link: from([
      authLink,
      httpLink,
    ]),

    cache:
      new InMemoryCache(),
  });