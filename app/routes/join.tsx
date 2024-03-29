import * as React from "react";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";

import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from "../models/user.server";
import { getUserId, createUserSession } from "../session.server";
import { safeRedirect, validateEmail } from "../utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/trips");

  const errors = {
    email: null,
    password: null,
    username: null,
  };

  if (!validateEmail(email)) {
    return json(
      { errors: { ...errors, email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { ...errors, password: "Password is required" } },
      { status: 400 }
    );
  }

  if (typeof username !== "string" || username.length === 0) {
    return json(
      { errors: { ...errors, password: "Username is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { ...errors, password: "Password is too short" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      { errors: { ...errors, email: "A user already exists with this email" } },
      { status: 400 }
    );
  }

  const existingUsername = await getUserByUsername(email);
  if (existingUsername) {
    return json(
      {
        errors: { ...errors, username: "A user already exists with username" },
      },
      { status: 400 }
    );
  }

  const user = await createUser(email, password, username);

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  });
}

export function meta(): ReturnType<MetaFunction> {
  return [
    {
      title: "Sign Up",
    },
  ];
}

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const usernameRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors.password) {
      passwordRef.current?.focus();
    } else if (actionData?.errors.username) {
      usernameRef.current?.focus();
    }
  }, [actionData]);

  return (
    <main className="mx-auto my-12 flex min-h-full w-full max-w-md flex-col px-8">
      <Form method="post" className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-mk-text"
          >
            Email address
          </label>
          <div className="mt-1">
            <input
              ref={emailRef}
              id="email"
              required
              autoFocus={true}
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={actionData?.errors.email ? true : undefined}
              aria-describedby="email-error"
              className="w-full rounded border border-mk-text px-2 py-1 text-lg"
            />
            {actionData?.errors.email && (
              <div className="pt-1 text-mkerror" id="email-error">
                {actionData.errors.email}
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-mk-text"
          >
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              ref={passwordRef}
              name="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={actionData?.errors.password ? true : undefined}
              aria-describedby="password-error"
              className="w-full rounded border border-mk-text px-2 py-1 text-lg"
            />
            {actionData?.errors.password && (
              <div className="pt-1 text-mkerror" id="password-error">
                {actionData.errors.password}
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-mk-text"
          >
            Username
          </label>
          <div className="mt-1">
            <input
              ref={usernameRef}
              id="username"
              required
              name="username"
              aria-invalid={actionData?.errors.username ? true : undefined}
              aria-describedby="username-error"
              className="w-full rounded border border-mk-text px-2 py-1 text-lg"
            />
            {actionData?.errors.username && (
              <div className="pt-1 text-mkerror" id="username-error">
                {actionData.errors.username}
              </div>
            )}
          </div>
        </div>

        <input type="hidden" name="redirectTo" value={redirectTo} />
        <button
          type="submit"
          className="w-full rounded bg-mk px-4 py-2 text-white hover:bg-mk-tertiary focus:bg-mk-tertiary"
        >
          Create Account
        </button>
        <div className="flex items-center justify-center">
          <div className="text-center text-sm text-mk-text">
            Already have an account?{" "}
            <Link
              className="text-mk underline"
              to={{
                pathname: "/login",
                search: searchParams.toString(),
              }}
            >
              Log in
            </Link>
          </div>
        </div>
      </Form>
    </main>
  );
}
