'use client';

import {
  ApolloClient,
  InMemoryCache,
  Observable,
  from,
} from '@apollo/client';

import {
  setContext,
} from '@apollo/client/link/context';

import {
  onError,
} from '@apollo/client/link/error';

import {
  CombinedGraphQLErrors,
} from '@apollo/client/errors';

import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs';

import {
  getAdminAccessToken,
  setAdminAccessToken,
  removeAdminAccessToken,
} from '../auth/admin-token-store';


const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ||
  'http://localhost:4000/graphql';


let isRefreshing = false;

let refreshSubscribers: Array<
  (token: string | null) => void
> = [];


function subscribeTokenRefresh(
  callback: (token: string | null) => void,
) {
  refreshSubscribers.push(callback);
}


function onRefreshed(
  token: string | null,
) {
  refreshSubscribers.forEach(
    (callback) => callback(token),
  );

  refreshSubscribers = [];
}


async function refreshAdminAccessToken(): Promise<
  string | null
> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh(resolve);
    });
  }

  isRefreshing = true;

  console.log(
    '[ADMIN AUTH] 🔄 START REFRESH',
  );

  try {
    const response = await fetch(
      GRAPHQL_URL,
      {
        method: 'POST',
        credentials: 'include',

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          query: `
            mutation RefreshToken {
              refreshToken {
                accessToken
              }
            }
          `,
        }),
      },
    );

    const result =
      await response.json();

    console.log(
      '[ADMIN AUTH] REFRESH RESPONSE:',
      result,
    );

    if (
      result.errors?.length ||
      !result.data?.refreshToken?.accessToken
    ) {
      throw new Error(
        result.errors?.[0]?.message ||
        'Refresh token failed',
      );
    }

    const newAccessToken =
      result.data.refreshToken.accessToken;

    setAdminAccessToken(
      newAccessToken,
    );

    console.log(
      '[ADMIN AUTH] ✅ REFRESH SUCCESS',
    );

    onRefreshed(
      newAccessToken,
    );

    return newAccessToken;

  } catch (error) {
    console.error(
      '[ADMIN AUTH] ❌ REFRESH FAILED',
      error,
    );

    removeAdminAccessToken();

    onRefreshed(null);

    return null;

  } finally {
    isRefreshing = false;
  }
}


const adminAuthLink =
  setContext((_, { headers }) => {
    const token =
      getAdminAccessToken();

    console.log(
      '[ADMIN AUTH LINK]',
      token
        ? '✅ TOKEN EXISTS'
        : '❌ NO TOKEN',
    );

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


const adminErrorLink =
  onError(
    ({
      error,
      operation,
      forward,
    }) => {

      let isUnauthorized = false;

      if (
        CombinedGraphQLErrors.is(error)
      ) {
        isUnauthorized =
          error.errors.some(
            (graphQLError) =>
              graphQLError.message
                ?.toLowerCase()
                .includes('unauthorized'),
          );
      } else {
        isUnauthorized =
          error.message
            ?.toLowerCase()
            .includes('unauthorized');
      }

      if (!isUnauthorized) {
        return;
      }

      if (
        operation.operationName ===
        'RefreshToken'
      ) {
        return;
      }

      console.log(
        '[ADMIN AUTH] ⚠️ ACCESS TOKEN EXPIRED',
      );

      return new Observable(
        (observer) => {

          refreshAdminAccessToken()
            .then((newToken) => {

              if (!newToken) {
                observer.error(
                  new Error(
                    'Admin session expired',
                  ),
                );

                return;
              }

              console.log(
                '[ADMIN AUTH] 🔁 RETRY ORIGINAL REQUEST',
              );

              operation.setContext(
                ({
                  headers = {},
                }) => ({
                  headers: {
                    ...headers,

                    Authorization:
                      `Bearer ${newToken}`,
                  },
                }),
              );

              const subscription =
                forward(operation)
                  .subscribe({
                    next: (value) => {
                      observer.next(value);
                    },

                    error: (error) => {
                      observer.error(error);
                    },

                    complete: () => {
                      observer.complete();
                    },
                  });

              return () => {
                subscription.unsubscribe();
              };
            })
            .catch((error) => {
              observer.error(error);
            });
        },
      );
    },
  );


const uploadHttpLink =
  new UploadHttpLink({
    uri: GRAPHQL_URL,

    credentials: 'include',

    headers: {
      'apollo-require-preflight':
        'true',
    },
  });


export const adminApolloClient =
  new ApolloClient({
    link: from([
      adminErrorLink,
      adminAuthLink,
      uploadHttpLink,
    ]),

    cache:
      new InMemoryCache(),
  });