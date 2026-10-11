"use client";

import { useEffect, useState } from "react";
import MarqueeText from "react-marquee-text";
import "react-marquee-text/dist/styles.css";

type Product = {
    id: number;
    nameBn: string;
    image: string; // emoji
    unit: string;
    today: number;
    change: { dir: "up" | "down" | "flat"; pct: number };
};

const API_URL = "https://api.api-store.workers.dev/api/bazardor/products";

const UNITS: Record<string, string> = {
    kg: "কেজি",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
};

const bn = (n: number, fraction = 0) =>
    n.toLocaleString("bn-BD", {
        minimumFractionDigits: fraction,
        maximumFractionDigits: fraction,
        useGrouping: false,
    });

// Turns an emoji into an Apple-style image URL, e.g. 🍚 -> .../1f35a.png
const emojiSrc = (emoji: string) =>
    `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/${Array.from(emoji)
        .map((ch) => ch.codePointAt(0)!.toString(16))
        .join("-")}.png`;

const PriceTicker = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");

    useEffect(() => {
        fetch(API_URL)
            .then((res) => {
                if (!res.ok) throw new Error(`Request failed: ${res.status}`);
                return res.json();
            })
            .then((data: Product[]) => {
                setProducts(data);
                setStatus("ready");
            })
            .catch((err) => {
                console.error("PriceTicker fetch error:", err);
                setStatus("error");
            });
    }, []);

    if (status === "loading") {
        return <div className="border-y border-gray-200 py-2 text-center text-xs">দাম লোড হচ্ছে...</div>;
    }

    if (status === "error" || products.length === 0) {
        return (
            <div className="border-y border-gray-200 py-2 text-center text-xs text-red-600">
                দাম লোড করা যায়নি
            </div>
        );
    }

    // Plain inline elements only (no flex), so the package can measure the width
    const content = (
        <span>
            {products.map((p) => {
                const { dir, pct } = p.change;
                return (
                    <span
                        key={p.id}
                        className="inline-block whitespace-nowrap border-r border-gray-200 px-6 lg:px-8"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={emojiSrc(p.image)}
                            alt={p.image}
                            width={20}
                            height={20}
                            className="mr-2 inline-block h-5 w-5 align-middle"
                        />
                        <span className="mr-2 align-middle font-semibold">{p.nameBn}</span>
                        <span className="mr-2 align-middle">
                            {bn(p.today)} টাকা/{UNITS[p.unit] ?? p.unit}
                        </span>
                        {dir === "flat" ? (
                            <span className="align-middle font-bold text-gray-400">– ০%</span>
                        ) : (
                            <span
                                className={`align-middle font-bold ${
                                    dir === "up" ? "text-red-600" : "text-green-600"
                                }`}
                            >
                                {dir === "up" ? "▲" : "▼"} {bn(Math.abs(pct), 1)}%
                            </span>
                        )}
                    </span>
                );
            })}
        </span>
    );

    return (
        <div className="overflow-hidden border-y border-gray-200 bg-white py-2.5 text-sm text-gray-800 sm:py-3 sm:text-base">
            <MarqueeText duration={10} textSpacing="0" direction="right">
                {/* The package types children as string; this cast only silences TypeScript */}
                {content as unknown as string}
            </MarqueeText>
        </div>
    );
};

export default PriceTicker;

