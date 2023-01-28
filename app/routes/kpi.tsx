import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { countTrips } from "../models/trip.server";
import { countUsers } from "../models/user.server";
import { requireUserId } from "../session.server";

export async function loader({ request, params }: LoaderArgs) {
  await requireUserId(request);

  const [trips, users] = await Promise.all([countTrips(), countUsers()]);

  return json({
    users,
    trips,
  });
}
