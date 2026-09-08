import type { InterestTag } from "../../types/interest";

interface ProfileInterestsProps {
  interests: InterestTag[];
  isOwnProfile: boolean;
}

export function ProfileInterests({
  interests,
  isOwnProfile,
}: ProfileInterestsProps) {
  if (interests.length === 0) {
    return (
      <section className="rounded-2xl border bg-card p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold">
            Interests
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {isOwnProfile
              ? "You haven't selected any interests yet."
              : "This user hasn't selected any interests yet."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border bg-card p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold">
          Interests
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Things you enjoy
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {interests.map((interest) => (
          <div
            key={interest.id}
            className="inline-flex items-center gap-2 rounded-full border bg-muted/30 px-3 py-2 text-sm transition-colors hover:bg-muted"
          >
            {interest.icon_url && (
              <img
                src={interest.icon_url}
                alt=""
                className="h-5 w-5 object-contain"
              />
            )}

            <span className="font-medium">
              {interest.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}