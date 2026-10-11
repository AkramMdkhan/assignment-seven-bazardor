import Link from "next/link";
import { notFound } from "next/navigation";
import type { Product } from "@/components/ProductCard";

type Market = {
    market: string;
    division: string;
    min: number;
    max: number;
};

type ProductDetail = Product & {
    category: string;
    categoryNameBn: string;
    yesterday: number;
    markets: Market[];
};

const API_URL = "https://api.api-store.workers.dev/api/bazardor/products";

const UNITS: Record<string, string> = {
    kg: "কেজি",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
};

// Bengali digits; shows 2 decimals only when the number is not whole (৬৩.৫০)
const bn = (n: number) =>
    n.toLocaleString("bn-BD", {
        minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
        maximumFractionDigits: 2,
    });

const bnPct = (n: number) =>
    n.toLocaleString("bn-BD", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

// Turns an emoji into an Apple-style image URL, e.g. 🍚 -> .../1f35a.png
const emojiSrc = (emoji: string) =>
    `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/${Array.from(emoji)
        .map((ch) => ch.codePointAt(0)!.toString(16))
        .join("-")}.png`;

async function getProducts(): Promise<ProductDetail[]> {
    try {
        const res = await fetch(API_URL, { next: { revalidate: 300 } });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("ProductDetails fetch error:", err);
        return [];
    }
}

export default async function ProductDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const products = await getProducts();
    const product = products.find((p) => p.slug === slug);

    if (!product) notFound();

    const unit = UNITS[product.unit] ?? product.unit;
    const { dir, pct } = product.change;
    const diff = Math.abs(product.today - product.yesterday);

    const minPrice = Math.min(...product.markets.map((m) => m.min));
    const maxPrice = Math.max(...product.markets.map((m) => m.max));

    // Table rows: add the average of min and max, cheapest average first
    const rows = product.markets
        .map((m) => ({ ...m, avg: (m.min + m.max) / 2 }))
        .sort((a, b) => a.avg - b.avg);

    const dirColor =
        dir === "up" ? "text-error" : dir === "down" ? "text-success" : "text-base-content/60";

    const summaryText =
        dir === "flat"
            ? "গতকালের তুলনায় আজ দাম অপরিবর্তিত"
            : `গতকালের তুলনায় আজ দাম ${dir === "up" ? "বেড়েছে" : "কমেছে"} · ${bn(diff)} টাকা`;

    return (
        <main className="mx-auto w-full max-w-[1216px] space-y-4 px-3 py-4 sm:space-y-6 sm:px-4 sm:py-6 lg:py-8">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-base-content/60 sm:text-sm">
                <Link href="/" className="hover:text-green-700">
                    হোম
                </Link>
                <span>›</span>
                <Link href={`/category/${product.category}`} className="hover:text-green-700">
                    {product.categoryNameBn}
                </Link>
                <span>›</span>
                <span className="text-base-content">{product.nameBn}</span>
            </nav>

            {/* Top summary */}
            <section className="flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6 lg:p-8">
                <div className="flex items-center gap-4 sm:gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-base-200 sm:h-20 sm:w-20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={emojiSrc(product.image)}
                            alt={product.image}
                            width={48}
                            height={48}
                            className="h-10 w-10 sm:h-12 sm:w-12"
                        />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-2xl font-extrabold sm:text-3xl lg:text-4xl">
                            {product.nameBn}
                        </h1>
                        <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-base-content/60 sm:text-sm">
                            <span>প্রতি {unit}</span>
                            <span>·</span>
                            <Link
                                href={`/category/${product.category}`}
                                className="badge badge-soft badge-success"
                            >
                                {product.categoryNameBn}
                            </Link>
                        </p>
                        <p className="mt-2 text-sm sm:text-base">{summaryText}</p>
                    </div>
                </div>

                <div className="rounded-2xl bg-base-200 px-6 py-4 text-center sm:min-w-[140px]">
                    <p className="text-xs text-base-content/60 sm:text-sm">আজকের দাম</p>
                    <p className="text-4xl font-extrabold sm:text-5xl">{bn(product.today)}</p>
                    <p className="text-xs text-base-content/60 sm:text-sm">টাকা / {unit}</p>
                    <p className={`mt-1 text-sm font-bold ${dirColor}`}>
                        {dir === "flat" ? "— ০.০%" : `${dir === "up" ? "▲" : "▼"} ${bnPct(Math.abs(pct))}%`}
                    </p>
                </div>
            </section>

            {/* Price summary + market table */}
            <section className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-6 lg:p-8">
                <h2 className="mb-3 text-lg font-extrabold sm:mb-4 sm:text-xl">দামের সারসংক্ষেপ</h2>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                    <div className="rounded-2xl border border-base-300 p-4">
                        <p className="text-xs text-base-content/70">সর্বনিম্ন দাম</p>
                        <p className="mt-1 font-extrabold text-success">
                            <span className="text-2xl sm:text-3xl">{bn(minPrice)}</span>{" "}
                            <span className="text-sm">টাকা</span>
                        </p>
                        <p className="mt-1 text-xs text-base-content/60">সবচেয়ে কম দামের বাজার</p>
                    </div>

                    <div className="rounded-2xl border border-base-300 p-4">
                        <p className="text-xs text-base-content/70">সর্বাধিক দাম</p>
                        <p className="mt-1 font-extrabold text-error">
                            <span className="text-2xl sm:text-3xl">{bn(maxPrice)}</span>{" "}
                            <span className="text-sm">টাকা</span>
                        </p>
                        <p className="mt-1 text-xs text-base-content/60">সবচেয়ে বেশি দামের বাজার</p>
                    </div>

                    <div className="rounded-2xl border border-base-300 p-4">
                        <p className="text-xs text-base-content/70">গড় দাম</p>
                        <p className="mt-1 font-extrabold text-success">
                            <span className="text-2xl sm:text-3xl">{bn(product.today)}</span>{" "}
                            <span className="text-sm">টাকা</span>
                        </p>
                        <p className="mt-1 text-xs text-base-content/60">প্রতি {unit}-এর হিসাবে</p>
                    </div>
                </div>

                <h2 className="mb-3 mt-6 text-lg font-extrabold sm:mb-4 sm:mt-8 sm:text-xl">
                    বাজারভিত্তিক আজকের দাম
                </h2>

                <div className="overflow-x-auto rounded-2xl border border-base-300">
                    <table className="w-full min-w-[640px] text-sm sm:text-base">
                        <thead>
                            <tr className="border-b border-base-300 text-left text-base-content/60">
                                <th className="px-4 py-3 font-semibold">বাজার</th>
                                <th className="px-4 py-3 font-semibold">বিভাগ</th>
                                <th className="px-4 py-3 text-right font-semibold">সর্বনিম্ন</th>
                                <th className="px-4 py-3 text-right font-semibold">সর্বাধিক</th>
                                <th className="px-4 py-3 text-right font-semibold">গড়</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, i) => (
                                <tr
                                    key={r.market}
                                    className={`border-b border-base-300 last:border-b-0 ${
                                        i % 2 === 1 ? "bg-base-200/60" : ""
                                    }`}
                                >
                                    <td className="px-4 py-3 font-semibold">{r.market}</td>
                                    <td className="px-4 py-3 text-base-content/70">{r.division}</td>
                                    <td className="px-4 py-3 text-right">{bn(r.min)} টাকা</td>
                                    <td className="px-4 py-3 text-right">{bn(r.max)} টাকা</td>
                                    <td className="px-4 py-3 text-right font-extrabold">
                                        {bn(r.avg)} টাকা
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}