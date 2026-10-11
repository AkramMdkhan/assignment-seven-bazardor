import { Suspense } from "react";
import AllProducts from "@/components/AllProducts";
import Hero from "@/components/Hero";
import PriceMovers from "@/components/PriceMovers";

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-3 shadow-sm sm:p-4">
      <div className="flex items-center gap-3">
        <div className="skeleton h-10 w-10 shrink-0 rounded-xl sm:h-11 sm:w-11" />
        <div className="space-y-2">
          <div className="skeleton h-4 w-28" />
          <div className="skeleton h-3 w-16" />
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2">
        <div className="space-y-2">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-5 w-20" />
        </div>
        <div className="skeleton h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}

function SkeletonGrid({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

function MoversSkeleton() {
  return (
    <section className="mx-auto w-full max-w-[1216px] space-y-8 px-3 py-4 sm:space-y-10 sm:px-4 sm:py-6 lg:py-8">
      <div>
        <div className="skeleton mb-3 h-6 w-40 sm:mb-4" />
        <SkeletonGrid count={6} />
      </div>
      <div>
        <div className="skeleton mb-3 h-6 w-40 sm:mb-4" />
        <SkeletonGrid count={6} />
      </div>
    </section>
  );
}

function AllProductsSkeleton() {
  return (
    <section className="mx-auto w-full max-w-[1216px] px-3 py-4 sm:px-4 sm:py-6 lg:py-8">
      <div className="mb-3 space-y-2 sm:mb-4">
        <div className="skeleton h-6 w-24" />
        <div className="skeleton h-4 w-56" />
      </div>
      <SkeletonGrid count={9} />
    </section>
  );
}

export default function Home() {
  return (
    <div style={{ padding: 10, gap: 4 }}>
      <Hero />

      <Suspense fallback={<MoversSkeleton />}>
        <PriceMovers />
      </Suspense>

      <Suspense fallback={<AllProductsSkeleton />}>
        <AllProducts />
      </Suspense>
    </div>
  );
}