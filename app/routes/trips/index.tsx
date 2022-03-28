import { Link } from "remix";

export default function TripIndexPage() {
  return (
    <p>
      No trip selected. Select a trip on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new trip.
      </Link>
    </p>
  );
}
