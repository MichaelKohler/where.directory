import type { User, Trip } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Trip } from "@prisma/client";

export function getTrip({
  id,
  userId,
}: Pick<Trip, "id"> & {
  userId: User["id"];
}) {
  return prisma.trip.findFirst({
    where: { id, userId },
  });
}

export function getTripListItems({ userId }: { userId: User["id"] }) {
  return prisma.trip.findMany({
    where: { userId },
    orderBy: { from: "desc" },
  });
}

export function createTrip({
  destination,
  country,
  description,
  flights,
  lat,
  long,
  from,
  to,
  userId,
}: Pick<Trip, "destination" | "description" | "country"> & {
  userId: User["id"];
  to: string;
  from: string;
  flights: string;
  lat: string;
  long: string;
}) {
  return prisma.trip.create({
    data: {
      destination,
      country,
      description,
      flights: parseInt(flights, 10),
      lat: parseFloat(lat),
      long: parseFloat(long),
      from: new Date(from),
      to: new Date(to),
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteTrip({
  id,
  userId,
}: Pick<Trip, "id"> & { userId: User["id"] }) {
  return prisma.trip.deleteMany({
    where: { id, userId },
  });
}
