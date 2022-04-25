import styles from "mapbox-gl/dist/mapbox-gl.css";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import TripForm from "~/components/form";
import type { ActionData, LoaderData } from "~/components/form";
import { createTrip } from "~/models/trip.server";
import { requireUserId } from "~/session.server";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const loader: LoaderFunction = async () => {
  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN || "";

  return json<LoaderData>({ mapboxToken });
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
  const secret = formData.get("secret") === "on";

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
    secret,
    userId,
  });

  return redirect(`/trips/${trip.id}`);
};

export default function NewTripPage() {
  return <TripForm />;
}
