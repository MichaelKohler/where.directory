import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ExtendedTripInfo } from "~/models/trip.server";
import { getTripListItems } from "~/models/trip.server";
import { getUserById } from "~/models/user.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  email: string;
  username: string;
  trips: ExtendedTripInfo[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }

  const trips = await getTripListItems({ userId: user.id });

  return json<LoaderData>({
    email: user.email,
    username: user.username,
    trips,
  });
};
