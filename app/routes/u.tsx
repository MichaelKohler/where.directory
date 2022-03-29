import { Outlet } from "remix";

import Header from "~/components/header";

export default function UserPage() {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header></Header>

      <main className="flex h-full bg-white">
        <Outlet />
      </main>
    </div>
  );
}
