"use client";

import { useParams } from "next/navigation";
import AnotherProfileRoute from "@/features/user/components/profile/another-profile";

export default function AnotherProfilePage() {
  const params = useParams<{ username: string }>();

  return (
    <AnotherProfileRoute
      username={params.username}
    />
  );
}

