import ProductCard, { type Product } from "./ProductCard";

const API_URL = "https://api.api-store.workers.dev/api/bazardor/products";

async function getProducts(): Promise<Product[]> {
    try {
        const res = await fetch(API_URL, { next: { revalidate: 300 } });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("PriceMovers fetch error:", err);
        return [];
    }
}

const Group = ({
    title,
    dir,
    items,
}: {
    title: string;
    dir: "up" | "down";
    items: Product[];
}) => {
    if (items.length === 0) return null;
    return (
        <div>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold sm:mb-4 sm:text-xl">
                <span className={`text-sm ${dir === "up" ? "text-error" : "text-success"}`}>
                    {dir === "up" ? "▲" : "▼"}
                </span>
                {title}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {items.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>
    );
};

const PriceMovers = async () => {
    const products = await getProducts();

    // Biggest rises first
    const rising = products
        .filter((p) => p.change.dir === "up")
        .sort((a, b) => b.change.pct - a.change.pct)
        .slice(0, 6);

    // Biggest falls first (pct is negative for falling prices)
    const falling = products
        .filter((p) => p.change.dir === "down")
        .sort((a, b) => a.change.pct - b.change.pct)
        .slice(0, 6);

    if (rising.length === 0 && falling.length === 0) {
        return (
            <section className="mx-auto w-full max-w-[1216px] px-3 py-6 text-center text-sm text-error sm:px-4">
                দাম লোড করা যায়নি
            </section>
        );
    }

    return (
        <section className="mx-auto w-full max-w-[1216px] space-y-8 px-3 py-4 sm:space-y-10 sm:px-4 sm:py-6 lg:py-8">
            <Group title="আজ দাম বেড়েছে" dir="up" items={rising} />
            <Group title="আজ দাম কমেছে" dir="down" items={falling} />
        </section>
    );
};

export default PriceMovers;