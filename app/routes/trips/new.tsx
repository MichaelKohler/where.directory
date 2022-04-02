import * as React from "react";
import { Form, json, redirect, useActionData, useTransition } from "remix";
import type { ActionFunction } from "remix";
import Alert from "@reach/alert";

import { createTrip } from "~/models/trip.server";
import { requireUserId } from "~/session.server";

type ActionData = {
  errors?: {
    destination?: string;
    country?: string;
    description?: string;
    flights?: string;
    lat?: string;
    long?: string;
    from?: string;
    to?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const destination = formData.get("destination");
  const country = formData.get("country");
  const description = formData.get("description");
  const flights = formData.get("flights");
  const lat = formData.get("lat");
  const long = formData.get("long");
  const from = formData.get("from");
  const to = formData.get("to");

  if (typeof from !== "string" || from.length === 0) {
    return json<ActionData>(
      { errors: { from: "From date is required and must be text" } },
      { status: 400 }
    );
  }

  if (typeof to !== "string" || to.length === 0) {
    return json<ActionData>(
      { errors: { to: "To date is required and must be text" } },
      { status: 400 }
    );
  }

  if (typeof destination !== "string" || destination.length === 0) {
    return json<ActionData>(
      { errors: { destination: "Destination is required" } },
      { status: 400 }
    );
  }

  if (typeof country !== "string" || country.length === 0) {
    return json<ActionData>(
      { errors: { country: "Country is required" } },
      { status: 400 }
    );
  }

  if (typeof description !== "string") {
    return json<ActionData>(
      { errors: { description: "Description must be text" } },
      { status: 400 }
    );
  }

  if (typeof flights !== "string" || flights.length === 0) {
    return json<ActionData>(
      { errors: { flights: "Flights is required" } },
      { status: 400 }
    );
  }

  if (typeof lat !== "string" || lat.length === 0) {
    return json<ActionData>(
      { errors: { lat: "Latitude is required" } },
      { status: 400 }
    );
  }

  if (typeof long !== "string" || long.length === 0) {
    return json<ActionData>(
      { errors: { long: "Longitude is required" } },
      { status: 400 }
    );
  }

  const trip = await createTrip({
    destination,
    country,
    description,
    flights,
    lat,
    long,
    from,
    to,
    userId,
  });

  return redirect(`/trips/${trip.id}`);
};

export default function NewTripPage() {
  const actionData = useActionData() as ActionData;
  const transition = useTransition();

  const fromRef = React.useRef<HTMLInputElement>(null);
  const toRef = React.useRef<HTMLInputElement>(null);
  const destinationRef = React.useRef<HTMLInputElement>(null);
  const countryRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const flightsRef = React.useRef<HTMLInputElement>(null);
  const latRef = React.useRef<HTMLInputElement>(null);
  const longRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.to) {
      toRef.current?.focus();
    } else if (actionData?.errors?.from) {
      fromRef.current?.focus();
    } else if (actionData?.errors?.destination) {
      destinationRef.current?.focus();
    } else if (actionData?.errors?.country) {
      countryRef.current?.focus();
    } else if (actionData?.errors?.description) {
      descriptionRef.current?.focus();
    } else if (actionData?.errors?.flights) {
      flightsRef.current?.focus();
    } else if (actionData?.errors?.lat) {
      latRef.current?.focus();
    } else if (actionData?.errors?.long) {
      longRef.current?.focus();
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
        <label className="flex w-full flex-col gap-1">
          <span>From: </span>
          <input
            ref={fromRef}
            type="date"
            name="from"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.from ? true : undefined}
            aria-errormessage={
              actionData?.errors?.from ? "from-error" : undefined
            }
            data-testId="new-trip-from-input"
          />
        </label>
        {actionData?.errors?.from && (
          <Alert className="pt-1 text-red-700" id="from=error">
            {actionData.errors.from}
          </Alert>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Until: </span>
          <input
            ref={toRef}
            type="date"
            name="to"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.to ? true : undefined}
            aria-errormessage={actionData?.errors?.to ? "to-error" : undefined}
            data-testId="new-trip-to-input"
          />
        </label>
        {actionData?.errors?.to && (
          <Alert className="pt-1 text-red-700" id="to=error">
            {actionData.errors.to}
          </Alert>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Destination: </span>
          <input
            ref={destinationRef}
            name="destination"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.destination ? true : undefined}
            aria-errormessage={
              actionData?.errors?.destination ? "destination-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.destination && (
          <Alert className="pt-1 text-red-700" id="destination=error">
            {actionData.errors.destination}
          </Alert>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Country: </span>
          <input
            ref={countryRef}
            name="country"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.country ? true : undefined}
            aria-errormessage={
              actionData?.errors?.country ? "country-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.country && (
          <Alert className="pt-1 text-red-700" id="country=error">
            {actionData.errors.country}
          </Alert>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Description: </span>
          <textarea
            ref={descriptionRef}
            name="description"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.description ? true : undefined}
            aria-errormessage={
              actionData?.errors?.description ? "description-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.description && (
          <Alert className="pt-1 text-red-700" id="description=error">
            {actionData.errors.description}
          </Alert>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Flights: </span>
          <input
            ref={flightsRef}
            type="number"
            name="flights"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.flights ? true : undefined}
            aria-errormessage={
              actionData?.errors?.flights ? "flights-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.flights && (
          <Alert className="pt-1 text-red-700" id="flights=error">
            {actionData.errors.flights}
          </Alert>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Latitude: </span>
          <input
            ref={latRef}
            type="float"
            name="lat"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.lat ? true : undefined}
            aria-errormessage={
              actionData?.errors?.lat ? "lat-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.lat && (
          <Alert className="pt-1 text-red-700" id="lat=error">
            {actionData.errors.lat}
          </Alert>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Longitude: </span>
          <input
            ref={longRef}
            type="float"
            name="long"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.long ? true : undefined}
            aria-errormessage={
              actionData?.errors?.long ? "long-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.long && (
          <Alert className="pt-1 text-red-700" id="long=error">
            {actionData.errors.long}
          </Alert>
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
          "Save"
        )}
      </button>
    </Form>
  );
}
