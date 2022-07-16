import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";

import Footer from "./components/footer";
import Header from "./components/header";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import React from "react";

export function links(): ReturnType<LinksFunction> {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
}

export function meta(): ReturnType<MetaFunction> {
  return {
    charset: "utf-8",
    title: "where.directory",
    viewport: "width=device-width,initial-scale=1",
  };
}

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

function App({ children }: { children?: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="crossorigin"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Dosis:wght@700&family=Raleway&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Header />
        <Outlet />
        {children}
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function DefaultApp() {
  return <App />;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <App>
        <main className="flex h-full min-h-screen justify-center bg-white">
          <h1 className="mt-10 font-title text-3xl">Page not found</h1>
        </main>
      </App>
    );
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
