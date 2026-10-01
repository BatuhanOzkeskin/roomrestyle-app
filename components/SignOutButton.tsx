"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton({
  className = "text-sm text-ink-muted transition hover:text-ink",
}: {
  className?: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
      }}
      className={className}
    >
      Çıkış yap
    </button>
  );
}
