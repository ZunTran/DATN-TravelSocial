"use client";

import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type { InterestTag } from "../types/interest";

interface InterestSelectorProps {
  interests: InterestTag[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}

export function InterestSelector({
  interests,
  selectedIds,
  onChange,
  disabled = false,
}: InterestSelectorProps) {
  const [search, setSearch] = useState("");

  const filteredInterests = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return interests;
    }

    return interests.filter((interest) =>
      interest.name
        .toLowerCase()
        .includes(keyword),
    );
  }, [interests, search]);

  const toggleInterest = (id: string) => {
    if (disabled) {
      return;
    }

    if (selectedIds.includes(id)) {
      onChange(
        selectedIds.filter(
          (selectedId) =>
            selectedId !== id,
        ),
      );

      return;
    }

    onChange([
      ...selectedIds,
      id,
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search
          className="
            absolute
            left-3
            top-1/2
            size-4
            -translate-y-1/2
            text-muted-foreground
          "
        />

        <Input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search interests..."
          className="h-11 rounded-xl pl-10"
          disabled={disabled}
        />
      </div>

      {/* Selected */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium">
            Selected interests
          </p>

          <span className="text-xs text-muted-foreground">
            {selectedIds.length} selected
          </span>
        </div>

        {selectedIds.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No interests selected yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {interests
              .filter((interest) =>
                selectedIds.includes(
                  interest.id,
                ),
              )
              .map((interest) => (
                <Button
                  key={interest.id}
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="rounded-full"
                  disabled={disabled}
                  onClick={() =>
                    toggleInterest(
                      interest.id,
                    )
                  }
                >
                  {interest.icon_url && (
                    <img
                      src={interest.icon_url}
                      alt=""
                      className="size-4 rounded-full object-cover"
                    />
                  )}

                  {interest.name}

                  <span className="ml-1">
                    ×
                  </span>
                </Button>
              ))}
          </div>
        )}
      </div>

      {/* All interests */}
      <div>
        <p className="mb-3 text-sm font-medium">
          Interests
        </p>

        {filteredInterests.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No interests found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {filteredInterests.map(
              (interest) => {
                const selected =
                  selectedIds.includes(
                    interest.id,
                  );

                return (
                  <button
                    key={interest.id}
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                      toggleInterest(
                        interest.id,
                      )
                    }
                    className={[
                      "relative flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all",
                      "hover:border-primary/50 hover:bg-primary/5",
                      selected
                        ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                        : "bg-card",
                      disabled
                        ? "cursor-not-allowed opacity-60"
                        : "",
                    ].join(" ")}
                  >
                    {interest.icon_url ? (
                      <img
                        src={interest.icon_url}
                        alt=""
                        className="size-9 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex size-9 items-center justify-center rounded-xl bg-muted">
                        ✈️
                      </div>
                    )}

                    <span className="text-sm font-medium">
                      {interest.name}
                    </span>

                    {selected && (
                      <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3" />
                      </span>
                    )}
                  </button>
                );
              },
            )}
          </div>
        )}
      </div>
    </div>
  );
}