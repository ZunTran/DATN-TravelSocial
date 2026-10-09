'use client';

import { useMutation } from '@apollo/client/react';
import { REPORT_USER } from '../api/user-report.mutations';
import type { ReportUserResponse, UserReportInput } from '../types/user-report.types';

export function useReportUser() {
  const [reportUserMutation, result] = useMutation<
    ReportUserResponse,
    {
      input: UserReportInput;
    }
  >(REPORT_USER);

  const reportUser = async (
    input: UserReportInput,
  ) => {
    const response = await reportUserMutation({
      variables: {
        input,
      },
      fetchPolicy: 'no-cache',
    });

    if (response.error) {
      throw response.error;
    }

    if (!response.data?.reportUser) 
      throw new Error('Không thể gửi báo cáo.');

    return response.data.reportUser;
  };

  return {
    reportUser,

    loading: result.loading,
    error: result.error,
    data: result.data,
    called: result.called,
    reset: result.reset,
  };
}

