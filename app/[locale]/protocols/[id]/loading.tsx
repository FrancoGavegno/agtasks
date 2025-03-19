// app/protocols/[id]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-10">
      <Skeleton className="h-10 w-[300px] mb-4" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}