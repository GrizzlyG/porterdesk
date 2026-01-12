"use client";

import { deleteHostel } from "@/lib/actions/hostel";
import { useFormStatus } from "react-dom";

export default function DeleteHostelButton({ hostelId }: { hostelId: string }) {
  const { pending } = useFormStatus();
  return (
    <form
      action={async (formData) => {
        await deleteHostel(formData);
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={hostelId} />
      <button
        type="submit"
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm ml-2 disabled:bg-red-300"
        disabled={pending}
      >
        {pending ? "Deleting..." : "Delete Hostel"}
      </button>
    </form>
  );
}
