import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export default function AdminStatCard({
  title,
  value,
  icon: Icon,
}: Props) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold">
            {value}
          </p>
        </div>

        <Icon className="h-8 w-8 text-muted-foreground" />
      </CardContent>
    </Card>
  );
}