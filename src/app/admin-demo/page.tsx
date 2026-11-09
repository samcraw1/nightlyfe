import { Suspense } from "react";
import AdminDemo from "@/components/admin-demo/AdminDemo";
import VenueAdminDemo from "@/components/admin-demo/venue/VenueAdminDemo";
import { venue } from "@/config/venue";

export default function AdminDemoPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-6 py-24 text-sm text-muted">Loading dashboard…</div>}>
      {venue.features.venueDashboard ? <VenueAdminDemo /> : <AdminDemo />}
    </Suspense>
  );
}
