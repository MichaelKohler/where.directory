import styles from "mapbox-gl/dist/mapbox-gl.css";
import invariant from "tiny-invariant";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import TripForm from "~/components/form";
import type { ActionData } from "~/components/form";
import { getTrip, updateTrip } from "~/models/trip.server";
import type { Trip, TripClientResponse } from "~/models/trip.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  trip: Trip;
  mapboxToken: string;
};

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.tripId, "tripId not found");

  const trip = await getTrip({ userId, id: params.tripId });
  if (!trip) {
    throw new Response("Not Found", { status: 404 });
  }

  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN || "";

  return json<LoaderData>({ trip, mapboxToken });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const id = formData.get("id");
  const destination = formData.get("destination");
  const country = formData.get("country");
  const description = formData.get("description");
  const flights = formData.get("flights");
  const lat = formData.get("lat");
  const long = formData.get("long");
  const from = formData.get("from");
  const to = formData.get("to");

  if (typeof id !== "string" || id.length === 0) {
    return json<ActionData>(
      {
        errors: { generic: "ID is required. This is a bug with the website!" },
      },
      { status: 400 }
    );
  }

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

  const existingTrip = await getTrip({
    userId,
    id,
  });

  if (!existingTrip) {
    return json<ActionData>(
      { errors: { generic: "Trip not found." } },
      { status: 404 }
    );
  }

  const trip = await updateTrip({
    id,
    destination,
    country,
    description,
    flights,
    lat,
    long,
    from,
    to,
  });

  return redirect(`/trips/${trip.id}`);
};

export default function EditTripPage() {
  const data = useLoaderData() as LoaderData;

  // Dates get serialized and therefore we can't use the Trip type directly
  const trip = data.trip as TripClientResponse;

  return <TripForm initialData={trip} />;
}
