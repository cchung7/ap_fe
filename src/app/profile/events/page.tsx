"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CalendarRange, CheckCircle2, Clock, Shield, User as UserIcon } from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { ProfilePageHero } from "../_components/ProfilePageHero";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  AdminDataTableCard,
  AdminTableViewport,
  AdminTableState,
} from "@/components/ui/table";

type AttendanceStatus = "REGISTERED" | "CHECKED_IN" | "CANCELED";

type AttendanceRow = {
  id: string;
  status: AttendanceStatus;
  registeredAt?: string;
  checkedInAt?: string | null;
  pointsAwarded?: number;
  event?: {
    id: string;
    title: string;
    category: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    description?: string | null;
    pointsValue?: number;
  } | null;
};

type AttendancesResponse = {
  success?: boolean;
  message?: string;
  data?: AttendanceRow[];
};

function formatShortDate(value?: string | Date | null) {
  const date = new Date(value || "");
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatTimeRange(startTime?: string, endTime?: string) {
  if (!startTime || !endTime) return "—";

  const formatOne = (value: string) => {
    const [hoursRaw, minutes] = value.split(":");
    const hours = Number(hoursRaw);

    if (Number.isNaN(hours) || !minutes) return value;

    const suffix = hours >= 12 ? "PM" : "AM";
    const normalized = hours % 12 || 12;
    return `${normalized}:${minutes} ${suffix}`;
  };

  return `${formatOne(startTime)} - ${formatOne(endTime)}`;
}

function formatCategory(category?: string) {
  switch ((category || "").toUpperCase()) {
    case "VOLUNTEERING":
      return "Volunteering";
    case "SOCIAL":
      return "Social";
    case "PROFESSIONAL_DEVELOPMENT":
      return "Professional Dev";
    default:
      return category || "—";
  }
}

function buildProfileBadges(me: any) {
  const role = String(me?.role || "MEMBER").toUpperCase();
  const status = String(me?.status || "PENDING").toUpperCase();

  return [
    {
      key: "role",
      icon:
        role === "ADMIN" ? (
          <Shield size={13} className="text-accent" />
        ) : (
          <UserIcon size={13} className="text-primary" />
        ),
      label: role === "ADMIN" ? "Admin" : "Member",
    },
    {
      key: "status",
      icon:
        status === "ACTIVE" ? (
          <CheckCircle2 size={13} className="text-success" />
        ) : (
          <Clock size={13} className="text-warning" />
        ),
      label:
        status === "ACTIVE"
          ? "Active"
          : status === "SUSPENDED"
            ? "Suspended"
            : "Pending",
    },
  ];
}

function StatusBadge({ status }: { status: AttendanceStatus }) {
  const classes =
    status === "CHECKED_IN"
      ? "border-green-200 bg-green-50 text-green-700"
      : status === "REGISTERED"
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : "border-slate-200 bg-slate-50 text-slate-700";

  const label =
    status === "CHECKED_IN"
      ? "Checked In"
      : status === "REGISTERED"
        ? "Registered"
        : "Canceled";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${classes}`}
    >
      {label}
    </span>
  );
}

export default function ProfileEventsPage() {
  const router = useRouter();
  const { me, loading } = useMe();

  const [rows, setRows] = React.useState<AttendanceRow[]>([]);
  const [loadingRows, setLoadingRows] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (loading) return;
    if (me) return;
    router.replace("/login?next=/profile/events");
  }, [loading, me, router]);

  React.useEffect(() => {
    let alive = true;

    async function loadAttendances() {
      try {
        setLoadingRows(true);
        setError(null);

        const res = await fetch("/api/me/attendances", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const json = (await res.json().catch(() => null)) as AttendancesResponse | null;

        if (!res.ok || !json?.success) {
          throw new Error(json?.message || "Failed to fetch your events");
        }

        if (!alive) return;
        setRows(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "Failed to fetch your events");
        setRows([]);
      } finally {
        if (!alive) return;
        setLoadingRows(false);
      }
    }

    if (!loading && me) {
      void loadAttendances();
    }

    return () => {
      alive = false;
    };
  }, [loading, me]);

  if (loading || !me) return null;

  return (
    <div className="relative space-y-5 overflow-x-hidden overflow-y-hidden pt-5 pb-10 sm:space-y-6 sm:pt-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[20rem] bg-navy-wash opacity-75" />

      <ProfilePageHero
        eyebrow="Member Activity"
        title="My Events"
        subtitle="Review your registrations, check-ins, and points earned."
        badges={buildProfileBadges(me)}
      />

      <AdminDataTableCard
        tableLabel="My Event Activity"
        description="This table shows your attendance state across events."
      >
        <AdminTableViewport>
          <AdminTableState
            loading={loadingRows}
            error={error}
            isEmpty={!loadingRows && !error && rows.length === 0}
            loadingMessage="Loading your events..."
            emptyMessage="You have not registered for any events yet."
          >
            <Table className="admin-table">
              <TableHeader className="admin-table-head">
                <TableRow>
                  <TableHead className="admin-table-head-cell">Event</TableHead>
                  <TableHead className="admin-table-head-cell">Category</TableHead>
                  <TableHead className="admin-table-head-cell">Date</TableHead>
                  <TableHead className="admin-table-head-cell">Time</TableHead>
                  <TableHead className="admin-table-head-cell">Location</TableHead>
                  <TableHead className="admin-table-head-cell">Status</TableHead>
                  <TableHead className="admin-table-head-cell-right">Points</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} className="admin-table-row">
                    <TableCell className="admin-table-cell">
                      <div className="space-y-1">
                        <p className="font-bold text-foreground">
                          {row.event?.title || "Unknown Event"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Registered: {formatShortDate(row.registeredAt)}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="admin-table-cell">
                      {formatCategory(row.event?.category)}
                    </TableCell>

                    <TableCell className="admin-table-cell-muted">
                      {formatShortDate(row.event?.date)}
                    </TableCell>

                    <TableCell className="admin-table-cell-muted">
                      {formatTimeRange(row.event?.startTime, row.event?.endTime)}
                    </TableCell>

                    <TableCell className="admin-table-cell-muted">
                      {row.event?.location || "—"}
                    </TableCell>

                    <TableCell className="admin-table-cell">
                      <StatusBadge status={row.status} />
                    </TableCell>

                    <TableCell className="admin-table-cell-right">
                      {row.status === "CHECKED_IN"
                        ? row.pointsAwarded ?? row.event?.pointsValue ?? 0
                        : 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AdminTableState>
        </AdminTableViewport>
      </AdminDataTableCard>
    </div>
  );
}