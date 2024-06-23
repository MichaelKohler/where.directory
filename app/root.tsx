import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";

import Footer from "./components/footer";
import Header from "./components/header";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import React from "react";

export function headers(): ReturnType<HeadersFunction> {
  return {
    "Permissions-Policy":
      "accelerometer=(), ambient-light-sensor=(), battery=(), camera=(), microphone=(), geolocation=(), gyroscope=()",
    // setting the "Referrer-Policy" to "no-referrer" breaks mapbox
    "Referrer-Policy": "origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  };
}

export function links(): ReturnType<LinksFunction> {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
}

export function meta(): ReturnType<MetaFunction> {
  return [
    {
      title: "where.directory",
    },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
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
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Dosis:wght@700&family=Raleway&display=swap"
          rel="stylesheet"
        />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
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
        <Analytics />
        <LiveReload />
      </body>
    </html>
  );
}

export default function DefaultApp() {
  return <App />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <App>
        <main className="flex h-full min-h-screen justify-center bg-white">
          <h1 className="mt-10 font-title text-3xl">Not found</h1>
        </main>
      </App>
    );
  }

  return (
    <App>
      <main className="flex h-full min-h-screen justify-center bg-white">
        <h1 className="mt-10 font-title text-3xl">Something went wrong</h1>
      </main>
    </App>
  );
}
