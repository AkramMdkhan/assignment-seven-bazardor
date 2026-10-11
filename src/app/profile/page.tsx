"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

type ProfileUser = {
  name: string;
  email: string;
  image?: string | null;
};

function ProfileSkeleton() {
  return (
    <div className="bg-base-200 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 space-y-2">
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-4 w-72" />
        </div>

        <div className="card border border-base-300 bg-base-100">
          <div className="card-body flex-row items-center justify-between gap-4 p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="skeleton h-16 w-16 shrink-0 rounded-xl sm:h-20 sm:w-20" />
              <div className="space-y-2">
                <div className="skeleton h-5 w-32" />
                <div className="skeleton h-4 w-44" />
              </div>
            </div>
            <div className="skeleton h-10 w-24 rounded-lg" />
          </div>
        </div>

        <div className="card mt-5 border border-base-300 bg-base-100">
          <div className="card-body gap-4 p-5 sm:p-6">
            <div className="skeleton h-6 w-16" />
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileView({
  user,
  onSignOut,
}: {
  user: ProfileUser;
  onSignOut: () => void;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const initial = (user.name || user.email || "?").charAt(0).toUpperCase();
  const showImage = !!user.image && user.image !== failedSrc;

  return (
    <div className="bg-base-200 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">আমার প্রোফাইল</h1>
          <p className="mt-1 text-sm text-base-content/60">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        {/* Account card */}
        <div className="card border border-base-300 bg-base-100">
          <div className="card-body flex-row items-center justify-between gap-4 p-5 sm:p-6">
            <div className="flex min-w-0 items-center gap-4">
              {showImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image as string}
                  alt={user.name || "Profile"}
                  referrerPolicy="no-referrer"
                  onError={() => setFailedSrc(user.image ?? null)}
                  className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-green-700 text-2xl font-bold text-white sm:h-20 sm:w-20 sm:text-3xl">
                  {initial}
                </div>
              )}
              <div className="min-w-0">
                <div className="truncate text-lg font-semibold sm:text-xl">
                  {user.name}
                </div>
                <div className="truncate text-sm text-base-content/60 sm:text-base">
                  {user.email}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onSignOut}
              className="btn btn-outline btn-sm h-10 shrink-0 border-red-500 text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white"
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
          </div>
        </div>

        {/* Info card */}
        <div className="card mt-5 border border-base-300 bg-base-100">
          <div className="card-body gap-4 p-5 sm:p-6">
            <h2 className="text-lg font-semibold">তথ্য</h2>

            <div className="mt-2">
              <label className="mb-1.5 block text-sm font-medium">নাম</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={user.name}
                readOnly
              />
            </div>

            <Link
              href="/profile-update"
              className="btn w-full border-0 bg-green-700 text-white shadow-md hover:bg-green-800"
            >
              আপডেট
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const signingOut = useRef(false);

  // Redirect to sign in if there is no logged-in user
  useEffect(() => {
    if (!isPending && !session && !signingOut.current) {
      router.replace("/sign-in");
    }
  }, [isPending, session, router]);

  async function handleSignOut() {
    signingOut.current = true;

    const { error } = await authClient.signOut();

    if (error) {
      signingOut.current = false;
      toast.error(error.message || "সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
      return;
    }

    toast.success("সফলভাবে সাইন আউট হয়েছে।");
    router.push("/");
    router.refresh();
  }

  if (isPending || !session) {
    return <ProfileSkeleton />;
  }

  return <ProfileView user={session.user} onSignOut={handleSignOut} />;
}