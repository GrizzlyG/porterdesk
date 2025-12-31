"use client";

import { createBlock } from "@/lib/actions/block";
import { useState } from "react";
import { useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:bg-indigo-400"
    >
      {pending ? "Adding..." : "Add Block"}
    </button>
  );
};

const BlockForm = ({ hostelId }: { hostelId: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
      >
        Add New Block
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Add New Block
              </h2>
              <form
                action={async (formData) => {
                  await createBlock(formData);
                  setOpen(false);
                }}
                className="flex flex-col gap-4"
              >
                <input type="hidden" name="hostelId" value={hostelId} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Block Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. Block A"
                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <SubmitButton />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlockForm;