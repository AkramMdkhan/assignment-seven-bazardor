"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Category = {
    id: string;
    slug: string;
    nameBn: string;
    icon: string;
};


const emojiSrc = (emoji: string) =>
    `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/${Array.from(emoji)
        .map((ch) => ch.codePointAt(0)!.toString(16))
        .join("-")}.png`;

const CategoryNav = () => {
    const pathname = usePathname();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://api.api-store.workers.dev/api/bazardor/categories")
            .then((res) => res.json())
            .then((data: Category[]) => setCategories(data))
            .catch(() => setCategories([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <nav aria-label="ক্যাটাগরি">
            <ul className="mx-auto flex min-h-12 w-full max-w-7xl snap-x items-center justify-start gap-1 overflow-x-auto px-3 py-2 sm:gap-2 sm:px-6 lg:gap-4 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {loading &&
                    Array.from({ length: 8 }).map((_, i) => (
                        <li key={i} className="shrink-0">
                            <div className="h-8 w-20 animate-pulse rounded-md bg-gray-100" />
                        </li>
                    ))}

                {categories.map((c) => {
                    const href = `/category/${c.slug}`;
                    const active = pathname === href;
                    return (
                        <li key={c.id} className="shrink-0 snap-start">
                            <Link
                                href={href}
                                aria-current={active ? "page" : undefined}
                                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold transition lg:px-4 ${
                                    active
                                        ? "bg-green-700 text-white shadow-sm"
                                        : "text-gray-900 hover:bg-gray-100"
                                }`}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={emojiSrc(c.icon)}
                                    alt={c.icon}
                                    width={20}
                                    height={20}
                                    className="h-5 w-5"
                                />
                                {c.nameBn}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default CategoryNav;