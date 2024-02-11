import * as React from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";

import { changeUsername } from "../models/user.server";
import { requireUserId } from "../session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const username = formData.get("username");

  if (typeof username !== "string" || username.length === 0) {
    return json(
      { errors: { username: "New username is required" } },
      { status: 400 }
    );
  }

  try {
    await changeUsername(username, userId);
  } catch (error) {
    if ((error as Error).message === "USERNAME_ALREADY_EXISTS") {
      return json(
        { errors: { username: "Username already exists" } },
        { status: 400 }
      );
    }
  }

  return redirect(`/${username}`);
}

export default function AccountPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const usernameRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors.username) {
      usernameRef.current?.focus();
    }
  }, [actionData]);

  return (
    <main className="mx-auto my-12 flex min-h-full w-full max-w-md flex-col px-8">
      <Form
        method="post"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
        }}
      >
        <div>
          <label className="mt-10 flex w-full flex-col gap-1">
            <span>New username: </span>
            <input
              ref={usernameRef}
              name="username"
              className="flex-1 rounded-md border-2 border-mk px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors.username ? true : undefined}
              aria-errormessage={
                actionData?.errors.username ? "username-error" : undefined
              }
              data-testid="change-username-input"
            />
          </label>
          {actionData?.errors.username && (
            <div className="pt-1 text-mkerror" id="username=error">
              {actionData.errors.username}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="rounded bg-mk px-4 py-2 text-white hover:bg-mk-tertiary active:bg-mk-tertiary"
          disabled={!!navigation.formData}
        >
          {navigation.formData ? (
            <div
              className="spinner-border inline-block h-4 w-4 animate-spin rounded-full border-2"
              role="status"
            ></div>
          ) : (
            "Change username"
          )}
        </button>

        <hr className="my-8" />

        <Link
          to="/password/change"
          className="rounded bg-mk px-4 py-2 text-center text-white hover:bg-mk-tertiary active:bg-mk-tertiary"
        >
          Go to change password form
        </Link>

        <hr className="my-8" />

        <Link
          to="/deletion"
          className="rounded bg-mkerror px-4 py-2 text-center text-mk-text hover:bg-mkerror-muted active:bg-mkerror-muted"
        >
          Delete my account and all trips
        </Link>
      </Form>
    </main>
  );
}
