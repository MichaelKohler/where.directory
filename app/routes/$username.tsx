import type { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import styles from "mapbox-gl/dist/mapbox-gl.css";
import Map, { Source, Layer } from "react-map-gl";
import type { CircleLayer } from "react-map-gl";
import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { ExtendedTripInfo } from "../models/trip.server";
import { getTripListItems, getTotals } from "../models/trip.server";
import { getUserIdByUsername } from "../models/user.server";
import { getUserId } from "../session.server";

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

export function links(): ReturnType<LinksFunction> {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = ({ params }) => [
  {
    title: `where.directory - ${params.username}`,
  },
];

export async function loader({ request, params }: LoaderFunctionArgs) {
  invariant(params.username, "username not found");

  const user = await getUserIdByUsername(params.username);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }

  let trips = await getTripListItems({ userId: user.id });

  const currentUserId = await getUserId(request);
  if (!currentUserId || currentUserId !== user.id) {
    trips = trips.filter((trip) => {
      // Only show trips that are not being hidden for being in the
      // future.
      if (trip.hideUpcoming && trip.to > new Date()) {
        return false;
      }

      // Trips can be set to "secret", therefore we never want to
      // show these trips to anyone else than the creator. Public
      // is the default.
      if (trip.secret) {
        return false;
      }

      return true;
    });
  }

  const nextTrip = getNextTrip(trips);
  const totals = getTotals(trips);

  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN || "";

  return json({ trips, nextTrip, totals, mapboxToken });
}

export default function UserDetailsPage() {
  const data = useLoaderData<typeof loader>();

  const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features: data.trips.map((trip) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [trip.long, trip.lat] },
      properties: {},
    })),
  };

  return (
    <main className="w-12/12 mx-auto my-12 flex min-h-full flex-col bg-white px-8 md:w-11/12">
      <section className="bg-mk px-7 text-white">
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

        <div className="mb-10 mt-10 flex flex-row justify-between text-center">
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
          renderWorldCopies={false}
          cooperativeGestures={true}
        >
          <Source id="data-source" type="geojson" data={geojson}>
            <Layer {...layerStyle} />
          </Source>
        </Map>
      </section>

      <table className="mt-7 text-left leading-8">
        <thead className="text-bold hidden bg-mk font-title text-white sm:table-header-group">
          <tr>
            <th className="w-1/12 pl-2">From</th>
            <th className="w-1/12 pl-2">Until</th>
            <th className="w-2/12 pl-4">Destination</th>
            <th className="w-2/12 pl-2">Country</th>
            <th className="w-5/12 pl-2">Description</th>
            <th className="hidden w-1/12 pl-2 pr-2 lg:block">Flights</th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-mklight-100 text-left">
          {data.trips.map((trip) => (
            <tr
              key={trip.id}
              className={trip.isFuture ? `sm:font-bold sm:uppercase` : ``}
            >
              <td className="inline-block pt-5 text-sm sm:text-base sm:table-cell sm:pl-2 sm:pt-0">
                {new Date(trip.from).toLocaleDateString()}
              </td>
              <td className="inline-block pt-5 sm:table-cell sm:pl-2 sm:pt-0">
                <span className="sm:hidden">&nbsp;-&nbsp;</span>
                {new Date(trip.to).toLocaleDateString()}

                {trip.isFuture && (
                  <span className="ml-12 py-1 px-2 sm:hidden bg-mk text-white rounded-xl">
                    Upcoming
                  </span>
                )}
              </td>
              <td className="block text-lg sm:table-cell sm:pl-4 sm:text-base">
                <span className="sm:hidden">Location: </span>
                {trip.destination}
              </td>
              <td className="block text-lg sm:table-cell sm:pl-2 sm:text-base">
                <span className="sm:hidden">Country: </span>
                {trip.country}
              </td>
              <td className="block pb-5 sm:table-cell sm:pl-2">
                {trip.description}
              </td>
              <td className="hidden lg:block lg:pl-2 lg:pr-2">
                {trip.flights}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
