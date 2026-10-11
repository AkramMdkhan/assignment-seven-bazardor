"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

// Picks the toast message based on the page the visitor wanted
function getRedirectMessage(path: string) {
  if (path.startsWith("/profile")) {
    return "প্রোফাইল দেখতে সাইন ইন করুন।";
  }
  if (path.startsWith("/product") || path.startsWith("/AllProducts")) {
    return "দাম দেখতে সাইন ইন করুন।";
  }
  return "চালিয়ে যেতে সাইন ইন করুন।";
}

function SignInSkeleton() {
  return (
    <div className="px-4 py-6 sm:py-8">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-5 space-y-2 text-center">
          <div className="skeleton mx-auto h-8 w-40" />
          <div className="skeleton mx-auto h-4 w-64" />
        </div>
        <div className="card border border-base-300 bg-white">
          <div className="card-body gap-4">
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Only allow redirects to pages inside this site
  const redirectParam = searchParams.get("redirect");
  const redirectTo =
    redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
      ? redirectParam
      : "/";

  // Toast when the proxy sent the visitor here from a protected page
  useEffect(() => {
    if (redirectParam) {
      toast.info(getRedirectMessage(redirectTo), { toastId: "protected-route" });
    }
  }, [redirectParam, redirectTo]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validation toasts
    if (!email.trim() || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড দিন।");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("সঠিক ইমেইল দিন।");
      return;
    }

    setLoading(true);

    const { error } = await authClient.signIn.email({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
      return;
    }

    toast.success("সফলভাবে সাইন ইন হয়েছে।");
    router.push(redirectTo);
    router.refresh();
  }

  async function handleSocial(provider: "google" | "github") {
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: redirectTo,
    });

    if (error) {
      toast.error(error.message || "সোশ্যাল লগইন করা যায়নি।");
    }
  }

  return (
    <div className="px-4 py-6 sm:py-8">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-5 text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">সাইন ইন</h1>
          <p className="mt-2 text-sm text-base-content/60">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
          </p>
        </div>

        <div className="card border border-base-300 bg-white">
          <form onSubmit={handleSubmit} noValidate className="card-body gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">ইমেইল</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                পাসওয়ার্ড
              </label>
              <input
                type="password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn w-full border-0 bg-green-700 text-white shadow-md hover:bg-green-800"
              disabled={loading}
            >
              {loading && <span className="loading loading-spinner loading-sm" />}
              {loading ? "অপেক্ষা করুন..." : "সাইন ইন"}
            </button>

            <div className="divider my-0 text-xs">অথবা</div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocial("google")}
                className="btn btn-outline btn-sm h-10 px-2 text-xs font-medium sm:text-sm"
              >
                <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                Google দিয়ে চালিয়ে যান
              </button>

              <button
                type="button"
                onClick={() => handleSocial("github")}
                className="btn btn-outline btn-sm h-10 px-2 text-xs font-medium sm:text-sm"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
                </svg>
                GitHub দিয়ে চালিয়ে যান
              </button>
            </div>

            <p className="text-center text-sm">
              অ্যাকাউন্ট নেই?{" "}
              <Link
                href="/sign-up"
                className="font-medium text-green-700 hover:underline"
              >
                সাইন আপ করুন
              </Link>
            </p>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-base-content/60 hover:text-base-content">
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  // useSearchParams needs a Suspense boundary in the App Router
  return (
    <Suspense fallback={<SignInSkeleton />}>
      <SignInForm />
    </Suspense>
  );
}