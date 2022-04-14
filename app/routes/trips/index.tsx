import { Link } from "@remix-run/react";

export default function TripIndexPage() {
  return (
    <p>
      No trip selected. Select a trip on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new trip.
      </Link>{" "}
      Alternatively you can also{" "}
      <Link to="import" className="text-blue-500 underline">
        import
      </Link>{" "}
      or{" "}
      <a
        href="/trips/export"
        className="text-blue-500 underline"
        target="_blank"
      >
        export
      </a>{" "}
      your data.
    </p>
  );
}
