import React from "react";
import { Form, Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

export default function Header() {
  const user = useOptionalUser();
  return (
    <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
      <section className="flex flex-col md:flex-row">
        <h1 className="text-3xl font-bold">
          <Link to="/">
            where<span className="text-sky-200">.directory</span>
          </Link>
        </h1>
        <nav className="mt-3 flex flex-row md:mt-0 md:ml-20">
          {user && (
            <>
              <Link
                to="/trips"
                className="text-white-700 flex items-center justify-center border-b-2 border-slate-800 py-2 pl-0 pr-8 text-base font-semibold hover:border-white md:pl-8 md:pr-8"
              >
                Trips
              </Link>
              <Link
                to={`/${user.username}`}
                className="text-white-700 flex items-center justify-center border-b-2 border-slate-800 py-2 pr-8 text-base font-semibold hover:border-white md:pl-8 md:pr-8"
              >
                Profile
              </Link>
              <Link
                to="/account"
                className="text-white-700 flex items-center justify-center border-b-2 border-slate-800 py-2 pr-8 text-base font-semibold hover:border-white md:pl-8 md:pr-8"
              >
                Account
              </Link>
            </>
          )}
        </nav>
      </section>

      <section>
        {user ? (
          <Form action="/logout" method="post">
            <button
              type="submit"
              className="text-white-100 rounded bg-slate-600 py-2 px-4 hover:bg-slate-500 active:bg-slate-500"
            >
              Logout
            </button>
          </Form>
        ) : (
          <div className="flex flex-row space-x-4">
            <Link
              to="/join"
              className="text-white-100 flex items-center justify-center rounded bg-yellow-600 py-2 px-4 font-medium hover:bg-yellow-500 active:bg-yellow-500"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center rounded bg-slate-600 px-4 py-2 font-medium text-white hover:bg-slate-500 active:bg-slate-500"
            >
              Log In
            </Link>
          </div>
        )}
      </section>
    </header>
  );
}
