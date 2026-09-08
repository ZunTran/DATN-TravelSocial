"use client";

import { useEffect, useState } from "react";
import {Check, Loader2, Sparkles} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InterestSelector } from "@/features/user/components/interest-selector";

import { useInterests } from "@/features/user/hooks/use-interests";

export default function SetupInterestsPage() {
  const router = useRouter();

  const {
    interests,
    myInterests,
    loading,
    error,
    saving,
    saveError,
    saveInterests,
  } = useInterests();

  const [
    selectedIds,
    setSelectedIds,
  ] = useState<string[]>([]);

  const [saved, setSaved] =useState(false);

useEffect(() => {
  const nextSelectedIds = myInterests.map(
    (interest) => interest.id,
  );

  setSelectedIds((currentIds) => {
    if (
      currentIds.length === nextSelectedIds.length &&
      currentIds.every(
        (id, index) => id === nextSelectedIds[index],
      )
    ) {
      return currentIds;
    }

    return nextSelectedIds;
  });
}, [myInterests]);

  const handleSave = async () => {
    setSaved(false);

    try {
      await saveInterests(selectedIds);
      setSaved(true);

      setTimeout(() => {
        router.push("/profile");
      }, 700);
    } catch (error) {
      console.error("Failed to save interests:", error );
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[calc(100svh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-7 animate-spin text-primary" />

          <p className="text-sm text-muted-foreground">
            Loading interests...
          </p>
        </div>
      </main>
    );
  }


  if (error) {
    return (
      <main className="flex min-h-[calc(100svh-4rem)] items-center justify-center p-6">
        <div className="rounded-2xl border bg-card p-8 text-center">
          <h2 className="font-semibold"> Unable to load interests</h2>
          <p className="mt-2 text-sm text-muted-foreground">Please try again later.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100svh-4rem)] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="size-6" />
          </div>

          <h1 className="text-3xl font-bold">
            What are you interested in?
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Choose the travel interests you
            enjoy. You can change them later.
          </p>
        </div>

        <section className="rounded-3xl border bg-card p-5 shadow-sm md:p-8">

          <InterestSelector
            interests={interests}
            selectedIds={selectedIds}
            onChange={setSelectedIds}
            disabled={saving}
          />

          {saveError && (
            <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 p-3">
              <p className="text-sm text-destructive">
                Failed to save interests.
              </p>
            </div>
          )}

          {saved && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/5 p-3">
              <Check className="size-4 text-green-600" />

              <p className="text-sm text-green-700">
                Interests saved successfully.
              </p>
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3 border-t pt-6">

            <Button
              type="button"
              variant="ghost"
              disabled={saving}
              onClick={() => router.push("/")}
            >
              Skip for now
            </Button>

            <Button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="rounded-xl px-6"
            >
              {saving && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}

              {saving ? "Saving..." : "Save interests"}
            </Button>

          </div>
        </section>
      </div>
    </main>
  );
}