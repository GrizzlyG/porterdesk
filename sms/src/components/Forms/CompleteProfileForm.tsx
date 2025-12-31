"use client";

import { completeStudentProfile } from "@/lib/actions/student";
import { User } from "@/lib/types";
import { useFormState, useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
    >
      {pending ? "Saving..." : "Save and Complete Profile"}
    </button>
  );
};

export default function CompleteProfileForm({ user }: { user: User }) {
  const [state, formAction] = useFormState(completeStudentProfile, { success: false, message: "" });

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="userId" value={user.id} />
      {state && !state.success && state.message && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">{state.message}</p>
        </div>
      )}
       {state && state.success && state.message && (
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">{state.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input name="firstName" type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input name="lastName" type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input name="phone" type="tel" defaultValue={user.phone} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input name="dob" type="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Level</label>
          <select name="level" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
            <option value="PRIMARY">Primary</option>
            <option value="SECONDARY">Secondary</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select name="sex" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            name="address"
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          />
        </div>
      </div>

      <div>
        <SubmitButton />
      </div>
    </form>
  );
}