import React from "react";
import { Form, Link } from "remix";
import { useOptionalUser } from "~/utils";

export default function Header() {
  const user = useOptionalUser();
  return (
    <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
      <section className="flex flex-row">
        <h1 className="text-3xl font-bold">
          <Link to="/">
            where<span className="text-sky-200">.directory</span>
          </Link>
        </h1>
        <nav className="ml-20 flex flex-row">
          {user && (
            <>
              <Link
                to="/trips"
                className="text-white-700 flex items-center justify-center border-b-2 border-slate-800 px-4 py-2 text-base font-semibold hover:border-white sm:px-8"
              >
                Dashboard
              </Link>
              <Link
                to={`/${user.username}`}
                className="text-white-700 flex items-center justify-center border-b-2 border-slate-800 px-4 py-2 text-base font-semibold hover:border-white sm:px-8"
              >
                Public Profile
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
              className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-slate-500 active:bg-slate-500"
            >
              Logout
            </button>
          </Form>
        ) : (
          <div className="flex flex-row space-x-4">
            <Link
              to="/join"
              className="flex items-center justify-center rounded bg-slate-600 py-2 px-4 font-medium text-blue-100 hover:bg-slate-500 active:bg-slate-500"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center rounded bg-yellow-500 px-4 py-2 font-medium text-white hover:bg-yellow-600"
            >
              Log In
            </Link>
          </div>
        )}
      </section>
    </header>
  );
}
