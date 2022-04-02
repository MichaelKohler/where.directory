import React from "react";
import { Link } from "remix";

export default function Footer() {
  return (
    <footer className="flex items-center justify-center bg-slate-800 p-4 text-white">
      <nav className="ml-20 flex flex-row">
        <Link
          to="/changelog"
          className="text-white-700 px-4 py-2 text-base font-semibold sm:px-8"
        >
          Changelog
        </Link>
        <Link
          to="/privacy"
          className="text-white-700 px-4 py-2 text-base font-semibold sm:px-8"
        >
          Privacy
        </Link>
        <a
          href="https://github.com/MichaelKohler/where.directory/"
          className="text-white-700 px-4 py-2 text-base font-semibold sm:px-8"
        >
          Open Source
        </a>
      </nav>
    </footer>
  );
}
