import type { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import styles from "mapbox-gl/dist/mapbox-gl.css";
import Map, { Source, Layer } from "react-map-gl";
import type { CircleLayer } from "react-map-gl";
import type {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteTrip, getTrip } from "../models/trip.server";
import { requireUserId } from "../session.server";

const layerStyle: CircleLayer = {
  id: "point",
  type: "circle",
  paint: {
    "circle-radius": 4,
    "circle-color": "#1f3352",
  },
};

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

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  invariant(params.tripId, "tripId not found");

  await deleteTrip({ userId, id: params.tripId });

  return redirect("/trips");
}

export default function TripDetailsPage() {
  const data = useLoaderData<typeof loader>();

  const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [data.trip.long, data.trip.lat],
        },
        properties: {},
      },
    ],
  };

  return (
    <div>
      <h3 className="font-title text-2xl">
        {data.trip.secret ? "🔒" : "🌐"} {data.trip.destination},{" "}
        {data.trip.country}
      </h3>
      <p className="py-6">
        {new Date(data.trip.from).toLocaleDateString()} -{" "}
        {new Date(data.trip.to).toLocaleDateString()}
      </p>
      {data.trip.description && <p className="py-6">{data.trip.description}</p>}
      <p className="py-6">Flights: {data.trip.flights}</p>
      <section className="mt-2">
        <Map
          longitude={data.trip.long}
          latitude={data.trip.lat}
          initialViewState={{
            zoom: 10,
          }}
          style={{ width: "100%", height: 400 }}
          mapStyle="mapbox://styles/mapbox/light-v10"
          mapboxAccessToken={data.mapboxToken}
          renderWorldCopies={false}
        >
          <Source id="data-source" type="geojson" data={geojson}>
            <Layer {...layerStyle} />
          </Source>
        </Map>
      </section>

      <hr className="my-4" />

      <Link
        to="edit"
        className="rounded bg-mk px-4 py-2 text-center text-white hover:bg-mk-tertiary active:bg-mk-tertiary"
      >
        Edit
      </Link>

      <hr className="my-4" />

      <small className="text-xs">
        Pressing the "Delete" button will instantly delete this trip.
      </small>
      <Form method="post" className="mt-4">
        <button
          type="submit"
          className="rounded bg-mkerror px-4 py-2 text-white hover:bg-mkerror-muted active:bg-mkerror-muted"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}
