"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

function UpdateSkeleton() {
  return (
    <div className="bg-base-200 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 space-y-2">
          <div className="skeleton h-8 w-56" />
          <div className="skeleton h-4 w-64" />
        </div>
        <div className="card border border-base-300 bg-base-100">
          <div className="card-body gap-4 p-5 sm:p-6">
            <div className="skeleton h-4 w-12" />
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function UpdateForm({
  currentName,
  currentImage,
}: {
  currentName: string;
  currentImage: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(currentName);
  const [imageUrl, setImageUrl] = useState(currentImage);
  const [saving, setSaving] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("নাম খালি রাখা যাবে না।");
      return;
    }

    const trimmedImage = imageUrl.trim();
    if (trimmedImage && !/^https?:\/\//i.test(trimmedImage)) {
      toast.error("ছবির লিংক http:// বা https:// দিয়ে শুরু হতে হবে।");
      return;
    }

    setSaving(true);
    const { error } = await authClient.updateUser({
      name: name.trim(),
      image: trimmedImage || null,
    });
    setSaving(false);

    if (error) {
      toast.error(error.message || "আপডেট করা যায়নি। আবার চেষ্টা করুন।");
      return;
    }

    toast.success("তথ্য সফলভাবে আপডেট হয়েছে।");
    router.push("/profile");
    router.refresh();
  }

  const trimmedPreview = imageUrl.trim();
  const showPreview = /^https?:\/\//i.test(trimmedPreview) && !previewFailed;

  return (
    <div className="bg-base-200 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">তথ্য আপডেট করুন</h1>
          <p className="mt-1 text-sm text-base-content/60">
            আপনার নাম ও ছবি পরিবর্তন করুন।
          </p>
        </div>

        <div className="card border border-base-300 bg-base-100">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="card-body gap-4 p-5 sm:p-6"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium">নাম</label>
              <input
                type="text"
                placeholder="আপনার নাম"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                ছবির লিংক (ঐচ্ছিক)
              </label>
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                className="input input-bordered w-full"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreviewFailed(false);
                }}
              />
              {showPreview && (
                <div className="mt-3 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={trimmedPreview}
                    alt="ছবির প্রিভিউ"
                    referrerPolicy="no-referrer"
                    onError={() => setPreviewFailed(true)}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <span className="text-xs text-base-content/60">প্রিভিউ</span>
                </div>
              )}
              {previewFailed && (
                <p className="mt-2 text-xs text-red-600">
                  এই লিংক থেকে ছবি লোড হয়নি। সরাসরি ছবির লিংক দিন।
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn w-full border-0 bg-green-700 text-white shadow-md hover:bg-green-800"
            >
              {saving && <span className="loading loading-spinner loading-sm" />}
              {saving ? "অপেক্ষা করুন..." : "তথ্য আপডেট করুন"}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/profile"
            className="text-sm text-base-content/60 hover:text-base-content"
          >
            ← প্রোফাইলে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Redirect to sign in if there is no logged-in user
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return <UpdateSkeleton />;
  }

  return (
    <UpdateForm
      currentName={session.user.name ?? ""}
      currentImage={session.user.image ?? ""}
    />
  );
}