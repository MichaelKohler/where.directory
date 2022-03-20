import React from "react";
import Header from "~/components/header";

export default function Index() {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header></Header>

      <main className="mt-20 flex h-full justify-center bg-white text-3xl">
        <h1>Coming soon!</h1>
      </main>
    </div>
  );
}
