"use client";
import FormInput from "@/components/Forms/FormInput";
import FormModal from "@/components/Forms/FormModal";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
// ...existing code...
import { useRef, useState } from "react";

const AddSubjectForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (formData: FormData) => {
    const { error, msg } = await addSubjectAction(formData);
    if (error) {
      toast({
        title: error,
        description: "Failed to added New Course",
        variant: "destructive",
      });
    }
    if (msg) {
      formRef.current!.reset();
      const today = new Date();
      toast({ title: msg, description: `A Course Added at ${today}` });
    }
  };

  return (
    <FormModal table="Subjects">
      <form ref={formRef} action={handleAction}>
        <div className="w-full">
          <FormInput
            type="text"
            name="name"
            label="Subject Name"
            required={true}
            width="w-full"
          />
          <FormInput
            type="number"
            name="code"
            label="Subject Code"
            required={true}
            width="w-full"
          />
        </div>
        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading ? "Adding..." : "Add Course"}
        </Button>
      </form>
    </FormModal>
  );
};

export default AddSubjectForm;
