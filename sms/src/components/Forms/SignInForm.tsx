"use client";

import { login } from "@/lib/actions/auth";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import FormInput from "./FormInput";

const LoginButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} className="p-2 w-full" type="submit">
      {pending ? "Logging in..." : "Login"}
    </Button>
  );
};

const SignInForm = () => {
  const [state, formAction] = useFormState(login, undefined);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-transparent outline-none shadow-none hover:bg-indigo-600 text-white">
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogTitle className="text-center text-2xl">Sign In</DialogTitle>
        <DialogDescription>
          Enter your Matric Number or Email to login.
        </DialogDescription>
        <form className="w-full space-y-4" action={formAction}>
          {state?.error && (
            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
              {state.error}
            </p>
          )}
          <div className="p-2">
            <FormInput
              type="text"
              name="identifier"
              width="w-full"
              label="Matric No / Email"
              required={true}
            />
          </div>
          <div className="p-2">
            <FormInput
              type="password"
              name="password"
              width="w-full"
              label="Password"
              required={true}
            />
          </div>

          <LoginButton />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignInForm;
