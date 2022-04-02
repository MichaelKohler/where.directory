import type { LoaderFunction } from "remix";
import { json, useLoaderData, useCatch } from "remix";
import invariant from "tiny-invariant";
import type { Trip } from "~/models/trip.server";
import { getTripListItems } from "~/models/trip.server";
import { getUserIdByUsername } from "~/models/user.server";

type LoaderData = {
  trips: Trip[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.username, "username not found");

  const user = await getUserIdByUsername(params.username);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }

  const trips = await getTripListItems({ userId: user.id });

  return json<LoaderData>({ trips });
};

export default function UserDetailsPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <ul>
      {data.trips.map((trip) => (
        <li key={trip.id}>
          {trip.destination}, {trip.country}
        </li>
      ))}
    </ul>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>User not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}