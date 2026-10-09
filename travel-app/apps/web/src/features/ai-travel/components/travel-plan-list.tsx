
'use client';

import type {
  TravelPlan,
} from '../types/travel-plan.types';

import {
  TravelPlanCard,
} from './travel-plan-card';

interface TravelPlanListProps {
  plans: TravelPlan[];
  onSelect?: (
    plan: TravelPlan,
  ) => void;
  onDelete?: (
    id: string,
  ) => Promise<void> | void;
  deletingId?: string | null;
}

export function TravelPlanList({
  plans,
  onSelect,
  onDelete,
  deletingId = null,
}: TravelPlanListProps) {
  if (!plans.length) {
    return (
      <div className="rounded-2xl border border-dashed p-10 text-center">
        <h3 className="font-semibold">
          Chưa có lịch trình
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Tạo một lịch trình bằng AI để xem
          kết quả tại đây.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {plans.map((plan) => (
        <TravelPlanCard
          key={plan.id}
          plan={plan}
          onClick={() =>
            onSelect?.(plan)
          }
          onDelete={onDelete}
          deleting={
            deletingId === plan.id
          }
        />
      ))}
    </div>
  );
}

