"use client";

import { createNotice } from "@/lib/actions/notice";
import { useState } from "react";
import { useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:bg-indigo-400 w-full"
    >
      {pending ? "Creating..." : "Create Notice"}
    </button>
  );
};

const NoticeForm = () => {
  const [open, setOpen] = useState(false);

  // Enum values from schema
  const noticeTypes = ["UNIVERSITY", "HOSTEL", "INFORMAL"];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
      >
        Add New Notice
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Create Notice
              </h2>
              <form
                action={async (formData) => {
                  const res = await createNotice(formData);
                  if (res.success) {
                    setOpen(false);
                    alert(res.message);
                  } else {
                    alert(res.message);
                  }
                }}
                className="flex flex-col gap-4"
                encType="multipart/form-data"
              >
                {/* Optional Blog Image / Flyer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blog Image / Flyer (optional)</label>
                  <input
                    name="image"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                {/* Headline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                  <input
                    name="headline"
                    type="text"
                    required
                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                {/* Subhead */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subhead (optional)</label>
                  <input
                    name="subhead"
                    type="text"
                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                {/* Body */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                  <textarea
                    name="body"
                    required
                    rows={5}
                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                {/* Optional PS */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">P.S. (optional)</label>
                  <input
                    name="ps"
                    type="text"
                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    required
                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="" disabled defaultValue="">Select Type</option>
                    {noticeTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Optional Upload File */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload File (PDF/Flyer, optional)</label>
                  <input
                    name="file"
                    type="file"
                    accept="application/pdf,image/png,image/jpeg,image/jpg"
                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                {/* Visibility */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                  <div className="flex flex-col space-y-2">
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" name="visibleToManagers" className="rounded text-indigo-600 focus:ring-indigo-500" />
                      <span>Visible to Managers</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" name="visibleToPorters" className="rounded text-indigo-600 focus:ring-indigo-500" />
                      <span>Visible to Porters</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" name="visibleToStudents" className="rounded text-indigo-600 focus:ring-indigo-500" />
                      <span>Visible to Students</span>
                    </label>
                  </div>
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

export default NoticeForm;
