import type { LoaderFunction } from "remix";
import { json } from "remix";
import { countTrips } from "~/models/trip.server";
import { countUsers } from "~/models/user.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  users: number;
  trips: number;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request);

  const [trips, users] = await Promise.all([countTrips(), countUsers()]);

  return json<LoaderData>({
    users,
    trips,
  });
};
