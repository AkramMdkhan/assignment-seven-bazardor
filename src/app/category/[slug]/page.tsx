"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard, { type Product } from "@/components/ProductCard";

type CategoryProduct = Product & {
    category: string;
    categoryNameBn: string;
    categoryIcon: string;
};

type Sort = "default" | "price-asc" | "price-desc" | "rise" | "fall";

const API_URL = "https://api.api-store.workers.dev/api/bazardor/products";

const bn = (n: number) => n.toLocaleString("bn-BD");

// Turns an emoji into an Apple-style image URL, e.g. 🍚 -> .../1f35a.png
const emojiSrc = (emoji: string) =>
    `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/${Array.from(emoji)
        .map((ch) => ch.codePointAt(0)!.toString(16))
        .join("-")}.png`;

export default function CategoryPage() {
    const { slug } = useParams<{ slug: string }>();

    const [products, setProducts] = useState<CategoryProduct[]>([]);
    const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
    const [sort, setSort] = useState<Sort>("default");

    useEffect(() => {
        fetch(API_URL)
            .then((res) => {
                if (!res.ok) throw new Error(`Request failed: ${res.status}`);
                return res.json();
            })
            .then((data: CategoryProduct[]) => {
                setProducts(data);
                setStatus("ready");
            })
            .catch((err) => {
                console.error("CategoryPage fetch error:", err);
                setStatus("error");
            });
    }, []);

    const items = useMemo(() => products.filter((p) => p.category === slug), [products, slug]);

    const sorted = useMemo(() => {
        const list = [...items];
        switch (sort) {
            case "price-asc":
                return list.sort((a, b) => a.today - b.today);
            case "price-desc":
                return list.sort((a, b) => b.today - a.today);
            case "rise":
                return list.sort((a, b) => b.change.pct - a.change.pct);
            case "fall":
                return list.sort((a, b) => a.change.pct - b.change.pct);
            default:
                return list;
        }
    }, [items, sort]);

    if (status === "loading") {
        return (
            <main className="mx-auto w-full max-w-[1216px] px-3 py-10 text-center text-sm sm:px-4">
                লোড হচ্ছে...
            </main>
        );
    }

    if (status === "error") {
        return (
            <main className="mx-auto w-full max-w-[1216px] px-3 py-10 text-center text-sm text-error sm:px-4">
                পণ্য লোড করা যায়নি
            </main>
        );
    }

    if (items.length === 0) {
        return (
            <main className="mx-auto w-full max-w-[1216px] px-3 py-10 text-center text-sm sm:px-4">
                এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি
            </main>
        );
    }

    const { categoryNameBn, categoryIcon } = items[0];

    return (
        <main className="mx-auto w-full max-w-[1216px] space-y-4 px-3 py-4 sm:space-y-6 sm:px-4 sm:py-6 lg:py-8">
            {/* Category header */}
            <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-base-200 sm:h-14 sm:w-14">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={emojiSrc(categoryIcon)}
                            alt={categoryIcon}
                            width={40}
                            height={40}
                            className="h-8 w-8 sm:h-10 sm:w-10"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold sm:text-3xl">{categoryNameBn}</h1>
                        <p className="text-xs text-base-content/60 sm:text-sm">
                            {bn(items.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
                        </p>
                    </div>
                </div>
            </div>

            {/* Sort bar */}
            <div className="flex items-center justify-end gap-3 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-sm sm:p-4">
                <label htmlFor="sort" className="text-sm text-base-content/60">
                    সাজান
                </label>
                <select
                    id="sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as Sort)}
                    className="select select-sm w-auto border-base-300"
                >
                    <option value="default">ডিফল্ট</option>
                    <option value="price-asc">দাম: কম থেকে বেশি</option>
                    <option value="price-desc">দাম: বেশি থেকে কম</option>
                    <option value="rise">সবচেয়ে বেশি বেড়েছে</option>
                    <option value="fall">সবচেয়ে বেশি কমেছে</option>
                </select>
            </div>

            <p className="text-xs text-base-content/60 sm:text-sm">
                মোট {bn(sorted.length)}টি পণ্য দেখানো হচ্ছে
            </p>

            {/* Product grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {sorted.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </main>
    );
}