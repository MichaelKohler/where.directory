import { Link } from "remix";

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

      <div className="align-items flex w-full flex-row justify-around px-9 py-11">
        <div className="w-6/12">
          <h2 className="font-title text-4xl">Add your vacations</h2>
          <p className="mt-9 text-xl">
            Add your vacations and see them on Map. Forgot when you were at a
            certain place? With where.directory it's easy to look this up and
            remember again.
          </p>
        </div>
        <div className="w-6/12 max-w-md">
          <img src="/add.png" alt="Screenshot of how it looks to add a trip" />
        </div>
      </div>

      <div className="align-items flex w-full flex-row-reverse justify-around px-9 py-11">
        <div className="w-6/12">
          <h2 className="font-title text-4xl">Share it with the world</h2>
          <p className="mt-9 text-xl">
            The public profile with the map is easy to share with friends and
            family. Copy the link to your profile and done! It is up to you to
            decide when you want to add new trips: you can add trips after you
            are back for privacy reasons, or you can use this to inform others
            where you are planning to go, all up to you!
          </p>
        </div>
        <div className="w-6/12 max-w-md">
          <img
            src="/map.png"
            alt="Screenshot of how the public profile with total trips and map"
          />
        </div>
      </div>

      <div className="align-items flex w-full flex-row justify-around px-9 py-11">
        <div className="w-6/12">
          <h2 className="font-title text-4xl">
            Open Source and privacy-oriented
          </h2>
          <p className="mt-9 text-xl">
            This project is open source and can easily be audited. We will also
            never sell your data, or track you in ways that is unexpected. More
            privacy-related features such as an option to not show upcoming
            trips is planned and will eventually be integrated. You can also
            import and export data if needed.
          </p>
        </div>
        <div className="w-6/12 max-w-md">
          <img src="/os.png" alt="Screenshot of open issues on GitHub" />
        </div>
      </div>
    </main>
  );
}
