import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import styles from "mapbox-gl/dist/mapbox-gl.css";
import Map, { Source, Layer } from "react-map-gl";
import type { CircleLayer } from "react-map-gl";
import type { LoaderFunction, MetaFunction } from "remix";
import { json, useLoaderData, useCatch } from "remix";
import invariant from "tiny-invariant";
import type { ExtendedTripInfo, Totals } from "~/models/trip.server";
import { getTripListItems, getTotals } from "~/models/trip.server";
import { getUserIdByUsername } from "~/models/user.server";

type LoaderData = {
  trips: ExtendedTripInfo[];
  nextTrip?: ExtendedTripInfo;
  totals: Totals;
  mapboxToken: string;
};

const layerStyle: CircleLayer = {
  id: "point",
  type: "circle",
  paint: {
    "circle-radius": 4,
    "circle-color": "#1f3352",
  },
};

function getNextTrip(
  sortedTrips: ExtendedTripInfo[]
): ExtendedTripInfo | undefined {
  const firstPastTripIndex = sortedTrips.findIndex(
    (trip) => trip.from <= new Date()
  );
  if (firstPastTripIndex > 0) {
    return sortedTrips[firstPastTripIndex - 1];
  }
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = ({ params }) => ({
  title: `where.directory - ${params.username}`,
});

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.username, "username not found");

  const user = await getUserIdByUsername(params.username);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }

  const trips = await getTripListItems({ userId: user.id });
  const nextTrip = getNextTrip(trips);
  const totals = getTotals(trips);

  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN || "";

  return json<LoaderData>({ trips, nextTrip, totals, mapboxToken });
};

export default function UserDetailsPage() {
  const data = useLoaderData() as LoaderData;

  const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: data.trips.map((trip) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [trip.long, trip.lat] },
      properties: {},
    })),
  };

  return (
    <main className="w-12/12 my-12 mx-auto flex min-h-full flex-col bg-white px-8 md:w-11/12">
      <section className="bg-slate-800 px-7 text-white">
        {data.nextTrip && (
          <div className="mt-10">
            <h2 className="font-title text-3xl">
              Next trip: {data.nextTrip.destination}, {data.nextTrip.country}
            </h2>
            <p>
              {new Date(data.nextTrip.from).toLocaleDateString()} -{" "}
              {new Date(data.nextTrip.to).toLocaleDateString()}
            </p>
          </div>
        )}

        <div className="mt-10 mb-10 flex flex-row justify-between text-center">
          <div>
            <h2 className="font-title text-3xl">{data.totals.trips}</h2>
            <p className="mt-2">total trips</p>
          </div>

          <div>
            <h2 className="font-title text-3xl">{data.totals.destinations}</h2>
            <p className="mt-2">unique destinations</p>
          </div>

          <div>
            <h2 className="font-title text-3xl">{data.totals.countries}</h2>
            <p className="mt-2">unique countries</p>
          </div>
        </div>
      </section>

      <section className="mt-2">
        <Map
          initialViewState={{
            longitude: 0,
            latitude: 30,
            zoom: 1.8,
          }}
          style={{ width: "100%", height: 800 }}
          mapStyle="mapbox://styles/mapbox/light-v10"
          mapboxAccessToken={data.mapboxToken}
        >
          <Source id="data-source" type="geojson" data={geojson}>
            <Layer {...layerStyle} />
          </Source>
        </Map>
      </section>

      <table className="mt-7 text-left leading-8">
        <thead className="text-bold bg-slate-800 font-title text-white">
          <tr>
            <th className="w-1/12 pl-2">From</th>
            <th className="w-1/12 pl-2">Until</th>
            <th className="w-2/12 pl-2">Destination</th>
            <th className="w-2/12 pl-2">Country</th>
            <th className="w-5/12 pl-2">Description</th>
            <th className="w-1/12 pl-2">Flights</th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-slate-100">
          {data.trips.map((trip) => (
            <tr
              key={trip.id}
              className={trip.isFuture ? `font-bold uppercase` : ``}
            >
              <td className="pl-2">
                {new Date(trip.from).toLocaleDateString()}
              </td>
              <td className="pl-2">{new Date(trip.to).toLocaleDateString()}</td>
              <td className="pl-2">{trip.destination}</td>
              <td className="pl-2">{trip.country}</td>
              <td className="pl-2">{trip.description}</td>
              <td className="pl-2">{trip.flights}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <main className="flex h-full min-h-screen justify-center bg-white">
        <h1 className="mt-10 font-title text-3xl">User not found</h1>
      </main>
    );
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
