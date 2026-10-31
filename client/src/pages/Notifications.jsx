import { useEffect, useState } from "react";
import {
  Activity,
  Bell,
  CalendarDays,
  CircleAlert,
  RefreshCw,
  Send,
  UserRound,
} from "lucide-react";

const auditUrl = "http://127.0.0.1:5000/audit";

function getActivityIcon(entity) {
  switch (String(entity || "").toLowerCase()) {
    case "patient":
      return UserRound;
    case "session":
      return CalendarDays;
    case "referral":
      return Send;
    default:
      return Activity;
  }
}

function formatTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time unavailable";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem("token")),
  );
  const [error, setError] = useState(() =>
    localStorage.getItem("token")
      ? ""
      : "Your session is unavailable. Please sign in again.",
  );
  const [reloadKey, setReloadKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const controller = new AbortController();

    if (!token) return () => controller.abort();

    fetch(auditUrl, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok)
          throw new Error(data.error || "Could not load notifications.");
        if (!Array.isArray(data))
          throw new Error("The activity feed returned an unexpected response.");
        return data;
      })
      .then((data) => {
        setNotifications(data);
        setLastUpdated(new Date());
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Could not load notifications.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  const unreadCount = notifications.filter((item) => !item.is_read).length;
  const visibleNotifications =
    filter === "unread"
      ? notifications.filter((item) => !item.is_read)
      : notifications;

  function handleRefresh() {
    if (!localStorage.getItem("token")) {
      setError("Your session is unavailable. Please sign in again.");
      return;
    }
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-4xl border border-white/40 bg-white/50 px-5 py-5 shadow-[10px_10px_24px_rgba(15,23,42,0.07),-10px_-10px_24px_rgba(255,255,255,0.75)] backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E8EEFA] text-[#12223E] shadow-[inset_3px_3px_7px_rgba(15,23,42,0.07),inset_-3px_-3px_7px_rgba(255,255,255,0.9)]">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#12223E]">
              Notifications
            </h1>
            <p className="mt-1 text-sm text-[#4A6EA0]">
              Recent activity from your clinic
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          {lastUpdated && !loading && (
            <span className="text-xs text-[#4A6EA0]">
              Updated {formatTimestamp(lastUpdated)}
            </span>
          )}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Refresh notifications"
            title="Refresh notifications"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/70 bg-white/60 text-[#12223E] shadow-sm transition hover:bg-white disabled:cursor-wait disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#12223E]/30"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      <section
        aria-label="Activity notifications"
        className="overflow-hidden rounded-3xl border border-white/50 bg-white/45 shadow-[0_8px_24px_rgba(15,23,42,0.05)] backdrop-blur-sm"
      >
        <div className="flex flex-col gap-4 border-b border-[#12223E]/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-base font-semibold text-[#12223E]">
              Activity feed
            </h2>
            <p className="mt-1 text-sm text-[#4A6EA0]">
              {notifications.length}{" "}
              {notifications.length === 1 ? "update" : "updates"}
              {unreadCount > 0 ? ` | ${unreadCount} unread` : ""}
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter notifications"
            className="inline-flex w-fit rounded-xl border border-[#12223E]/10 bg-[#E8EEFA]/70 p-1"
          >
            {[
              { value: "all", label: "All" },
              { value: "unread", label: "Unread" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={filter === option.value}
                onClick={() => setFilter(option.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#12223E]/30 ${filter === option.value ? "bg-white text-[#12223E] shadow-sm" : "text-[#4A6EA0] hover:text-[#12223E]"}`}
              >
                {option.label}
                {option.value === "unread" && unreadCount > 0 && (
                  <span className="ml-2 text-xs text-cyan-700">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div
            role="alert"
            className="flex items-start gap-3 px-5 py-10 text-sm text-rose-700 sm:px-6"
          >
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Notifications could not be loaded</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        ) : loading ? (
          <div
            role="status"
            className="px-5 py-12 text-center text-sm text-[#4A6EA0] sm:px-6"
          >
            Loading activity...
          </div>
        ) : visibleNotifications.length === 0 ? (
          <div className="px-5 py-12 text-center sm:px-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E8EEFA] text-[#4A6EA0]">
              <Bell className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-[#12223E]">
              {filter === "unread"
                ? "You are all caught up"
                : "No activity yet"}
            </p>
            <p className="mt-1 text-sm text-[#4A6EA0]">
              {filter === "unread"
                ? "There are no unread updates."
                : "New clinic activity will appear here."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#12223E]/10">
            {visibleNotifications.map((notification, index) => {
              const Icon = getActivityIcon(notification.entity);
              return (
                <li
                  key={`${notification.created_at}-${notification.entity}-${notification.action}-${index}`}
                  className="flex gap-3 px-4 py-4 transition hover:bg-white/50 sm:gap-4 sm:px-6"
                >
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8EEFA] text-[#36577F]">
                    <Icon className="h-5 w-5" />
                    {!notification.is_read && (
                      <span
                        className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-cyan-600"
                        aria-label="Unread"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="text-sm font-semibold capitalize text-[#12223E]">
                        {notification.action || "Activity"}{" "}
                        {notification.entity || "update"}
                      </p>
                      {notification.is_read && (
                        <span className="text-xs text-[#4A6EA0]">Read</span>
                      )}
                    </div>
                    <p className="mt-1 break-words text-sm leading-6 text-[#4A6EA0]">
                      {notification.message ||
                        "A clinic activity was recorded."}
                    </p>
                    <time
                      className="mt-2 block text-xs text-[#4A6EA0]"
                      dateTime={notification.created_at || undefined}
                    >
                      {formatTimestamp(notification.created_at)}
                    </time>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Notifications;
