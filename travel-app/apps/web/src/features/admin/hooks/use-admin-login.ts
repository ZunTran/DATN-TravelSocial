"use client";

import { useMutation } from "@apollo/client/react";

import {
  LOGIN_MUTATION,
} from "@/features/auth/api/auth.queries";

import {
  setAdminAccessToken,
} from "@/services/auth/admin-token-store";

import {
  decodeJwt,
} from "@/features/auth/utils/jwt";

import type {
  LoginInput,
} from "@/features/auth/types";

interface LoginMutationData {
  login: {
    accessToken: string;
  };
}

export function useAdminLogin() {
  const [
    loginMutation,
    { loading },
  ] = useMutation<
    LoginMutationData,
    { input: LoginInput }
  >(LOGIN_MUTATION);

  const login = async (
    email: string,
    password: string,
  ) => {
    const { data } =
      await loginMutation({
        variables: {
          input: {
            email,
            password,
          },
        },
      });

    const token =
      data?.login?.accessToken;

    if (!token) {
      throw new Error(
        "Không nhận được access token",
      );
    }

    const payload =
      decodeJwt(token);

    if (!payload) {
      throw new Error(
        "Access token không hợp lệ",
      );
    }

    if (payload.role !== "ADMIN") {
      throw new Error(
        "Tài khoản này không có quyền ADMIN",
      );
    }

    setAdminAccessToken(token);

    return token;
  };

  return {
    login,
    loading,
  };
}