'use client';
import { useMutation } from '@apollo/client/react';
import { CHANGE_PASSWORD_MUTATION } from '../api/auth.queries';

interface ChangePasswordResponse {
  changePassword: boolean;
}

interface ChangePasswordVariables {
  input: {
    oldPassword: string;
    newPassword: string;
  };
}

export function useChangePassword() {
  const [changePasswordMutation, { loading, error }] = useMutation<
    ChangePasswordResponse,
    ChangePasswordVariables
  >(CHANGE_PASSWORD_MUTATION);

  const changePassword = async (
    oldPassword: string,
    newPassword: string,
  ) => {
    const result = await changePasswordMutation({
      variables: {
        input: {
          oldPassword,
          newPassword,
        },
      },
    });

    return result.data?.changePassword ?? false;
  };

  return {
    changePassword,
    loading,
    error,
  };
}

