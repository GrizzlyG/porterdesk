"use client";

import { useTransition, useState } from "react";
import { approveStudent } from "@/lib/actions/student";

export default function ApproveButton({ userId }: { userId: number }) {
  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  return (
    <button
      disabled={pending || success}
      className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
      onClick={() => {
        setError("");
        startTransition(async () => {
          const res = await approveStudent(userId);
          if (res.success) setSuccess(true);
          else setError(res.message || "Failed to approve");
        });
      }}
    >
      {success ? "Approved" : pending ? "Approving..." : "Approve"}
      {error && <span className="text-xs text-red-600 ml-2">{error}</span>}
    </button>
  );
}
