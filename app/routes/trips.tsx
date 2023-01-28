import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { getTripListItems } from "../models/trip.server";
import { requireUserId } from "../session.server";

export function meta(): ReturnType<MetaFunction> {
  return {
    title: "where.directory - Dashboard",
  };
}

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const tripListItems = await getTripListItems({ userId });
  return json({ tripListItems });
}

export default function TripsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <main className="flex min-h-screen bg-white">
      <div className="h-full w-40 border-r bg-gray-50 md:w-80">
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
                    `align-items text-l block flex w-full flex-row gap-1 border-b p-4 ${
                      isActive ? "bg-white" : ""
                    }`
                  }
                  to={trip.id}
                >
                  <div>{trip.secret ? "🔒" : "🌐"}</div>
                  <div>
                    <p>
                      {trip.destination}, {trip.country}
                    </p>
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
  );
}
