import { Outlet } from "remix";

export default function UserPage() {
  return (
    <main className="flex h-full min-h-screen bg-white">
      <Outlet />
    </main>
  );
}
