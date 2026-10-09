'use client';

import type {
  TravelPlan,
} from '../types/travel-plan.types';

interface TravelPlanResultProps {
  plan: TravelPlan;
}

function formatCurrency(
  value: number | null,
) {
  if (value === null) {
    return 'Chưa xác định';
  }

  return new Intl.NumberFormat(
    'vi-VN',
  ).format(value);
}

export function TravelPlanResult({
  plan,
}: TravelPlanResultProps) {
  const days = Array.from(
    new Set(
      plan.items.map(
        (item) => item.dayIndex,
      ),
    ),
  ).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm text-muted-foreground">
              Lịch trình AI
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              {plan.title}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-muted px-3 py-1">
              {plan.destination}
            </span>

            <span className="rounded-full bg-muted px-3 py-1">
              {days.length} ngày
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <h2 className="text-lg font-bold">
          Tổng quan
        </h2>

        <div className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">
          {plan.content}
        </div>
      </div>

      <div className="space-y-6">
        {days.map((day) => {
          const dayItems =
            plan.items
              .filter(
                (item) =>
                  item.dayIndex === day,
              )
              .sort((a, b) =>
                (a.timeSlot ?? '').localeCompare(
                  b.timeSlot ?? '',
                ),
              );

          return (
            <section
              key={day}
              className="rounded-2xl border bg-card p-6"
            >
              <div className="mb-5">
                <h2 className="text-xl font-bold">
                  Ngày {day}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {dayItems.length} hoạt động
                </p>
              </div>

              <div className="space-y-4">
                {dayItems.map(
                  (item) => (
                    <article
                      key={item.id}
                      className="rounded-xl border p-4"
                    >
                      <div className="flex gap-4">
                        <div className="min-w-20 text-sm font-semibold text-primary">
                          {item.timeSlot ??
                            'Thời gian chưa xác định'}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {
                              item.activityName
                            }
                          </h3>

                          {item.description && (
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                              {
                                item.description
                              }
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.locationId && (
                              <span className="rounded-full bg-muted px-3 py-1 text-xs">
                                Địa điểm: {item.locationId}
                              </span>
                            )}

                            {item.costEstimate !==
                              null && (
                              <span className="rounded-full bg-muted px-3 py-1 text-xs">
                                Ước tính:{' '}
                                {formatCurrency(
                                  item.costEstimate,
                                )}{' '}
                                VNĐ
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  ),
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

