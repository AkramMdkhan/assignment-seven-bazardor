"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import CategoryNav from "./CategoryNav";

const Navbar = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [open, setOpen] = useState(false);
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const date = new Date().toLocaleDateString("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
    });

    // Close the card on outside click or Esc
    useEffect(() => {
        if (!open) return;

        function onClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }

        document.addEventListener("mousedown", onClickOutside);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onClickOutside);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    async function handleSignOut() {
        setOpen(false);

        const { error } = await authClient.signOut();

        if (error) {
            toast.error(error.message || "সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
            return;
        }

        toast.success("সফলভাবে সাইন আউট হয়েছে।");
        router.push("/");
        router.refresh();
    }

    const user = session?.user;
    const firstName = (user?.name || user?.email || "").split(" ")[0];
    const initial = (user?.name || user?.email || "?").charAt(0).toUpperCase();
    const showImage = !!user?.image && user.image !== failedSrc;

    return (
        <header className="bg-white">
            {/* 1. Logo + auth area */}
            <div className="border-b border-gray-100">
                <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-3 sm:h-16 sm:px-6 lg:px-8">
                    <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                        <Image
                            src="/logo-icon.png"
                            alt="বাজার দর"
                            width={20}
                            height={20}
                            className="h-9 w-9 shrink-0 rounded-xl sm:h-10 sm:w-10 lg:h-11 lg:w-11 bg-green-700"
                            priority
                        />
                        <div className="min-w-0 leading-tight">
                            <div className="text-base font-bold text-gray-900 sm:text-lg lg:text-xl">
                                বাজার দর
                            </div>
                            <div className="truncate text-[10px] text-gray-500 sm:text-[11px] lg:text-xs">
                                {date}
                            </div>
                        </div>
                    </Link>

                    {isPending ? (
                        // Skeleton while the session loads
                        <div className="flex shrink-0 items-center gap-2">
                            <div className="skeleton h-8 w-8 rounded-lg sm:h-9 sm:w-9" />
                            <div className="skeleton h-4 w-16 rounded" />
                        </div>
                    ) : !user ? (
                        // Logged out
                        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
                            <Link
                                href="/sign-in"
                                className="px-2 text-xs font-semibold text-gray-900 hover:text-green-700 sm:text-sm"
                            >
                                সাইন ইন
                            </Link>
                            <Link
                                href="/sign-up"
                                className="rounded-lg bg-green-700 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition hover:bg-green-800 sm:px-4 sm:py-2 sm:text-sm"
                            >
                                সাইন আপ
                            </Link>
                        </div>
                    ) : (
                        // Logged in: avatar + name, click to open the card
                        <div ref={menuRef} className="relative shrink-0">
                            <button
                                type="button"
                                onClick={() => setOpen((v) => !v)}
                                aria-haspopup="menu"
                                aria-expanded={open}
                                className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-gray-50"
                            >
                                {showImage ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={user.image as string}
                                        alt={user.name || "Profile"}
                                        referrerPolicy="no-referrer"
                                        onError={() => setFailedSrc(user.image ?? null)}
                                        className="h-8 w-8 rounded-lg object-cover sm:h-9 sm:w-9"
                                    />
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-700 text-sm font-bold text-white sm:h-9 sm:w-9">
                                        {initial}
                                    </div>
                                )}
                                <span className="max-w-24 truncate text-xs font-medium text-gray-900 sm:text-sm">
                                    {firstName}
                                </span>
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-3 w-3 text-gray-500"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M7 10l5 5 5-5z" />
                                </svg>
                            </button>

                            {open && (
                                <div
                                    role="menu"
                                    className="absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl"
                                >
                                    {/* Name + email */}
                                    <div className="px-1 pb-2">
                                        <div className="truncate text-sm font-semibold text-gray-900">
                                            {user.name}
                                        </div>
                                        <div className="truncate text-xs text-gray-500">
                                            {user.email}
                                        </div>
                                    </div>

                                    {/* Menu items */}
                                    <ul className="space-y-0.5">
                                        <li>
                                            <Link
                                                href="/profile"
                                                role="menuitem"
                                                onClick={() => setOpen(false)}
                                                className="flex items-center gap-2 rounded-md px-1 py-1.5 text-sm text-gray-800 hover:bg-gray-50"
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    className="h-4 w-4 text-gray-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    aria-hidden="true"
                                                >
                                                    <circle cx="12" cy="8" r="4" />
                                                    <path d="M4 21a8 8 0 0 1 16 0" />
                                                </svg>
                                                আমার প্রোফাইল
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                type="button"
                                                role="menuitem"
                                                onClick={handleSignOut}
                                                className="flex w-full items-center gap-2 rounded-md px-1 py-1.5 text-left text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M9 14 4 9l5-5" />
                                                    <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
                                                </svg>
                                                সাইন আউট
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <CategoryNav />
        </header>
    );
};

export default Navbar;