export default function AnnouncementPage() {
  return (
    <main className="my-12 mx-auto flex min-h-full w-11/12 flex-col bg-white px-8">
      <h1 className="text-title text-4xl">Privacy Policy</h1>
      <h2 className="text-title mt-4 text-3xl">Trip data</h2>
      <p className="mt-4">
        <strong className="text-bold">
          e-mail address, username, content of the trips:
        </strong>{" "}
        this data is collected when you sign up for this website, and when you
        enter trip data. The username and trip data is publicly visible, however
        we never show the e-mail address publicly. When you log in to the
        website, your email address will also be saved in cookies. These are for
        your convenience so that you do not have to log in every time you
        refresh the website. These cookies will be saved on your computer for a
        maximum of 7 days.
        <br />
        <strong className="text-bold">
          IP and browser user agent string:
        </strong>{" "}
        this data is collected when you visit the website. We do not analyze or
        store this data.
        <br />
        <strong className="text-bold">Retention period:</strong> the trip data
        and user account data is retained indefinitely so we can display the
        trip information on your profile. You have the right to delete your
        account and related data at any time.
      </p>
      <h2 className="text-title mt-4 text-3xl">
        Your rights pertaining your data
      </h2>
      <p className="mt-4">
        If you have signed up, you can request to receive an exported file of
        the personal data we hold about you, including any data you have
        provided to us. You can also request that we rectify or erase any
        personal data we hold about you. Please send your request to
        me@michaelkohler.info.
      </p>
      <ul className="mt-4 ml-5 list-disc">
        <li>The right to withdraw consent</li>
        <li>The right of access</li>
        <li>The right to erasure</li>
        <li>The right to rectification</li>
        <li>The right to data portability</li>
        <li>The right to object</li>
        <li>Notification of data breaches</li>
        <li>The right to lodge a complaint with a supervisory authority</li>
      </ul>
    </main>
  );
}
