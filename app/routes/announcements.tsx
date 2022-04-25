export default function AnnouncementPage() {
  return (
    <main className="my-12 mx-auto flex min-h-full w-11/12 flex-col bg-white px-8">
      <h1 className="text-title text-4xl">Announcements</h1>

      <h2 className="text-title mt-4 text-3xl">Version 1.0 released!</h2>
      <small className="mt-2 text-xs">2022-04-25</small>
      <p className="mt-4">
        Today the first somewhat final version was released. While there will be
        further improvements in the future, this version is now ready to be
        used.
      </p>
      <h3 className="text-title mt-4 text-xl">Editing trips</h3>
      <p className="mt-4">
        Until this release trips had to be deleted and re-created if a mistake
        happened. Now trips can easily be edited from their detail view by
        clicking on the trip to edit in the left sidebar and then "Edit".
      </p>
      <h3 className="text-title mt-4 text-xl">Marking trips as private</h3>
      <p className="mt-4">
        Trips can now be marked as private. This means that only you can see
        them on the profile page when you are logged in. Anyone else will only
        see the public trips.
      </p>
      <h3 className="text-title mt-4 text-xl">
        Hide trips until they are over
      </h3>
      <p className="mt-4">
        By default trips are shown, even if they are currently ongoing. As not
        everyone might feel comfortable with sharing ongoing trips and therefore
        leaking the fact that they might not be home, you can now hide trips
        until they are over. They will be instantly published publicly when the
        "Until" date has passed.
      </p>

      <h2 className="text-title mt-10 text-3xl">Proof of concept</h2>
      <small className="mt-2 text-xs">2022-04-03</small>
      <p className="mt-4">
        This for now is a proof of concept. You may register and use it, however
        functionality is very much optimized for my own use cases. There might
        be improvements coming in the future though! You can follow the progress{" "}
        <a
          href="https://github.com/MichaelKohler/where.directory/"
          className="underline"
        >
          here
        </a>
        !
      </p>
    </main>
  );
}
