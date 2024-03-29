import type { User, Trip } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";

import { prisma } from "../db.server";

export type { Trip } from "@prisma/client";

export type TripClientResponse = SerializeFrom<Trip>;

export type ExtendedTripInfo = Trip & {
  isFuture: boolean;
};

export type Totals = {
  trips: number;
  destinations: number;
  countries: number;
};

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

export async function getTripListItems({ userId }: { userId: User["id"] }) {
  const storedTrips = await prisma.trip.findMany({
    where: { userId },
    orderBy: { from: "desc" },
  });

  const trips = storedTrips.map((trip) => ({
    ...trip,
    isFuture: trip.from > new Date(),
  }));

  return trips;
}

export function getTotals(trips: ExtendedTripInfo[]): Totals {
  // Prisma so far does not support counting on distinct values, so we pass the full list
  // and calculate this ourselves.

  const pastTrips = trips.filter((trip) => trip.from < new Date());
  const totalTrips = pastTrips.length;
  const destinations = [...new Set(pastTrips.map((trip) => trip.destination))]
    .length;
  const countries = [...new Set(pastTrips.map((trip) => trip.country))].length;

  return {
    trips: totalTrips,
    destinations,
    countries,
  };
}

export function countTrips() {
  return prisma.trip.count();
}

export function createTrips(trips: Trip[], userId: User["id"]) {
  try {
    return prisma.$transaction(
      trips.map((trip) => {
        return prisma.trip.create({
          data: {
            destination: trip.destination,
            country: trip.country,
            description: trip.description,
            flights: trip.flights,
            lat: trip.lat,
            long: trip.long,
            from: new Date(trip.from),
            to: new Date(trip.to),
            secret: trip.secret,
            hideUpcoming: trip.hideUpcoming,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        });
      })
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
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
  secret = false,
  hideUpcoming = false,
  userId,
}: Pick<
  Trip,
  "destination" | "description" | "country" | "secret" | "hideUpcoming"
> & {
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
      secret,
      hideUpcoming,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export async function updateTrip({
  userId,
  id,
  destination,
  country,
  description,
  flights,
  lat,
  long,
  from,
  to,
  secret = false,
  hideUpcoming = false,
}: Pick<
  Trip,
  | "userId"
  | "id"
  | "destination"
  | "description"
  | "country"
  | "secret"
  | "hideUpcoming"
> & {
  to: string;
  from: string;
  flights: string;
  lat: string;
  long: string;
}) {
  const trip = await getTrip({ id, userId });

  if (!trip) {
    throw new Error("TRIP_NOT_FOUND");
  }

  return prisma.trip.update({
    where: { id },
    data: {
      destination,
      country,
      description,
      flights: parseInt(flights, 10),
      lat: parseFloat(lat),
      long: parseFloat(long),
      from: new Date(from),
      to: new Date(to),
      secret,
      hideUpcoming,
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
