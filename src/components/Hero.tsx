import Image from "next/image";

const getBengaliDate = () =>
    new Date().toLocaleDateString("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
    });

const Hero = () => {
    return (
        <section className="mx-auto w-full max-w-[1216px] px-3 py-4 sm:px-4 sm:py-6 lg:py-8">
            <div className="relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-green-100 bg-white px-4 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:rounded-3xl sm:px-8 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
                {/* Text side */}
                <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
                    <span
                        suppressHydrationWarning
                        className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 sm:text-sm"
                    >
                        {getBengaliDate()}
                    </span>

                    <h1 className="mt-3 text-2xl font-extrabold leading-snug text-gray-900 min-[400px]:text-3xl md:text-4xl lg:text-5xl">
                        আজকের বাজারের দাম এক নজরে
                    </h1>

                    <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:mt-4 sm:text-base">
                        চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়,
                        সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
                    </p>

                    <a
                        href="#all-products"
                        className="mt-5 inline-block w-full rounded-lg bg-green-700 px-5 py-2.5 text-center text-sm font-bold text-white shadow-md transition hover:bg-green-800 sm:mt-6 sm:w-auto sm:text-base"
                    >
                        সব পণ্য দেখুন
                    </a>
                </div>

                {/* Image side: below the text on phones, to the right from tablet up */}
                <div className="flex shrink-0 justify-center sm:justify-end">
                    <Image
                        src="/bazar-hero.png"
                        alt="ফল ও সবজির ঝুড়ি"
                        width={260}
                        height={220}
                        priority
                        sizes="(max-width: 640px) 160px, (max-width: 768px) 176px, (max-width: 1024px) 208px, 256px"
                        className="h-auto w-40 sm:w-44 md:w-52 lg:w-60 xl:w-64"
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;



