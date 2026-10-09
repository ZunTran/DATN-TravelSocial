
'use client';

import { useState } from 'react';

import {
  TravelPlanForm,
} from '@/features/ai-travel/components/travel-plan-form';

import {
  TravelPlanResult,
} from '@/features/ai-travel/components/travel-plan-result';

import {
  useCreateTravelPlan,
} from '@/features/ai-travel/hooks/use-travel-plan';

import type {
  TravelPlan,
} from '@/features/ai-travel/types/travel-plan.types';

export default function TravelAiPage() {
  const {
    createTravelPlan,
    loading,
    error,
  } = useCreateTravelPlan();

  const [plan, setPlan] =
    useState<TravelPlan | null>(
      null,
    );

  const handleSubmit = async (
    input: Parameters<
      typeof createTravelPlan
    >[0],
  ) => {
    try {
      const result =
        await createTravelPlan(
          input,
        );

      setPlan(result);
    } catch {
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">
          AI Travel Planner
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Tạo lịch trình du lịch
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Nhập các thông tin về chuyến đi,
          sở thích, ngân sách và yêu cầu riêng.
          Hệ thống sẽ tìm kiếm địa điểm phù hợp
          rồi tạo lịch trình bằng AI.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
        <section>
          <TravelPlanForm
            onSubmit={handleSubmit}
            loading={loading}
          />
        </section>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          {loading && (
            <div className="rounded-2xl border bg-card p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 w-2/3 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-5/6 rounded bg-muted" />
                <div className="h-24 rounded bg-muted" />
              </div>

              <p className="mt-5 text-sm text-muted-foreground">
                Đang tìm kiếm địa điểm và xây dựng
                lịch trình...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-300 bg-red-50 p-6 text-sm leading-6 text-red-700">
              {error.message ||
                'Không thể tạo lịch trình.'}
            </div>
          )}

          {!loading &&
            !error &&
            plan && (
              <TravelPlanResult
                plan={plan}
              />
            )}

          {!loading &&
            !error &&
            !plan && (
              <div className="rounded-2xl border border-dashed p-8">
                <h2 className="font-semibold">
                  Lịch trình sẽ xuất hiện ở đây
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Điền thông tin bên trái rồi
                  chọn “Tạo lịch trình bằng AI”.
                </p>
              </div>
            )}
        </aside>
      </div>
    </main>
  );
}
