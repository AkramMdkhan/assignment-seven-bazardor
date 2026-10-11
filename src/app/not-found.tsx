import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-[1216px] flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
      <div className="text-6xl font-extrabold text-green-700 sm:text-8xl">৪০৪</div>

      <h1 className="mt-4 text-xl font-bold sm:text-3xl">
        পেজটি খুঁজে পাওয়া যায়নি
      </h1>

      <p className="mt-2 max-w-md text-sm text-base-content/60 sm:text-base">
        আপনি যে পেজটি খুঁজছেন সেটি নেই, সরানো হয়েছে অথবা লিংকটি ভুল।
      </p>

      <Link
        href="/"
        className="btn mt-6 border-0 bg-green-700 text-white shadow-md hover:bg-green-800"
      >
        হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}