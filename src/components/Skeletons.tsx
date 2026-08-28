import { useEffect, useState } from "react";

export function Sk({ className = "" }: { className?: string }) {
  return <div className={`shimmer rounded-sm ${className}`} />;
}

/** Shows a skeleton layout for `ms` on mount (default 2s). */
export function usePageLoading(ms = 2000) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return loading;
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-sm bg-card shadow-card">
          <Sk className="aspect-square w-full" />
          <div className="space-y-2 p-3">
            <Sk className="h-4 w-4/5" />
            <Sk className="h-4 w-1/3" />
            <Sk className="h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="space-y-8 pb-10">
      <Sk className="h-[6cm] w-full rounded-none" />
      <div className="space-y-4 px-4">
        <Sk className="h-6 w-48" />
        <div className="flex gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Sk className="size-[86px] rounded-full" />
              <Sk className="mx-auto h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4 px-4">
        <Sk className="h-6 w-40" />
        <CardGridSkeleton count={4} />
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2 rounded-sm bg-card p-4 shadow-card">
          <Sk className="h-4 w-1/3" />
          <Sk className="h-3 w-1/2" />
          <Sk className="h-3 w-1/4" />
        </div>
      ))}
    </div>
  );
}
