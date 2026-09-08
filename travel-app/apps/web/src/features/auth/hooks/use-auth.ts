"use client";

import { useMutation } from "@apollo/client/react";

import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  LOGOUT_MUTATION,
  LOGOUT_ALL_MUTATION,
  REFRESH_TOKEN_MUTATION,
} from "../api/auth.queries";

import type {
  LoginInput,
  RegisterInput,
} from "../types";

interface LoginMutationData {
  login: {
    accessToken: string;
  };
}

interface RegisterMutationData {
  register: {
    accessToken: string;
  };
}

interface LogoutMutationData {
  logout: boolean;
}

interface LogoutAllMutationData {
  logoutAll: boolean;
}

interface RefreshTokenMutationData {
  refreshToken: { accessToken: string;};
}

export function useAuth() {
  const [
    loginMutation,
    loginState,
  ] = useMutation<
    LoginMutationData,
    { input: LoginInput }
  >(LOGIN_MUTATION);

  const [
    registerMutation,
    registerState,
  ] = useMutation<
    RegisterMutationData,
    { input: RegisterInput }
  >(REGISTER_MUTATION);

  const [
    logoutMutation,
    logoutState,
  ] = useMutation<LogoutMutationData>(
    LOGOUT_MUTATION,
  );

  const [
    logoutAllMutation,
    logoutAllState,
  ] = useMutation<LogoutAllMutationData>(
    LOGOUT_ALL_MUTATION,
  );

  const [
    refreshTokenMutation,
    refreshState,
  ] = useMutation<RefreshTokenMutationData>(
    REFRESH_TOKEN_MUTATION,
  );

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

    if (!data?.login) {
      throw new Error(
        "Đăng nhập thất bại",
      );
    }

    return data.login;
  };


  const register = async (
    email: string,
    password: string,
  ) => {
    const { data } =
      await registerMutation({
        variables: {
          input: {
            email,
            password,
          },
        },
      });

    if (!data?.register?.accessToken) {
      throw new Error( "Đăng ký thất bại");
    }

    return data.register;
  };


  const refreshToken = async () => {
    const { data } =
      await refreshTokenMutation();

    if (!data?.refreshToken) {
      throw new Error(
        "Session hết hạn",
      );
    }

    return data.refreshToken;
  };

  const logout = async () => {
    await logoutMutation();
  };


  const logoutAll = async () => {
    await logoutAllMutation();
  };

  return {
    login,
    register,
    refreshToken,
    logout,
    logoutAll,

    loginLoading:
      loginState.loading,

    registerLoading:
      registerState.loading,

    refreshLoading:
      refreshState.loading,

    logoutLoading:
      logoutState.loading,

    logoutAllLoading:
      logoutAllState.loading,

    loginError:
      loginState.error,

    registerError:
      registerState.error,

    refreshError:
      refreshState.error,
  };
}