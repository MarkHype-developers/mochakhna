"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { CONTENT_DOC, DEFAULT_CONTENT, normalize, type Content } from "@/lib/content";
import { DealsEditor, HomeEditor, MenuEditor, SiteEditor } from "./Editors";

const TABS = [
  ["menu", "Menu"],
  ["deals", "Deals & offers"],
  ["home", "Home images"],
  ["site", "Site details"],
] as const;
type Tab = (typeof TABS)[number][0];

/** Remove blank lines people leave in the textareas, trim names. */
function tidy(c: Content): Content {
  const lines = (a: string[]) => a.map((s) => s.trim()).filter(Boolean);
  return {
    ...c,
    site: { ...c.site, phones: lines(c.site.phones), address: lines(c.site.address) },
    categories: c.categories.map((cat) => ({ ...cat, title: cat.title.trim(), items: cat.items.map((i) => ({ ...i, name: i.name.trim(), desc: i.desc.trim() })) })),
    deals: c.deals.map((d) => ({ ...d, items: lines(d.items) })),
  };
}

/** Firestore refuses `undefined` values — drop them. */
const clean = (c: Content) => JSON.parse(JSON.stringify(c)) as Content;

export default function Admin() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => onAuthStateChanged(auth, setUser), []);

  if (user === undefined) return <div className="ad-loading">Loading…</div>;
  if (!user) return <Login />;
  return <Panel user={user} />;
}

function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setMsg(""); setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pw);
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? "";
      setErr(code.includes("invalid") || code.includes("wrong") || code.includes("not-found") ? "Wrong email or password." : code.includes("too-many") ? "Too many tries — wait a minute and try again." : "Could not sign in. Check your internet and try again.");
    } finally { setBusy(false); }
  };
  const reset = async () => {
    if (!email.trim()) { setErr("Type your email first, then press “Forgot password”."); return; }
    try { await sendPasswordResetEmail(auth, email.trim()); setMsg("Password reset email sent."); setErr(""); }
    catch { setErr("Could not send the reset email."); }
  };

  return (
    <div className="ad-login">
      <form className="ad-card ad-login-card" onSubmit={submit}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/ayunraz-chakhna-logo.jpg" alt="Ayunraz Chakhna" className="ad-logo" />
        <h1>Admin login</h1>
        <label className="ad-f ad-f--wide"><span className="ad-lbl">Email</span><input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label className="ad-f ad-f--wide"><span className="ad-lbl">Password</span><input type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} required /></label>
        {err && <p className="ad-err">{err}</p>}
        {msg && <p className="ad-ok">{msg}</p>}
        <button className="ad-btn" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        <button type="button" className="ad-link" onClick={reset}>Forgot password?</button>
      </form>
    </div>
  );
}

function Panel({ user }: { user: User }) {
  const [tab, setTab] = useState<Tab>("menu");
  const [saved, setSaved] = useState<Content | null>(null);   // what is live
  const [draft, setDraft] = useState<Content | null>(null);
  const [live, setLive] = useState(false);                     // has anything been published yet?
  const [status, setStatus] = useState<{ t: "ok" | "err" | ""; m: string }>({ t: "", m: "" });
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const snap = await getDoc(doc(db, ...CONTENT_DOC));
      const json = snap.exists() ? (snap.data().json as string | undefined) : undefined;
      const c = json ? normalize(JSON.parse(json)) : DEFAULT_CONTENT;
      setLive(Boolean(json));
      setSaved(c); setDraft(c);
    } catch {
      setStatus({ t: "err", m: "Could not load the saved content. Check the Firestore rules (see README)." });
      setSaved(DEFAULT_CONTENT); setDraft(DEFAULT_CONTENT);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const dirty = useMemo(() => !!draft && !!saved && JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = useCallback((fn: (c: Content) => Content) => { setDraft((d) => (d ? fn(d) : d)); setStatus({ t: "", m: "" }); }, []);

  const publish = async () => {
    if (!draft) return;
    setBusy(true); setStatus({ t: "", m: "" });
    try {
      const next = clean({ ...tidy(draft), updatedAt: new Date().toISOString() });
      await setDoc(doc(db, ...CONTENT_DOC), { json: JSON.stringify(next), updatedAt: serverTimestamp(), by: user.email ?? "" });
      setSaved(next); setDraft(next); setLive(true);
      setStatus({ t: "ok", m: "Published! The website now shows your changes (refresh it to see)." });
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? "";
      setStatus({ t: "err", m: code.includes("permission") ? "Not allowed to publish — this email isn't in the admin list in the Firestore rules." : "Publishing failed. Check your internet and try again." });
    } finally { setBusy(false); }
  };

  const discard = () => { if (saved && confirm("Throw away all changes since the last Publish?")) setDraft(saved); };
  const resetDefaults = () => { if (confirm("Load the original menu from the website code? (Nothing changes on the site until you press Publish.)")) setDraft(DEFAULT_CONTENT); };
  const backup = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" }));
    a.download = `ayunraz-chakhna-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  if (!draft) return <div className="ad-loading">Loading content…</div>;

  const counts = { dishes: draft.categories.reduce((a, c) => a + c.items.length, 0), cats: draft.categories.length };

  return (
    <div className="ad">
      <header className="ad-top">
        <div className="ad-top-in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/ayunraz-chakhna-logo.jpg" alt="" className="ad-top-logo" />
          <div className="ad-top-t">
            <b>Admin</b>
            <span>{counts.cats} categories · {counts.dishes} dishes · {draft.deals.length} deals</span>
          </div>
          <nav className="ad-tabs">
            {TABS.map(([k, l]) => <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}
          </nav>
          <div className="ad-top-r">
            <a className="ad-btn ad-btn--ghost" href="/" target="_blank" rel="noreferrer">View site ↗</a>
            <details className="ad-more">
              <summary aria-label="More">⋯</summary>
              <div>
                <span className="ad-muted">{user.email}</span>
                <button onClick={backup}>Download backup</button>
                <button onClick={resetDefaults}>Load original menu</button>
                <button onClick={() => signOut(auth)}>Sign out</button>
              </div>
            </details>
          </div>
        </div>
      </header>

      {!live && (
        <div className="ad-note">
          Nothing published yet — the website is showing the menu from the code. Make your changes (or none) and press <b>Publish</b> to take control from here.
        </div>
      )}

      <div className="ad-body">
        {tab === "menu" && <MenuEditor c={draft} set={set} />}
        {tab === "deals" && <DealsEditor c={draft} set={set} />}
        {tab === "home" && <HomeEditor c={draft} set={set} />}
        {tab === "site" && <SiteEditor c={draft} set={set} />}
      </div>

      <div className={`ad-bar${dirty || status.m || !live ? " on" : ""}`}>
        <span className={`ad-bar-m ${status.t ? `is-${status.t}` : ""}`}>
          {status.m || (dirty ? "You have unpublished changes." : "")}
        </span>
        {dirty && <button className="ad-btn ad-btn--ghost" onClick={discard} disabled={busy}>Discard</button>}
        <button className="ad-btn" onClick={publish} disabled={busy || (!dirty && live)}>{busy ? "Publishing…" : "Publish"}</button>
      </div>
    </div>
  );
}
