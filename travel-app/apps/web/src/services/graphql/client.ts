"use client";

import {
  ApolloClient,
  InMemoryCache,
  from,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";

import {
  getAccessToken,
} from "@/services/auth/token-store";

const uploadHttpLink =
  new UploadHttpLink({
    uri:
      process.env.NEXT_PUBLIC_GRAPHQL_URL ||
      "http://localhost:4000/graphql",

    credentials: "include",
    headers: {
      "apollo-require-preflight": "true",
    },
  });

const authLink =
  setContext((_, { headers }) => {
    const token = getAccessToken();

    return {
      headers: {
        ...headers,

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    };
  });

const cache =
  new InMemoryCache();

export const apolloClient =
  new ApolloClient({
    link: from([
      authLink,
      uploadHttpLink,
    ]),

    cache,
  });