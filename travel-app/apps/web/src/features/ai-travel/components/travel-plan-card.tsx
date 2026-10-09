
'use client';

import type {
  TravelPlan,
} from '../types/travel-plan.types';

interface TravelPlanCardProps {
  plan: TravelPlan;
  onClick?: () => void;
  onDelete?: (
    id: string,
  ) => Promise<void> | void;
  deleting?: boolean;
}

export function TravelPlanCard({
  plan,
  onClick,
  onDelete,
  deleting = false,
}: TravelPlanCardProps) {
  const itemCount =
    plan.items.length;

  const createdAt =
    new Date(
      plan.createdAt,
    ).toLocaleDateString(
      'vi-VN',
    );

  return (
    <article
      className="rounded-2xl border bg-card p-5 transition hover:shadow-sm"
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold">
              {plan.title}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {plan.destination}
            </p>
          </div>

          <span className="rounded-full bg-muted px-3 py-1 text-xs">
            {plan.status}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>
            {itemCount} hoạt động
          </span>

          <span>•</span>

          <span>
            Tạo ngày {createdAt}
          </span>
        </div>
      </button>

      {onDelete && (
        <div className="mt-4 border-t pt-4">
          <button
            type="button"
            disabled={deleting}
            onClick={() =>
              onDelete(plan.id)
            }
            className="text-sm text-red-600 hover:underline disabled:opacity-50"
          >
            {deleting
              ? 'Đang xóa...'
              : 'Xóa lịch trình'}
          </button>
        </div>
      )}
    </article>
  );
}

