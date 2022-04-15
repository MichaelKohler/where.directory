import * as React from "react";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { changePassword } from "~/models/user.server";
import { requireUserId, requireUser } from "~/session.server";

interface ActionData {
  errors?: {
    password?: string;
    confirmPassword?: string;
  };
  done?: boolean;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request);
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (typeof password !== "string" || password === "") {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (typeof confirmPassword !== "string" || confirmPassword === "") {
    return json<ActionData>(
      { errors: { confirmPassword: "Password confirmation is required" } },
      { status: 400 }
    );
  }

  if (confirmPassword !== password) {
    return json<ActionData>(
      { errors: { confirmPassword: "Passwords do not match" } },
      { status: 400 }
    );
  }

  const user = await requireUser(request);
  await changePassword(user.email, password);

  return json<ActionData>({ done: true }, { status: 200 });
};

export const meta: MetaFunction = () => {
  return {
    title: "Change Password",
  };
};

export default function ChangePassword() {
  const actionData = useActionData() as ActionData;
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const passwordConfirmRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    } else if (actionData?.errors?.confirmPassword) {
      passwordConfirmRef.current?.focus();
    }

    if (actionData?.done && passwordRef.current && passwordConfirmRef.current) {
      passwordRef.current.value = "";
      passwordConfirmRef.current.value = "";
    }
  }, [actionData]);

  return (
    <main className="my-12 mx-auto flex min-h-full w-full max-w-md flex-col px-8">
      <Form method="post" className="space-y-6">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              ref={passwordRef}
              required
              name="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={actionData?.errors?.password ? true : undefined}
              aria-describedby="password-error"
              className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
            />
            {actionData?.errors?.password && (
              <div className="pt-1 text-red-700" id="password-error">
                {actionData.errors.password}
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <div className="mt-1">
            <input
              id="confirmPassword"
              ref={passwordConfirmRef}
              required
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={
                actionData?.errors?.confirmPassword ? true : undefined
              }
              aria-describedby="password-confirm-error"
              className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
            />
            {actionData?.errors?.confirmPassword && (
              <div className="pt-1 text-red-700" id="password-confirm-error">
                {actionData.errors.confirmPassword}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded bg-slate-600 py-2 px-4 text-white hover:bg-slate-500 focus:bg-slate-500"
        >
          Change password
        </button>

        <div>{actionData?.done && <p>Your password has been changed.</p>}</div>
      </Form>
    </main>
  );
}
