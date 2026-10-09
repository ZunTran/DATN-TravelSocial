'use client';

import {
  FormEvent,
  ReactNode,
  useMemo,
  useState,
} from 'react';

import type {
  CreateTravelPlanInput,
} from '../types/travel-plan.types';

interface TravelPlanFormProps {
  onSubmit: (
    input: CreateTravelPlanInput,
  ) => Promise<void> | void;

  loading?: boolean;
}

const SEARCH_RESULT_LIMIT = 10;

const MIN_LOCATION_LIMIT = 1;
const MAX_LOCATION_LIMIT = 20;

const DESTINATION_OPTIONS = [
  {
    value: 'Đà Nẵng',
    label: 'Đà Nẵng',
    province: 'Đà Nẵng',
  },
];

const CATEGORY_OPTIONS = [
  {
    value: 'Du lịch',
    title: 'Du lịch',
    description:
      'Ưu tiên các địa điểm tham quan và trải nghiệm phù hợp cho chuyến đi.',
  },
  {
    value: 'Địa điểm',
    title: 'Địa điểm',
    description:
      'Điểm tham quan, check-in, vui chơi và các địa điểm nổi bật.',
  },
  {
    value: 'Ẩm thực',
    title: 'Ẩm thực',
    description:
      'Nhà hàng, quán ăn và các địa điểm trải nghiệm món địa phương.',
  },
  {
    value: 'Mountain',
    title: 'Núi / thiên nhiên',
    description:
      'Núi, đồi và các địa điểm thiên nhiên, ngoài trời.',
  },
];

const INTEREST_OPTIONS = [
  'Biển',
  'Ẩm thực',
  'Tham quan',
  'Cảnh đẹp',
  'Thiên nhiên',
  'Núi',
  'Check-in',
  'Văn hóa',
  'Lịch sử',
  'Mua sắm',
  'Giải trí',
  'Cà phê',
];


const TRAVEL_STYLE_OPTIONS = [
  {
    value: 'thoải mái',
    title: 'Thoải mái',
    description:
      'Ít áp lực về thời gian, ưu tiên nghỉ ngơi và trải nghiệm.',
  },
  {
    value: 'cân bằng',
    title: 'Cân bằng',
    description:
      'Kết hợp tham quan, ăn uống và nghỉ ngơi hợp lý.',
  },
  {
    value: 'khám phá',
    title: 'Khám phá nhiều',
    description:
      'Ưu tiên trải nghiệm nhiều địa điểm trong thời gian chuyến đi.',
  },
];

const DURATION_PRESETS = [
  {
    label: 'Nhanh',
    min: 30,
    max: 90,
    description: 'Điểm tham quan ngắn',
  },
  {
    label: 'Vừa phải',
    min: 60,
    max: 180,
    description: 'Phù hợp đa số địa điểm',
  },
  {
    label: 'Thoải mái',
    min: 30,
    max: 240,
    description: 'Có thời gian trải nghiệm lâu hơn',
  },
];


function FieldLabel({
  children,
  required = false,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="text-sm font-semibold text-foreground">
      {children}

      {required && (
        <span className="ml-1 text-red-500">
          *
        </span>
      )}
    </label>
  );
}

function FieldHint({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <p className="text-xs leading-5 text-muted-foreground">
      {children}
    </p>
  );
}

const inputClass =
  'h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60';

function parseNumber(
  value: string,
): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return parsed;
}


function formatMoney(
  value: string,
): string {
  if (!value) {
    return '';
  }

  const digits = value.replace(
    /[^\d]/g,
    '',
  );

  if (!digits) {
    return '';
  }

  return Number(digits).toLocaleString(
    'vi-VN',
  );
}


function parseMoney(
  value: string,
): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const digits = value.replace(
    /[^\d]/g,
    '',
  );

  if (!digits) {
    return undefined;
  }

  const parsed = Number(digits);

  return Number.isFinite(parsed)
    ? parsed
    : undefined;
}

