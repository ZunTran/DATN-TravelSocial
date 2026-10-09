'use client';

import { useMutation } from '@apollo/client/react';
import { UPDATE_USER_REPORT_STATUS } from '../api/user-report.mutations';
import type { UpdateUserReportStatusResponse, UpdateReportStatusInput } from '../types/user-report.types';

interface UpdateUserReportStatusVariables {
  reportId: string;
  input: UpdateReportStatusInput;
}

export function useUpdateUserReportStatus() {
  const [updateMutation, result] = useMutation<
    UpdateUserReportStatusResponse,
    UpdateUserReportStatusVariables
  >(UPDATE_USER_REPORT_STATUS);

  const updateUserReportStatus = async (
    reportId: string,
    status: UpdateReportStatusInput['status'],
  ) => {
    const response = await updateMutation({
      variables: {
        reportId,
        input: {
          status,
        },
      },
    });

    return (
      response.data?.updateUserReportStatus ?? null
    );
  };

  return {
    updateUserReportStatus,

    loading: result.loading,
    error: result.error,
    data: result.data,
    called: result.called,
    reset: result.reset,
  };
}