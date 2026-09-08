"use client";

import { ApolloClient, InMemoryCache, from} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";
import { getAdminAccessToken } from "../auth/admin-token-store";


const uploadHttpLink =
  new UploadHttpLink({
    uri:
      process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000/graphql",

    credentials: "include",
    headers: { "apollo-require-preflight": "true"},
  });

const adminAuthLink =
  setContext((_, { headers }) => {
    const token =
      getAdminAccessToken();

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

export const adminApolloClient =
  new ApolloClient({
    link: from([
      adminAuthLink,
      uploadHttpLink,
    ]),

    cache: new InMemoryCache(),
  });