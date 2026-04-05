import { Skeleton } from "@/components/ui/Skeleton";

export default function CustomPageLoading() {
  return (
    <div className="surface-page min-h-screen pb-24 animate-in fade-in duration-500">
      {/* Hero Header Skeleton */}
      <div className="pt-32 pb-16 bg-bg-alt/30 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <Skeleton className="h-16 w-3/4 rounded-2xl" />
          <div className="space-y-3">
             <Skeleton className="h-6 w-1/2 rounded-lg" />
             <Skeleton className="h-6 w-1/3 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Featured Image Skeleton */}
        <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl bg-surface-alt">
           <Skeleton className="w-full h-full" />
        </div>

        {/* Content Skeletons */}
        <div className="space-y-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-4">
               <Skeleton className="h-4 w-full rounded-md" />
               <Skeleton className="h-4 w-11/12 rounded-md" />
               <Skeleton className="h-4 w-10/12 rounded-md" />
               <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
