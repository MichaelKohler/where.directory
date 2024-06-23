import styles from "mapbox-gl/dist/mapbox-gl.css";
import invariant from "tiny-invariant";
import type {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import TripForm from "../components/form";
import type { TripClientResponse } from "../models/trip.server";
import { getTrip, updateTrip } from "../models/trip.server";
import { requireUserId } from "../session.server";

export function links(): ReturnType<LinksFunction> {
  return [{ rel: "stylesheet", href: styles }];
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  invariant(params.tripId, "tripId not found");

  const trip = await getTrip({ userId, id: params.tripId });
  if (!trip) {
    throw new Response("Not Found", { status: 404 });
  }

  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN || "";

  return json({ trip, mapboxToken });
}

export async function action({ request }: ActionFunctionArgs) {
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

  if (typeof id !== "string" || id.length === 0) {
    return json(
      {
        errors: {
          ...errors,
          generic: "ID is required. This is a bug with the website!",
        },
      },
      { status: 400 }
    );
  }

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

  const existingTrip = await getTrip({
    userId,
    id,
  });

  if (!existingTrip) {
    return json(
      { errors: { ...errors, generic: "Trip not found." } },
      { status: 404 }
    );
  }

  const trip = await updateTrip({
    userId,
    id,
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
  });

  return redirect(`/trips/${trip.id}`);
}

export default function EditTripPage() {
  const data = useLoaderData<typeof loader>();

  // TODO: check back here once it's clear how serialized
  // data should be handled in terms of types. So far this was
  // not clear to me on how it's meant to be typed for JSON
  // object with a serialized Date type.
  // https://github.com/remix-run/remix/blob/main/decisions/0003-infer-types-for-useloaderdata-and-useactiondata-from-loader-and-action-via-generics.md
  const trip = data.trip as TripClientResponse;

  return <TripForm initialData={trip} />;
}
