"use client";

import { registerStudent } from "@/lib/actions/student";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
    >
      {pending ? "Registering..." : "Register"}
    </button>
  );
};

export default function StudentRegistrationForm() {
  const [state, formAction] = useFormState(registerStudent, { success: false, message: "" });
  const [pendingApproval, setPendingApproval] = useState(false);

  if (pendingApproval) {
    return (
      <div className="rounded-md bg-yellow-50 p-4 text-center">
        <p className="text-lg font-medium text-yellow-800">
          Account approval pending. Please wait for admin approval before logging in.
        </p>
      </div>
    );
  }

  return (
    <form
      action={async (formData) => {
        const res = await registerStudent(undefined, formData);
        if (res.success) {
          setPendingApproval(true);
        }
        return res;
      }}
      className="space-y-6"
    >
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
        <label className="block text-sm font-medium text-gray-700">Matric Number</label>
        <input name="matricNumber" type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input name="phone" type="tel" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input name="password" type="password" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input name="dob" type="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select name="type" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
            <option value="RESIDENT">Resident</option>
            <option value="VISITOR">Visitor</option>
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