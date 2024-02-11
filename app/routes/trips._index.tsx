import { Link } from "@remix-run/react";

export default function TripIndexPage() {
  return (
    <p>
      No trip selected. Select a trip on the left, or{" "}
      <Link to="new" className="text-mk underline">
        create a new trip.
      </Link>{" "}
      Alternatively you can also{" "}
      <Link to="import" className="text-mk underline">
        import
      </Link>{" "}
      or{" "}
      <a href="/trips/export" className="text-mk underline" target="_blank">
        export
      </a>{" "}
      your data.
    </p>
  );
}
