import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { countTrips } from "../models/trip.server";
import { countUsers } from "../models/user.server";
import { requireUserId } from "../session.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUserId(request);

  const [trips, users] = await Promise.all([countTrips(), countUsers()]);

  return json({
    users,
    trips,
  });
}
