import Link from "next/link";

export type Product = {
    id: number;
    slug: string;
    nameBn: string;
    image: string; // emoji
    unit: string;
    today: number;
    change: { dir: "up" | "down" | "flat"; pct: number };
};

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
    });

// Turns an emoji into an Apple-style image URL, e.g. 🍚 -> .../1f35a.png
const emojiSrc = (emoji: string) =>
    `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/${Array.from(emoji)
        .map((ch) => ch.codePointAt(0)!.toString(16))
        .join("-")}.png`;

const ProductCard = ({ product }: { product: Product }) => {
    const { dir, pct } = product.change;

    const badgeClass =
        dir === "up" ? "badge-error" : dir === "down" ? "badge-success" : "badge-ghost";

    const badgeText =
        dir === "flat" ? "— ০.০%" : `${dir === "up" ? "▲" : "▼"} ${bn(Math.abs(pct), 1)}%`;

    return (
        <Link
            href={`/product/${product.slug}`}
            className="card bg-base-100 border border-base-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-green-600 hover:shadow-md"
        >
            <div className="card-body gap-3 p-3 sm:p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-base-200 sm:h-11 sm:w-11">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={emojiSrc(product.image)}
                            alt={product.image}
                            width={24}
                            height={24}
                            className="h-6 w-6"
                        />
                    </div>
                    <div className="min-w-0">
                        <h3 className="card-title truncate text-sm sm:text-base">
                            {product.nameBn}
                        </h3>
                        <p className="text-xs text-base-content/60">
                            প্রতি {UNITS[product.unit] ?? product.unit}
                        </p>
                    </div>
                </div>

                <div className="flex items-end justify-between gap-2">
                    <div>
                        <p className="text-xs text-base-content/60">আজকের দাম</p>
                        <p>
                            <span className="text-lg font-extrabold sm:text-xl">
                                {bn(product.today)}
                            </span>{" "}
                            <span className="text-sm">টাকা</span>
                        </p>
                    </div>
                    <span className={`badge badge-soft font-bold ${badgeClass}`}>
                        {badgeText}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;