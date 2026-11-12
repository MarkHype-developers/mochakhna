export default function SetupHelp() {
  return (
    <div className="ad-login">
      <div className="ad-card ad-setup">
        <img src="/img/ayunraz-chakhna-logo.jpg" alt="" className="ad-logo" />
        <h1>Connect Firebase to turn on the admin panel</h1>
        <p>The admin panel saves your menu and photos in Firebase (Firestore only — no Storage needed). It takes about 10 minutes, once:</p>
        <ol>
          <li>Go to <b>console.firebase.google.com</b> → <b>Add project</b>.</li>
          <li><b>Build → Authentication → Get started → Email/Password → Enable</b>. Then <b>Users → Add user</b> with the email and password you&apos;ll log in with.</li>
          <li><b>Build → Firestore Database → Create database</b> (production mode).</li>
          <li><b>Project settings → Your apps → Web (&lt;/&gt;)</b> → register the app and copy the config values.</li>
          <li>Paste them into a file called <code>.env.local</code> in the website folder (copy <code>firebase.env.example</code>), and restart <code>npm run dev</code>.</li>
          <li>Paste the rules from <code>firestore.rules</code> into Firestore → <b>Rules</b> (put your email in it first).</li>
        </ol>
        <p className="ad-muted">The full steps are in README.md under “Admin panel”.</p>
      </div>
    </div>
  );
}
