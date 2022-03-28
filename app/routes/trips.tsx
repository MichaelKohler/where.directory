import { json, useLoaderData, Outlet, Link, NavLink } from "remix";
import type { LoaderFunction } from "remix";

import Header from "~/components/header";
import { getTripListItems } from "~/models/trip.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  tripListItems: Awaited<ReturnType<typeof getTripListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const tripListItems = await getTripListItems({ userId });
  return json<LoaderData>({ tripListItems });
};

export default function TripsPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header></Header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Trip
          </Link>

          <hr />

          {data.tripListItems.length === 0 ? (
            <p className="p-4">No trips yet</p>
          ) : (
            <ol>
              {data.tripListItems.map((trip) => (
                <li key={trip.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `align-items block flex w-full flex-row gap-1 border-b p-4 text-xl ${
                        isActive ? "bg-white" : ""
                      }`
                    }
                    to={trip.id}
                  >
                    <div>🌐</div>
                    <div>
                      {trip.destination}, {trip.country}
                      <div className="text-sm">
                        {new Date(trip.from).toLocaleDateString()} -{" "}
                        {new Date(trip.to).toLocaleDateString()}
                      </div>
                    </div>
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
