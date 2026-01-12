"use client";

import { createComplaint } from "@/lib/actions/complaint";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ComplaintForm({ studentId }: { studentId: string | number }) {
  const [state, formAction] = useFormState(createComplaint, {
    success: false,
    message: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.refresh();
      router.push("/dashboard/complaints");
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="flex flex-col gap-4 p-4 bg-white">
      <h1 className="text-xl font-semibold">Submit a Complaint</h1>
      
      <input type="hidden" name="studentId" value={studentId} />
      
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-500">Title</label>
        <input
          type="text"
          name="title"
          required
          className="p-2 border border-gray-300"
          placeholder="Brief title of your complaint"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-500">Description</label>
        <textarea
          name="description"
          required
          rows={4}
          className="p-2 border border-gray-300 resize-none"
          placeholder="Describe your issue in detail..."
        />
      </div>

      <button className="bg-blue-500 text-white p-2 hover:bg-blue-600 transition-colors">
        Submit Complaint
      </button>
    </form>
  );
}