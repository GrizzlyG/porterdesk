"use client";

import { assignStudent, removeStudent } from "@/lib/actions/room";
import { Bedspace, student } from "@prisma/client";
import { UserMinus, UserPlus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";

type BedspaceWithStudent = Bedspace & { student: student | null };

const SubmitButton = ({ icon: Icon, label }: { icon: any; label?: string }) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="p-1 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-50"
      title={label}
    >
      {pending ? (
        <span className="loading loading-spinner loading-xs text-xs">...</span>
      ) : (
        <Icon size={16} />
      )}
    </button>
  );
};

export default function BedspaceAssignment({
  bedspace,
  availableStudents,
}: {
  bedspace: BedspaceWithStudent;
  availableStudents: student[];
}) {
  const pathname = usePathname();
  const [isEditing, setIsEditing] = useState(false);

  if (bedspace.student) {
    return (
      <div className="flex justify-between items-center text-xs mt-1 bg-indigo-50 p-1 rounded border border-indigo-100">
        <span
          className="font-medium truncate max-w-[100px] text-indigo-900"
          title={`${bedspace.student.first_name} ${bedspace.student.last_name}`}
        >
          {bedspace.student.first_name} {bedspace.student.last_name}
        </span>
        <form action={removeStudent}>
          <input type="hidden" name="bedspaceId" value={bedspace.id} />
          <input type="hidden" name="path" value={pathname} />
          <SubmitButton icon={UserMinus} label="Remove Student" />
        </form>
      </div>
    );
  }

  if (isEditing) {
    return (
      <form
        action={async (formData) => {
          await assignStudent(formData);
          setIsEditing(false);
        }}
        className="mt-1 flex gap-1 items-center"
      >
        <input type="hidden" name="bedspaceId" value={bedspace.id} />
        <input type="hidden" name="path" value={pathname} />
        <select
          name="studentId"
          className="text-xs border rounded p-1 w-full max-w-[120px] focus:ring-1 focus:ring-indigo-500 outline-none"
          required
          defaultValue=""
        >
          <option value="" disabled>
            Select Student
          </option>
          {availableStudents.map((s) => (
            <option key={s.id} value={s.id}>
              {s.first_name} {s.last_name} ({s.matricNumber})
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-indigo-600 text-white text-xs px-2 py-1 rounded hover:bg-indigo-700"
        >
          OK
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="text-xs text-gray-500 px-1 hover:text-gray-700"
        >
          X
        </button>
      </form>
    );
  }

  return (
    <div className="mt-1">
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-1 text-xs text-indigo-600 hover:underline font-medium"
      >
        <UserPlus size={14} />
        Assign Student
      </button>
    </div>
  );
}
