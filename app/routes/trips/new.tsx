import styles from "mapbox-gl/dist/mapbox-gl.css";
import type { ActionArgs, LinksFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import TripForm from "../../components/form";
import { createTrip } from "../../models/trip.server";
import { requireUserId } from "../../session.server";

export function links(): ReturnType<LinksFunction> {
  return [{ rel: "stylesheet", href: styles }];
}

export async function loader() {
  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN || "";

  return json({ mapboxToken });
}

export async function action({ request }: ActionArgs) {
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
  const hideUpcoming = formData.get("hideUpcoming") === "on";

  const errors = {
    generic: null,
    from: null,
    to: null,
    destination: null,
    country: null,
    description: null,
    flights: null,
    lat: null,
    long: null,
  };

  if (typeof from !== "string" || from.length === 0) {
    return json(
      { errors: { ...errors, from: "From date is required and must be text" } },
      { status: 400 }
    );
  }

  if (typeof to !== "string" || to.length === 0) {
    return json(
      { errors: { ...errors, to: "To date is required and must be text" } },
      { status: 400 }
    );
  }

  if (typeof destination !== "string" || destination.length === 0) {
    return json(
      { errors: { ...errors, destination: "Destination is required" } },
      { status: 400 }
    );
  }

  if (typeof country !== "string" || country.length === 0) {
    return json(
      { errors: { ...errors, country: "Country is required" } },
      { status: 400 }
    );
  }

  if (typeof description !== "string") {
    return json(
      { errors: { ...errors, description: "Description must be text" } },
      { status: 400 }
    );
  }

  if (typeof flights !== "string" || flights.length === 0) {
    return json(
      { errors: { ...errors, flights: "Flights is required" } },
      { status: 400 }
    );
  }

  if (typeof lat !== "string" || lat.length === 0) {
    return json(
      { errors: { ...errors, lat: "Latitude is required" } },
      { status: 400 }
    );
  }

  if (typeof long !== "string" || long.length === 0) {
    return json(
      { errors: { ...errors, long: "Longitude is required" } },
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
    hideUpcoming,
    userId,
  });

  return redirect(`/trips/${trip.id}`);
}

export default function NewTripPage() {
  return <TripForm />;
}
