import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <main className="flex w-full flex-col bg-white">
      <div className="flex h-128 w-full flex-col justify-center bg-gradient-to-b from-slate-800 to-slate-700 px-8 text-center text-white">
        <h1 className="font-title text-6xl">Where have you been?</h1>
        <p className="mt-9 text-2xl">
          Track your vacations and trips in both list and map views
        </p>
        <div className="flex justify-center">
          <Link
            to="/demo"
            className="mt-12 flex items-center justify-center rounded bg-yellow-600 px-4 py-2 font-medium text-white hover:bg-yellow-500"
          >
            Demo profile
          </Link>
        </div>
      </div>

      <div className="align-items flex w-full flex-col justify-around px-9 pt-24 pb-11 md:flex-row">
        <div className="flex flex-col justify-center md:w-6/12 md:pr-5">
          <h2 className="font-title text-4xl">
            Add your vacations and business trips
          </h2>
          <p className="mt-9 text-xl">
            Add your vacations and see them on a map. Forgot when you were at a
            certain place? With where.directory it's easy to look this up and
            remember again. You can also add a description if you want to add
            more information to a certain trip.
          </p>
        </div>
        <div className="mt-5 max-w-md md:mt-0 md:w-6/12">
          <img src="/add.png" alt="Screenshot of how it looks to add a trip" />
        </div>
      </div>

      <div className="align-items flex w-full flex-col justify-around px-9 py-11 md:flex-row-reverse">
        <div className="flex flex-col justify-center md:w-6/12 md:pl-5">
          <h2 className="font-title text-4xl">
            Share it with the world - with privacy in mind
          </h2>
          <p className="mt-9 text-xl">
            The public profile with the map and list views is easy to share with
            friends and family. Share the link to your profile and done! You can
            also add private trips that will never be shown to any other visitor
            of your profile. If you are concerned about leaking your current
            location, you can also choose to not show a trip on your profile
            until the trip has finished, all by clicking one checkbox when
            creating the trip. We will also never sell your data, or track you
            at all.
          </p>
        </div>
        <div className="mt-5 max-w-md md:mt-0 md:w-6/12">
          <img
            src="/map.png"
            alt="Screenshot of how the public profile with total trips and map"
          />
        </div>
      </div>

      <div className="align-items flex w-full flex-col justify-around px-9 pt-11 pb-24 md:flex-row">
        <div className="flex flex-col justify-center md:w-6/12 md:pr-5">
          <h2 className="font-title text-4xl">Open Source</h2>
          <p className="mt-9 text-xl">
            This project is open source and can easily be audited. If you are
            missing a feature, you can suggest it on{" "}
            <a
              href="https://github.com/MichaelKohler/where.directory/issues/"
              className="underline"
            >
              the issue tracker
            </a>
            , or even implement it yourself! While there is no standardized
            format, we still let you import and export data if needed. This can
            be used as a data source for other tools with some post-processing,
            or simply as backup, up to you!
          </p>
        </div>
        <div className="mt-5 max-w-md md:mt-0 md:w-6/12">
          <img src="/os.png" alt="Screenshot of open issues on GitHub" />
        </div>
      </div>
    </main>
  );
}
