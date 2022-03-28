import type { LoaderFunction, ActionFunction } from "remix";
import { redirect } from "remix";
import { json, useLoaderData, useCatch, Form } from "remix";
import invariant from "tiny-invariant";
import type { Trip } from "~/models/trip.server";
import { deleteTrip } from "~/models/trip.server";
import { getTrip } from "~/models/trip.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  trip: Trip;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.tripId, "tripId not found");

  const trip = await getTrip({ userId, id: params.tripId });
  if (!trip) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ trip });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.tripId, "tripId not found");

  await deleteTrip({ userId, id: params.tripId });

  return redirect("/trips");
};

export default function TripDetailsPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <div>
      <h3 className="text-2xl font-bold">
        {data.trip.destination}, {data.trip.country}
      </h3>
      <p className="py-6">
        {new Date(data.trip.from).toLocaleDateString()} -{" "}
        {new Date(data.trip.to).toLocaleDateString()}
      </p>
      {data.trip.destination && <p className="py-6">{data.trip.description}</p>}
      <p className="py-6">Flights: {data.trip.flights}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-red-700 py-2 px-4 text-white hover:bg-red-500 active:bg-slate-500"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Trip not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
