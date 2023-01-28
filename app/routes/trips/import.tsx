import * as React from "react";
import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";

import { createTrips } from "../../models/trip.server";
import type { Trip } from "../../models/trip.server";
import { requireUserId } from "../../session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const jsonToImport = formData.get("json");

  if (typeof jsonToImport !== "string" || jsonToImport.length === 0) {
    return json({ errors: { json: "JSON is required" } }, { status: 400 });
  }

  let data: Trip[] = [];
  try {
    data = JSON.parse(jsonToImport);
  } catch (error) {
    return json({ errors: { json: "JSON must be valid" } }, { status: 400 });
  }

  try {
    await createTrips(data, userId);
  } catch (error) {
    return json(
      {
        errors: {
          json: "Trips could not be imported. Please make sure that all your trips are specifying all fields with the right data type.",
        },
      },
      { status: 400 }
    );
  }

  return redirect("/trips");
}

export default function ImportTripPage() {
  const actionData = useActionData<typeof action>();
  const transition = useTransition();

  const jsonRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors.json) {
      jsonRef.current?.focus();
    }
  }, [actionData]);

  return (
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
        <p>
          The import format must be strictly abided by, otherwise the import
          will fail half way through. All fields are required. Please note the
          data types. Example:
        </p>
        <pre className="mt-3">
          {"[{"}
          <br />
          {"  "}"destination": "Berlin",
          <br />
          {"  "}"country": "DE",{""}
          <br />
          {"  "}"from": "2022-01-01",{""}
          <br />
          {"  "}"to": "2022-01-02",{""}
          <br />
          {"  "}"description": "Can be empty string, but must be provided!",
          {""}
          <br />
          {"  "}"flights": 0,{""}
          <br />
          {"  "}"lat": 52.51,{""}
          <br />
          {"  "}"long": 13.40{""}
          <br />
          {"}]"}
        </pre>

        <label className="mt-10 flex w-full flex-col gap-1">
          <span>JSON: </span>
          <textarea
            ref={jsonRef}
            name="json"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-xs leading-loose"
            rows={10}
            aria-invalid={actionData?.errors.json ? true : undefined}
            aria-errormessage={
              actionData?.errors.json ? "json-error" : undefined
            }
            data-testid="trip-import-json-input"
          />
        </label>
        {actionData?.errors.json && (
          <div className="pt-1 text-red-700" id="json=error">
            {actionData.errors.json}
          </div>
        )}
      </div>
      <button
        type="submit"
        className="rounded bg-slate-600 py-2 px-4 text-white hover:bg-slate-500 active:bg-slate-500"
        disabled={!!transition.submission}
      >
        {transition.submission ? (
          <div
            className="spinner-border inline-block h-4 w-4 animate-spin rounded-full border-2"
            role="status"
          ></div>
        ) : (
          "Import"
        )}
      </button>
    </Form>
  );
}
