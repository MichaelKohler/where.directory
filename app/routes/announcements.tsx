export default function AnnouncementPage() {
  return (
    <main className="my-12 mx-auto flex min-h-full w-11/12 flex-col bg-white px-8">
      <h1 className="text-title text-4xl">Announcements</h1>

      <h2 className="text-title mt-4 text-3xl">Proof of concept</h2>
      <small className="text-xs">2022-04-03</small>
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
