import React from "react";
import { Form, Link, useMatches } from "@remix-run/react";

import { useOptionalUser } from "../utils";

export default function Header() {
  const user = useOptionalUser();
  const matches = useMatches();
  const latestRoute = matches[matches.length - 1].id;
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [latestRoute]);

  return (
    <>
      <header
        className={`flex bg-mk p-4 text-white ${
          menuOpen ? "flex-col" : "flex-row"
        }`}
      >
        <h1 className="text-3xl font-bold">
          <Link to="/">
            where<span className="text-mklight-300">.directory</span>
          </Link>
        </h1>

        <section
          className={
            menuOpen
              ? "mt-9 min-h-screen w-full justify-between"
              : "hidden w-full items-center justify-between lg:flex"
          }
        >
          <nav
            className={`mt-0 flex ${menuOpen ? "flex-col" : "ml-20 flex-row"}`}
          >
            {user && (
              <>
                <Link
                  to="/trips"
                  className={`text-white-700 flex ${
                    menuOpen ? "border-b py-8" : "px-8 py-2"
                  } text-base font-semibold hover:text-mklight-300 hover:transition-colors hover:duration-300 focus:text-mklight-300`}
                >
                  Trips
                </Link>
                <Link
                  to={`/${user.username}`}
                  className={`text-white-700 flex ${
                    menuOpen ? "border-b py-8" : "px-8 py-2"
                  } text-base font-semibold hover:text-mklight-300 hover:transition-colors hover:duration-300 focus:text-mklight-300`}
                >
                  Profile
                </Link>
                <Link
                  to="/account"
                  className={`text-white-700 flex ${
                    menuOpen ? "border-b py-8" : "px-8 py-2"
                  } text-base font-semibold hover:text-mklight-300 hover:transition-colors hover:duration-300 focus:text-mklight-300`}
                >
                  Account
                </Link>
              </>
            )}
          </nav>

          <section className="mt-8 lg:mt-0">
            {user ? (
              <Form action="/logout" method="post">
                <button
                  type="submit"
                  className="text-white-100 rounded bg-mk-tertiary py-2 px-4 hover:bg-mk-tertiary active:bg-mk-tertiary"
                >
                  Logout
                </button>
              </Form>
            ) : (
              <div
                className={`flex ${
                  menuOpen ? "flex-col space-y-4" : "flex-row space-x-4"
                }`}
              >
                <Link
                  to="/join"
                  className="text-mk-text flex items-center justify-center rounded bg-mkwarning py-2 px-4 font-medium hover:bg-mkwarning-muted active:bg-mkwarning-muted"
                >
                  Sign up
                </Link>
                <Link
                  to="/login"
                  className="text-white-100 flex items-center justify-center rounded bg-mk-tertiary py-2 px-4 font-medium hover:bg-mk active:bg-mk"
                >
                  Log In
                </Link>
              </div>
            )}
          </section>
        </section>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white-100 absolute top-3 right-3 h-10 w-10 rounded bg-mk-tertiary hover:bg-mk active:bg-mk lg:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </header>
      <section className="mx-8 my-8">
        <div className="p-4 bg-red-400 rounded">
          <h2 className="text-xl">where.directory will be discontinued</h2>
          <p className="my-4">
            To keep my side projects simple, I will decommission where.directory
            in August 2024. If you are using it to save trips, please use the
            export functionality to save your data. In August all data and this
            website will be deleted.
          </p>
        </div>
      </section>
    </>
  );
}