export function TravelPlanForm({
  onSubmit,
  loading = false,
}: TravelPlanFormProps) {
  const [
    destination,
    setDestination,
  ] = useState(
    DESTINATION_OPTIONS[0]?.value ??
      'Đà Nẵng',
  );

  const [
    numberOfDays,
    setNumberOfDays,
  ] = useState(2);

  const [
    numberOfLocationsEnabled,
    setNumberOfLocationsEnabled,
  ] = useState(false);

  const [
    numberOfLocations,
    setNumberOfLocations,
  ] = useState(
    String(SEARCH_RESULT_LIMIT),
  );

  const [
    category,
    setCategory,
  ] = useState('Du lịch');

  const [
    interests,
    setInterests,
  ] = useState<string[]>([
    'Biển',
    'Ẩm thực',
  ]);

  const [
    travelStyle,
    setTravelStyle,
  ] = useState('thoải mái');

  const [
    minCost,
    setMinCost,
  ] = useState('');

  const [
    maxCost,
    setMaxCost,
  ] = useState('');

  const [
    minDuration,
    setMinDuration,
  ] = useState('30');

  const [
    maxDuration,
    setMaxDuration,
  ] = useState('240');

  const [
    query,
    setQuery,
  ] = useState('');

  const [
    error,
    setError,
  ] = useState('');

  const selectedDestination =
    useMemo(
      () =>
        DESTINATION_OPTIONS.find(
          (item) =>
            item.value ===
            destination,
        ),
      [destination],
    );

  const toggleInterest = (
    interest: string,
  ) => {
    setInterests((current) => {
      if (current.includes(interest)) {
        return current.filter(
          (item) =>
            item !== interest,
        );
      }

      return [
        ...current,
        interest,
      ];
    });
  };

  const applyDurationPreset = (
    min: number,
    max: number,
  ) => {
    setMinDuration(
      String(min),
    );

    setMaxDuration(
      String(max),
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError('');
    const cleanDestination =
      destination.trim();

    if (!cleanDestination) {
      setError( 'Vui lòng chọn điểm đến.');
      return;
    }

    if (
      numberOfDays < 1 ||
      numberOfDays > 30
    ) {
      setError( 'Số ngày phải nằm trong khoảng từ 1 đến 30 ngày.' );
      return;
    }

    const parsedNumberOfLocations =
      parseNumber(
        numberOfLocations,
      );

    if (
      numberOfLocationsEnabled
    ) {
      if (
        parsedNumberOfLocations === undefined ||
        !Number.isInteger( parsedNumberOfLocations )
      ) {
        setError('Số lượng địa điểm tham quan không hợp lệ.');
        return;
      }

      if (
        parsedNumberOfLocations <
          MIN_LOCATION_LIMIT ||
        parsedNumberOfLocations >
          MAX_LOCATION_LIMIT
      ) {
        setError(
          `Số lượng địa điểm tham quan phải từ ${MIN_LOCATION_LIMIT} đến ${MAX_LOCATION_LIMIT} địa điểm.`,
        );
        return;
      }
    }

    const parsedMinCost = parseMoney(minCost);
    const parsedMaxCost = parseMoney(maxCost);

    if (
      minCost.trim() &&
      parsedMinCost ===
        undefined
    ) {
      setError('Chi phí tối thiểu không hợp lệ.');
      return;
    }

    if (
      maxCost.trim() &&
      parsedMaxCost ===
        undefined
    ) {
      setError(
        'Chi phí tối đa không hợp lệ.',
      );
      return;
    }

    if (
      parsedMinCost !==
        undefined &&
      parsedMinCost < 0
    ) {
      setError(
        'Chi phí tối thiểu không được nhỏ hơn 0.',
      );
      return;
    }

    if (
      parsedMaxCost !==
        undefined &&
      parsedMaxCost < 0
    ) {
      setError(
        'Chi phí tối đa không được nhỏ hơn 0.',
      );
      return;
    }

    if (
      parsedMinCost !==
        undefined &&
      parsedMaxCost !==
        undefined &&
      parsedMinCost >
        parsedMaxCost
    ) {
      setError(
        'Chi phí tối thiểu không được lớn hơn chi phí tối đa.',
      );
      return;
    }


    const parsedMinDuration =
      parseNumber(minDuration);

    const parsedMaxDuration =
      parseNumber(maxDuration);

    if (
      parsedMinDuration ===
        undefined ||
      parsedMaxDuration ===
        undefined
    ) {
      setError(
        'Vui lòng nhập thời lượng tham quan hợp lệ.',
      );
      return;
    }

    if (
      parsedMinDuration < 0 ||
      parsedMaxDuration < 0
    ) {
      setError(
        'Thời lượng tham quan không được nhỏ hơn 0 phút.',
      );
      return;
    }

    if (
      parsedMinDuration >
      parsedMaxDuration
    ) {
      setError(
        'Thời lượng tối thiểu không được lớn hơn thời lượng tối đa.',
      );
      return;
    }

    if (!interests.length) {
      setError(
        'Vui lòng chọn ít nhất một sở thích để AI có thêm thông tin xây dựng lịch trình.',
      );
      return;
    }

    const cleanQuery = query.trim();
    const finalLocationLimit = numberOfLocationsEnabled
        ? parsedNumberOfLocations ??
          SEARCH_RESULT_LIMIT
        : SEARCH_RESULT_LIMIT;

    const input: CreateTravelPlanInput =
      {
        destination: cleanDestination,
        numberOfDays,
        province:
          selectedDestination?.province ??
          cleanDestination,

        ...(category
          ? {
              category,
            }
          : {}),

        ...(parsedMinCost !==
        undefined
          ? {
              minCost:
                parsedMinCost,
            }
          : {}),

        ...(parsedMaxCost !==
        undefined
          ? {
              maxCost:
                parsedMaxCost,
            }
          : {}),

        minDuration:
          parsedMinDuration,

        maxDuration:
          parsedMaxDuration,

        interests,

        ...(travelStyle
          ? {
              travelStyle,
            }
          : {}),

        ...(cleanQuery
          ? {
              query:
                cleanQuery,
            }
          : {}),

        limit:
          finalLocationLimit,
      };

    await onSubmit(input);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      <section className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              1
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Chuyến đi
              </h2>

              <p className="text-sm text-muted-foreground">
                Bạn muốn đi đâu và trong bao
                nhiêu ngày?
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-[1fr_180px]">

          <div className="space-y-2">
            <FieldLabel required>
              Điểm đến
            </FieldLabel>

            <select
              value={destination}
              onChange={(event) =>
                setDestination(
                  event.target.value,
                )
              }
              className={inputClass}
              disabled={loading}
            >
              {DESTINATION_OPTIONS.map(
                (item) => (
                  <option
                    key={item.value}
                    value={
                      item.value
                    }
                  >
                    {item.label}
                  </option>
                ),
              )}
            </select>

            <FieldHint>
              Hiện tại hệ thống hỗ trợ dữ liệu
              địa điểm tại Đà Nẵng. Danh sách này
              có thể mở rộng thêm địa phương sau này.
            </FieldHint>
          </div>


          <div className="space-y-2">
            <FieldLabel required>
              Số ngày
            </FieldLabel>

            <select
              value={numberOfDays}
              onChange={(event) =>
                setNumberOfDays(
                  Number(
                    event.target.value,
                  ),
                )
              }
              className={inputClass}
              disabled={loading}
            >
              {Array.from(
                { length: 7 },
                (_, index) =>
                  index + 1,
              ).map((day) => (
                <option
                  key={day}
                  value={day}
                >
                  {day} ngày
                </option>
              ))}
            </select>

            <FieldHint>
              AI sẽ chia lịch trình theo số ngày này.
            </FieldHint>
          </div>
        </div>


        <div className="mt-5 rounded-xl border bg-muted/20 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={
                numberOfLocationsEnabled
              }
              onChange={(event) =>
                setNumberOfLocationsEnabled(
                  event.target.checked,
                )
              }
              disabled={loading}
              className="mt-1 h-4 w-4 rounded border-input accent-primary"
            />

            <div className="space-y-1">
              <div className="text-sm font-semibold">
                Bạn có muốn chọn số lượng địa điểm
                tham quan?
              </div>

              <p className="text-xs leading-5 text-muted-foreground">
                Nếu không chọn, hệ thống mặc định
                tìm tối đa{' '}
                <strong className="text-foreground">
                  {SEARCH_RESULT_LIMIT}{' '}
                  địa điểm
                </strong>{' '}
                phù hợp để AI xây dựng lịch trình.
              </p>
            </div>
          </label>

          {numberOfLocationsEnabled && (
            <div className="mt-4 max-w-xs space-y-2">
              <FieldLabel required>
                Số lượng địa điểm
              </FieldLabel>

              <div className="relative">
                <input
                  type="number"
                  min={
                    MIN_LOCATION_LIMIT
                  }
                  max={
                    MAX_LOCATION_LIMIT
                  }
                  step={1}
                  value={
                    numberOfLocations
                  }
                  onChange={(event) =>
                    setNumberOfLocations(
                      event.target.value,
                    )
                  }
                  disabled={loading}
                  className={`${inputClass} pr-20`}
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                  địa điểm
                </span>
              </div>

              <FieldHint>
                Chọn từ{' '}
                {MIN_LOCATION_LIMIT}{' '}
                đến{' '}
                {MAX_LOCATION_LIMIT}{' '}
                địa điểm. AI sẽ sử dụng các địa
                điểm tìm được để sắp xếp thành lịch
                trình theo số ngày bạn chọn.
              </FieldHint>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              2
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Bạn muốn trải nghiệm gì?
              </h2>

              <p className="text-sm text-muted-foreground">
                Chọn những điều quan trọng với bạn
                trong chuyến đi.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <FieldLabel>
            Loại địa điểm ưu tiên
          </FieldLabel>

          <FieldHint>
            Chọn một loại để Hybrid Search ưu tiên
            các địa điểm phù hợp.
          </FieldHint>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_OPTIONS.map(
              (item) => {
                const selected =
                  category ===
                  item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      setCategory(
                        selected
                          ? ''
                          : item.value,
                      )
                    }
                    className={[
                      'rounded-xl border p-4 text-left transition',
                      'disabled:cursor-not-allowed disabled:opacity-60',
                      selected
                        ? 'border-primary bg-primary/10 ring-1 ring-primary'
                        : 'hover:bg-muted',
                    ].join(' ')}
                  >
                    <div className="font-semibold">
                      {item.title}
                    </div>

                    <div className="mt-2 text-xs leading-5 text-muted-foreground">
                      {item.description}
                    </div>
                  </button>
                );
              },
            )}
          </div>
        </div>



        <div className="mt-7 space-y-3">
          <FieldLabel required>
            Sở thích
          </FieldLabel>

          <FieldHint>
            Chọn một hoặc nhiều sở thích. Các lựa
            chọn này sẽ được kết hợp với yêu cầu
            của bạn để tìm địa điểm.
          </FieldHint>

          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map(
              (interest) => {
                const selected =
                  interests.includes(
                    interest,
                  );

                return (
                  <button
                    key={interest}
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      toggleInterest(
                        interest,
                      )
                    }
                    className={[
                      'rounded-full border px-4 py-2 text-sm font-medium transition',
                      'disabled:cursor-not-allowed disabled:opacity-60',
                      selected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'hover:bg-muted',
                    ].join(' ')}
                  >
                    {selected
                      ? '✓ '
                      : ''}
                    {interest}
                  </button>
                );
              },
            )}
          </div>
        </div>

        <div className="mt-7 space-y-3">
          <FieldLabel>
            Nhịp độ chuyến đi
          </FieldLabel>

          <FieldHint>
            Thông tin này chủ yếu dùng để AI sắp
            xếp các địa điểm thành lịch trình.
          </FieldHint>

          <div className="grid gap-3 md:grid-cols-3">
            {TRAVEL_STYLE_OPTIONS.map(
              (item) => {
                const selected =
                  travelStyle ===
                  item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      setTravelStyle(
                        selected
                          ? ''
                          : item.value,
                      )
                    }
                    className={[
                      'rounded-xl border p-4 text-left transition',
                      'disabled:cursor-not-allowed disabled:opacity-60',
                      selected
                        ? 'border-primary bg-primary/10 ring-1 ring-primary'
                        : 'hover:bg-muted',
                    ].join(' ')}
                  >
                    <div className="font-semibold">
                      {item.title}
                    </div>

                    <div className="mt-2 text-xs leading-5 text-muted-foreground">
                      {item.description}
                    </div>
                  </button>
                );
              },
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              3
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Ngân sách cho địa điểm
              </h2>

              <p className="text-sm text-muted-foreground">
                Giới hạn khoảng chi phí của các địa
                điểm được đưa vào tìm kiếm.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel>
              Chi phí tối thiểu
            </FieldLabel>

            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={formatMoney(
                  minCost,
                )}
                onChange={(event) =>
                  setMinCost(
                    event.target.value.replace(
                      /[^\d]/g,
                      '',
                    ),
                  )
                }
                placeholder="0"
                className={`${inputClass} pr-16`}
                disabled={loading}
              />

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                VNĐ
              </span>
            </div>

            <FieldHint>
              Có thể để trống nếu không muốn giới
              hạn mức tối thiểu.
            </FieldHint>
          </div>


          <div className="space-y-2">
            <FieldLabel>
              Chi phí tối đa
            </FieldLabel>

            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={formatMoney(
                  maxCost,
                )}
                onChange={(event) =>
                  setMaxCost(
                    event.target.value.replace(
                      /[^\d]/g,
                      '',
                    ),
                  )
                }
                placeholder="1.000.000"
                className={`${inputClass} pr-16`}
                disabled={loading}
              />

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                VNĐ
              </span>
            </div>

            <FieldHint>
              Ví dụ nhập 1000000 sẽ hiển thị
              1.000.000 VNĐ.
            </FieldHint>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-muted/50 p-4 text-xs leading-5 text-muted-foreground">
          <strong className="text-foreground">
            Lưu ý:
          </strong>{' '}
          Đây là khoảng chi phí của{' '}
          <strong className="text-foreground">
            địa điểm
          </strong>{' '}
          được tìm kiếm, không phải tổng ngân
          sách của cả chuyến đi.
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              4
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Thời gian dành cho mỗi địa điểm
              </h2>

              <p className="text-sm text-muted-foreground">
                Giúp hệ thống tìm những địa điểm có
                thời lượng tham quan phù hợp.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-5 rounded-xl border border-dashed bg-muted/30 p-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Ví dụ bạn chọn{' '}
            <strong className="text-foreground">
              30 – 240 phút
            </strong>
            , hệ thống sẽ ưu tiên những địa điểm
            có thời lượng phù hợp trong khoảng này.
            Sau đó AI mới dùng các địa điểm tìm được
            để sắp xếp lịch trình theo số ngày bạn
            chọn.
          </p>
        </div>

        <div className="mb-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Chọn nhanh
          </p>

          <div className="grid gap-2 sm:grid-cols-3">
            {DURATION_PRESETS.map(
              (preset) => {
                const selected =
                  minDuration ===
                    String(
                      preset.min,
                    ) &&
                  maxDuration ===
                    String(
                      preset.max,
                    );

                return (
                  <button
                    key={
                      preset.label
                    }
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      applyDurationPreset(
                        preset.min,
                        preset.max,
                      )
                    }
                    className={[
                      'rounded-xl border px-4 py-3 text-left transition',
                      selected
                        ? 'border-primary bg-primary/10'
                        : 'hover:bg-muted',
                    ].join(' ')}
                  >
                    <div className="text-sm font-semibold">
                      {preset.label}
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground">
                      {preset.min}–
                      {preset.max}{' '}
                      phút ·{' '}
                      {preset.description}
                    </div>
                  </button>
                );
              },
            )}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel required>
              Thời lượng tối thiểu
            </FieldLabel>

            <div className="relative">
              <input
                type="number"
                min={0}
                value={
                  minDuration
                }
                onChange={(event) =>
                  setMinDuration(
                    event.target.value,
                  )
                }
                className={`${inputClass} pr-16`}
                disabled={loading}
              />

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                phút
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <FieldLabel required>
              Thời lượng tối đa
            </FieldLabel>

            <div className="relative">
              <input
                type="number"
                min={0}
                value={
                  maxDuration
                }
                onChange={(event) =>
                  setMaxDuration(
                    event.target.value,
                  )
                }
                className={`${inputClass} pr-16`}
                disabled={loading}
              />

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                phút
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
        <div className="mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              5
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Yêu cầu riêng
              </h2>

              <p className="text-sm text-muted-foreground">
                Mô tả bằng ngôn ngữ tự nhiên những
                gì bạn muốn trong chuyến đi.
              </p>
            </div>
          </div>
        </div>

        <textarea
          value={query}
          onChange={(event) =>
            setQuery(
              event.target.value,
            )
          }
          rows={5}
          disabled={loading}
          placeholder="Ví dụ: địa điểm du lịch nổi bật ở Đà Nẵng, phù hợp đi trong 2 ngày, gần biển, thích ăn hải sản và ngắm cảnh..."
          className="w-full resize-none rounded-xl border bg-background p-4 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Không bắt buộc
          </span>

          <span>
            {query.length} ký tự
          </span>
        </div>

        <div className="mt-4 rounded-xl bg-muted/50 p-4 text-xs leading-5 text-muted-foreground">
          <strong className="text-foreground">
            Gợi ý:
          </strong>{' '}
          Viết càng cụ thể thì hệ thống càng có
          thêm thông tin để tìm địa điểm phù hợp
          và AI xây dựng nội dung lịch trình.
        </div>
      </section>

      <section className="rounded-2xl border border-dashed bg-muted/20 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-primary">
            ℹ
          </div>

          <div className="text-xs leading-5 text-muted-foreground">
            <p className="font-semibold text-foreground">
              Hệ thống xử lý yêu cầu như thế nào?
            </p>

            <p className="mt-1">
              Thông tin bạn nhập sẽ được dùng để
              tìm các địa điểm phù hợp bằng Hybrid
              Search.{' '}

              {numberOfLocationsEnabled ? (
                <>
                  Bạn đã chọn tối đa{' '}
                  <strong className="text-foreground">
                    {numberOfLocations || '...'}{' '}
                    địa điểm
                  </strong>
                  . Sau đó AI sẽ sử dụng các địa
                  điểm phù hợp này để xây dựng và
                  sắp xếp lịch trình theo số ngày,
                  sở thích, phong cách và yêu cầu
                  của bạn.
                </>
              ) : (
                <>
                  Nếu bạn không chọn số lượng địa
                  điểm, hệ thống sẽ mặc định tìm tối
                  đa{' '}
                  <strong className="text-foreground">
                    {SEARCH_RESULT_LIMIT}{' '}
                    địa điểm
                  </strong>{' '}
                  phù hợp. Sau đó AI sẽ sử dụng các
                  địa điểm này để xây dựng và sắp xếp
                  lịch trình theo số ngày, sở thích,
                  phong cách và yêu cầu của bạn.
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm leading-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-xl bg-primary px-6 font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? 'AI đang xây dựng lịch trình...'
          : 'Tạo lịch trình bằng AI'}
      </button>
    </form>
  );
}