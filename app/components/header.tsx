import React from "react";
import { Form, Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

export default function Header() {
  const user = useOptionalUser();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(!user);

  return (
    <header className="bg-slate-800 p-4 text-white">
      <div className="flex w-full flex-row justify-between">
        <h1 className="text-3xl font-bold">
          <Link to="/">
            where<span className="text-sky-200">.directory</span>
          </Link>
        </h1>

        {/* DESKTOP NAV */}
        <section className="hidden w-full items-center justify-between lg:flex">
          <nav className="mt-3 mt-0 ml-20 flex flex-row">
            {user && (
              <>
                <Link
                  to="/trips"
                  className="text-white-700 flex items-center justify-center border-b-2 border-slate-800 py-2 px-8 text-base font-semibold hover:border-white"
                >
                  Trips
                </Link>
                <Link
                  to={`/${user.username}`}
                  className="text-white-700 flex items-center justify-center border-b-2 border-slate-800 py-2 px-8 text-base font-semibold hover:border-white"
                >
                  Profile
                </Link>
                <Link
                  to="/account"
                  className="text-white-700 flex items-center justify-center border-b-2 border-slate-800 py-2 px-8 text-base font-semibold hover:border-white"
                >
                  Account
                </Link>
              </>
            )}
          </nav>

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
        </section>

        <div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white-100 rounded bg-slate-600 py-2 px-4 hover:bg-slate-500 active:bg-slate-500 lg:hidden"
          >
            &equiv;
          </button>
        </div>
      </div>

      {/* MOBILE NAV */}
      {mobileMenuOpen && (
        <section className="flex w-full flex-col lg:hidden">
          <nav className="mt-3 flex flex-col">
            {user && (
              <>
                <Link
                  to="/trips"
                  className="text-white-700 flex items-center justify-center py-4 pl-0 text-base font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Trips
                </Link>
                <Link
                  to={`/${user.username}`}
                  className="text-white-700 flex items-center justify-center py-4 text-base font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/account"
                  className="text-white-700 flex items-center justify-center py-4 text-base font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Account
                </Link>
              </>
            )}
          </nav>

          <section className="mt-6 flex items-center justify-center">
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
        </section>
      )}
    </header>
  );
}
