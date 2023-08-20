import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getTripListItems } from "../models/trip.server";
import { getUserById } from "../models/user.server";
import { requireUserId } from "../session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }

  const trips = await getTripListItems({ userId: user.id });

  return json({
    email: user.email,
    username: user.username,
    trips,
  });
}
