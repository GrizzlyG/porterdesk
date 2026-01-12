"use client";

import StudentRegistrationForm from "@/components/Forms/StudentRegistrationForm";

export default function StudentRegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Student Registration</h1>
        <StudentRegistrationForm />
      </div>
    </div>
  );
}
