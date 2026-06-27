import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../api/client";
import type { CitizenReport } from "../api/client";
import AppNav from "../components/AppNav";

type UrgentReport = CitizenReport & {
  author_name?: string;
  photo_url?: string;
  image_url?: string;
  boost_count?: number;
  view_count?: number;
};

const categoryLabels: Record<string, string> = {
  pollution: "Pollution",
  habitat_damage: "Habitat damage",
  fire: "Fire / Smoke",
  injured_animal: "Injured animal",
  illegal_dumping: "Illegal dumping",
  wildlife_risk: "Wildlife risk",
  deforestation: "Deforestation",
  water_contamination: "Water contamination",
  flood: "Flood",
  flooding: "Flooding",
  wildfire: "Wildfire",
};

const categoryIcons: Record<string, string> = {
  pollution: "🧪",
  habitat_damage: "🏚️",
  fire: "🔥",
  injured_animal: "🐾",
  illegal_dumping: "🗑️",
  wildlife_risk: "🦎",
  deforestation: "🌲",
  water_contamination: "💧",
  flood: "🌊",
  flooding: "🌊",
  wildfire: "🔥",
};

function formatLabel(value?: string) {
  if (!value) return "Unknown";

  return (
    categoryLabels[value] ||
    value
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

function formatDate(value?: string) {
  if (!value) return "Unknown date";

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getMapUrl(report: UrgentReport) {
  return `https://www.google.com/maps/dir/?api=1&destination=${report.latitude},${report.longitude}`;
}

function getBoostScore(report: UrgentReport) {
  return (report.boost_count || 0) * 100 + (report.view_count || 0);
}

function UrgentPage() {
  const [reports, setReports] = useState<UrgentReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<UrgentReport | null>(null);
  const [category, setCategory] = useState("all");
  const [urgentFilter, setUrgentFilter] = useState<"all" | "high" | "boosted">(
  "all"
);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function isHighPriority(report: UrgentReport) {
    return report.urgency?.toLowerCase() === "high";
  }

  function isBoosted(report: UrgentReport) {
    return (report.boost_count || 0) > 0;
  }

  const urgentPool = useMemo(() => {
    return reports.filter(
      (report) => isHighPriority(report) || isBoosted(report)
    );
  }, [reports]);

  const categories = useMemo(() => {
    const unique = new Set(
      urgentPool.map((report) => report.category).filter(Boolean)
    );

    return Array.from(unique) as string[];
  }, [urgentPool]);

  const urgentReports = useMemo(() => {
    let filtered = urgentPool;

    if (urgentFilter === "high") {
      filtered = filtered.filter((report) => isHighPriority(report));
    }

    if (urgentFilter === "boosted") {
      filtered = filtered.filter((report) => isBoosted(report));
    }

    if (category !== "all") {
      filtered = filtered.filter((report) => report.category === category);
    }

    return [...filtered].sort((a, b) => {
      const boostDifference = (b.boost_count || 0) - (a.boost_count || 0);

      if (boostDifference !== 0) {
        return boostDifference;
      }

      const highDifference =
        Number(isHighPriority(b)) - Number(isHighPriority(a));

      if (highDifference !== 0) {
        return highDifference;
      }

      const viewDifference = (b.view_count || 0) - (a.view_count || 0);

      if (viewDifference !== 0) {
        return viewDifference;
      }

      return (
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
      );
    });
  }, [urgentPool, urgentFilter, category]);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        setError("");

        const data = await api.getReports(100);
        setReports(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load urgent reports");
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  function updateReportCounts(
    reportId: string,
    counts: { view_count: number; boost_count: number }
  ) {
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              view_count: counts.view_count,
              boost_count: counts.boost_count,
            }
          : report
      )
    );

    setSelectedReport((currentReport) =>
      currentReport?.id === reportId
        ? {
            ...currentReport,
            view_count: counts.view_count,
            boost_count: counts.boost_count,
          }
        : currentReport
    );
  }

  async function handleOpenReport(report: UrgentReport) {
    setSelectedReport(report);

    const viewKey = `gaia.viewed_report.${report.id}`;

    if (localStorage.getItem(viewKey)) {
      return;
    }

    localStorage.setItem(viewKey, "true");

    try {
      const counts = await api.viewReport(report.id);
      updateReportCounts(report.id, counts);
    } catch (error) {
      console.error("Failed to count report view:", error);
    }
  }

  async function handleBoostReport() {
    if (!selectedReport) return;

    const boostKey = `gaia.boosted_report.${selectedReport.id}`;

    if (localStorage.getItem(boostKey)) {
      return;
    }

    localStorage.setItem(boostKey, "true");

    try {
      const counts = await api.boostReport(selectedReport.id);
      updateReportCounts(selectedReport.id, counts);
    } catch (error) {
      console.error("Failed to boost report:", error);
    }
  }

  function hasBoosted(reportId: string) {
    return localStorage.getItem(`gaia.boosted_report.${reportId}`) === "true";
  }

  return (
    <main className="board-page">
      <header className="board-header">
        <div>
          <p className="board-kicker">High priority signals</p>
          <h2>Urgent reports</h2>
          <p>
            Only high-priority reports, ranked by boosts, views, and newest
            activity.
          </p>
        </div>

        <AppNav/>
      </header>

      <section className="urgent-card">
        <div className="urgent-summary urgent-summary-single">
          <div>
            <strong>{urgentPool.length}</strong>
            <span>urgent reports: high priority + boosted</span>
          </div>
        </div>

        <div className="urgent-priority-filters">
          <button
            className={urgentFilter === "all" ? "active" : ""}
            onClick={() => setUrgentFilter("all")}
          >
            All urgent
          </button>

          <button
            className={urgentFilter === "high" ? "active" : ""}
            onClick={() => setUrgentFilter("high")}
          >
            High priority
          </button>

          <button
            className={urgentFilter === "boosted" ? "active" : ""}
            onClick={() => setUrgentFilter("boosted")}
          >
            Most boosted
          </button>
        </div>

        <div className="urgent-category-filters">
          <button
            className={category === "all" ? "active" : ""}
            onClick={() => setCategory("all")}
          >
            All categories
          </button>

          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {formatLabel(item)}
            </button>
          ))}
        </div>

        {loading && <p className="board-status">Loading urgent postcards...</p>}
        {error && <p className="board-status error">{error}</p>}
      </section>

      <section className="postcard-board">
        {!loading && urgentReports.length === 0 && (
          <p className="board-status">
            No high-priority reports yet. The urgent board is quiet for now.
          </p>
        )}

        {urgentReports.map((report, index) => {
          const image = report.photo_url || report.image_url;
          const icon = categoryIcons[report.category || ""] || "📍";

          return (
            <button
              className={`postcard-card tilt-${index % 4}`}
              key={report.id}
              onClick={() => handleOpenReport(report)}
            >
              <span className="push-pin" />
              <span className="urgent-rank-badge">#{index + 1}</span>

              <div className="postcard-photo">
                {image ? (
                  <img src={image} alt={report.title} />
                ) : (
                  <span>No photo yet</span>
                )}
              </div>

              <div className="postcard-meta">
                <small>
                  <b className={`urgency-dot ${report.urgency || "low"}`} />
                  {formatLabel(report.category)}
                </small>

                <h3>{report.title}</h3>

                <p>
                  {icon} High · {formatDate(report.created_at)}
                </p>

                <footer>
                  <em>— {report.author_name || "Gaia Tester"}</em>
                  <span>♡ {report.boost_count || 0}</span>
                  <span>👁 {report.view_count || 0}</span>
                </footer>
              </div>
            </button>
          );
        })}
      </section>

      {selectedReport && (
        <section
          className="postcard-modal"
          onClick={() => setSelectedReport(null)}
        >
          <article
            className="postcard-detail"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="postcard-close"
              onClick={() => setSelectedReport(null)}
            >
              ←
            </button>

            <p className="postcard-title-label">Urgent postcard</p>

            <div className="detail-photo">
              {selectedReport.photo_url || selectedReport.image_url ? (
                <img
                  src={selectedReport.photo_url || selectedReport.image_url}
                  alt={selectedReport.title}
                />
              ) : (
                <span>No photo attached</span>
              )}
            </div>

            <div className="detail-stamps">
              <span className={`stamp ${selectedReport.urgency || "low"}`}>
                High
              </span>

              <span className="date-stamp">
                Gaia · {formatDate(selectedReport.created_at)}
              </span>

              <span className="views-pill">
                👁 {selectedReport.view_count || 0} views
              </span>
            </div>

            <p className="detail-category">
              {categoryIcons[selectedReport.category || ""] || "📍"}{" "}
              {formatLabel(selectedReport.category)}
            </p>

            <h2>{selectedReport.title}</h2>

            <div className="detail-section">
              <h4>Note from the field</h4>
              <p>{selectedReport.description || "No description provided."}</p>
            </div>

            <div className="detail-grid">
              <div>
                <h4>From</h4>
                <strong>{selectedReport.author_name || "Gaia Tester"}</strong>
              </div>

              <div>
                <h4>When</h4>
                <strong>{formatDate(selectedReport.created_at)}</strong>
              </div>
            </div>

            <a
              className="location-card"
              href={getMapUrl(selectedReport)}
              target="_blank"
              rel="noreferrer"
            >
              <span>📍</span>
              <div>
                <strong>
                  {selectedReport.city || "Unknown city"}
                  {selectedReport.country ? `, ${selectedReport.country}` : ""}
                </strong>
                <small>
                  {selectedReport.latitude}, {selectedReport.longitude}
                </small>
              </div>
            </a>

            <div className="urgent-score-line">
              <strong>Boost score</strong>
              <span>{getBoostScore(selectedReport)}</span>
            </div>

            <button
              className="boost-button"
              onClick={handleBoostReport}
              disabled={hasBoosted(selectedReport.id)}
            >
              {hasBoosted(selectedReport.id)
                ? "Boosted signal"
                : "♡ Boost this signal"}
              <span>{selectedReport.boost_count || 0}</span>
            </button>
          </article>
        </section>
      )}
    </main>
  );
}

export default UrgentPage;