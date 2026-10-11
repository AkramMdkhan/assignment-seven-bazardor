import ProductCard, { type Product } from "./ProductCard";

const API_URL = "https://api.api-store.workers.dev/api/bazardor/products";

const bn = (n: number) => n.toLocaleString("bn-BD");

async function getProducts(): Promise<Product[]> {
    try {
        const res = await fetch(API_URL, { next: { revalidate: 300 } });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("AllProducts fetch error:", err);
        return [];
    }
}

const AllProducts = async () => {
    const products = await getProducts();

    if (products.length === 0) {
        return (
            <section
                id="all-products"
                className="mx-auto w-full max-w-[1216px] scroll-mt-48 px-3 py-6 text-center text-sm text-error sm:px-4"
            >
                পণ্য লোড করা যায়নি
            </section>
        );
    }

    return (
        <section
            id="all-products"
            className="mx-auto w-full max-w-[1216px] scroll-mt-48 px-3 py-4 sm:px-4 sm:py-6 lg:py-8"
        >
            <div className="mb-3 sm:mb-4">
                <h2 className="text-lg font-extrabold sm:text-xl">সব পণ্য</h2>
                <p className="mt-1 text-xs text-base-content/60 sm:text-sm">
                    মোট {bn(products.length)}টি পণ্যের আজকের বাজারদর
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </section>
    );
};

export default AllProducts;