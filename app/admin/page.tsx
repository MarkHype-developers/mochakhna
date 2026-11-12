"use client";

import dynamic from "next/dynamic";
import { FIREBASE_READY } from "@/lib/content";
import SetupHelp from "@/components/admin/SetupHelp";

// the Firebase SDK is only downloaded here, on /admin
const Admin = dynamic(() => import("@/components/admin/Admin"), { ssr: false, loading: () => <div className="ad-loading">Loading admin…</div> });

export default function AdminPage() {
  return FIREBASE_READY ? <Admin /> : <SetupHelp />;
}
