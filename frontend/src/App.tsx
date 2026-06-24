import { useEffect, useMemo, useState } from "react";
import { api } from "./api/client";
import type { FireSignal, CitizenReport, Species } from "./api/client";
import FiresMap from "./components/FiresMap";
import "./styles/index.css";

type ViewMode = "map" | "board" | "urgent" | "pets";

type ExtendedReport = CitizenReport & {
  boost_count?: number;
  like_count?: number;
  vote_count?: number;
};

const urgencyScore: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function App() {
  const [fires, setFires] = useState<FireSignal[]>([]);
  const [reports, setReports] = useState<ExtendedReport[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [intensity, setIntensity] = useState("");
  const [view, setView] = useState<ViewMode>("map");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fireStats = useMemo(() => {
    return fires.reduce(
      (acc, fire) => {
        const key = fire.fire_intensity || "unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [fires]);

  const urgentReports = useMemo(() => {
    return [...reports]
      .sort((a, b) => {
        const votesA = a.boost_count ?? a.like_count ?? a.vote_count ?? 0;
        const votesB = b.boost_count ?? b.like_count ?? b.vote_count ?? 0;

        const urgencyA = urgencyScore[a.urgency || "low"] || 0;
        const urgencyB = urgencyScore[b.urgency || "low"] || 0;

        return urgencyB + votesB - (urgencyA + votesA);
      })
      .slice(0, 5);
  }, [reports]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [firesData, reportsData, speciesData] = await Promise.all([
          api.getFires(intensity || undefined, 300),
          api.getReports(100),
          api.getSpecies(100),
        ]);

        setFires(firesData);
        setReports(reportsData);
        setSpecies(speciesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [intensity]);

  return (
    <main className="app">
      <section className="map-area">
        <FiresMap fires={fires} />

        <header className="top-glass">
          <div className="title-block">
            <p>Gaia Phylax</p>
            <h1>Planet pulse</h1>
          </div>

          <nav className="view-tabs">
            <button
              className={view === "map" ? "active" : ""}
              onClick={() => setView("map")}
            >
              🗺️ Map
            </button>
            <button
              className={view === "board" ? "active" : ""}
              onClick={() => setView("board")}
            >
              📌 Board
            </button>
            <button
              className={view === "urgent" ? "active" : ""}
              onClick={() => setView("urgent")}
            >
              🚨 Urgent
            </button>
            <button
              className={view === "pets" ? "active" : ""}
              onClick={() => setView("pets")}
            >
              🐸 Pets
            </button>
          </nav>
        </header>

        <div className="signal-pills">
          <span>🔥 {fires.length}</span>
          <span>📍 {reports.length}</span>
          <span>🦎 {species.length}</span>
        </div>

        <section className="floating-filters centered">
          <button
            className={!intensity ? "active" : ""}
            onClick={() => setIntensity("")}
          >
            All
          </button>
          <button
            className={intensity === "low" ? "active low" : ""}
            onClick={() => setIntensity("low")}
          >
            Low
          </button>
          <button
            className={intensity === "medium" ? "active medium" : ""}
            onClick={() => setIntensity("medium")}
          >
            Medium
          </button>
          <button
            className={intensity === "high" ? "active high" : ""}
            onClick={() => setIntensity("high")}
          >
            High
          </button>
        </section>

        {loading && <div className="loading-pill">Scanning planet signals...</div>}
        {error && <div className="error-pill">{error}</div>}

        {view !== "map" && (
          <section className="overlay-dashboard">
            {view === "board" && (
              <>
                <div className="overlay-heading">
                  <p>The Board</p>
                  <h2>Pinned environmental signals</h2>
                </div>

                <div className="board-grid">
                  {reports.slice(0, 6).map((report) => (
                    <article key={report.id} className="pin-card">
                      <div className="pin-dot" />
                      <strong>{report.title}</strong>
                      <p>{report.description || "No description provided."}</p>
                      <span>
                        {report.category || "unknown"} · {report.urgency || "low"}
                      </span>
                    </article>
                  ))}
                </div>
              </>
            )}

            {view === "urgent" && (
              <>
                <div className="overlay-heading">
                  <p>Urgent matters</p>
                  <h2>Most critical signals</h2>
                </div>

                <div className="urgent-list">
                  {urgentReports.map((report, index) => (
                    <article key={report.id} className="urgent-card">
                      <span className="urgent-rank">#{index + 1}</span>
                      <div>
                        <strong>{report.title}</strong>
                        <p>{report.description || "No description provided."}</p>
                        <small>
                          {report.category || "unknown"} · {report.urgency || "low"} ·{" "}
                          {(report.boost_count ??
                            report.like_count ??
                            report.vote_count ??
                            0)}{" "}
                          boosts
                        </small>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}

            {view === "pets" && (
              <>
                <div className="overlay-heading">
                  <p>Eco pets</p>
                  <h2>Guardian companions</h2>
                </div>

                <div className="pets-grid">
                  <article className="pet-card active-pet">
                    <span className="pet-emoji">🐸</span>
                    <div>
                      <strong>Pip the Frog</strong>
                      <p>Wetlands guardian · happy</p>
                    </div>
                  </article>

                  <article className="pet-card">
                    <span className="pet-emoji">🐝</span>
                    <div>
                      <strong>Buzz the Bee</strong>
                      <p>Next unlock · 30 pts</p>
                    </div>
                  </article>

                  <article className="pet-card">
                    <span className="pet-emoji">🦋</span>
                    <div>
                      <strong>Monarch Spirit</strong>
                      <p>Migration guardian · locked</p>
                    </div>
                  </article>
                </div>
              </>
            )}
          </section>
        )}
      </section>

      <aside className="side-panel">
        <div className="panel-card">
          <p className="eyebrow">NASA FIRMS</p>
          <h2>Fire intensity</h2>

          <div className="legend">
            <span>
              <b className="dot low-dot" /> Low: {fireStats.low || 0}
            </span>
            <span>
              <b className="dot medium-dot" /> Medium: {fireStats.medium || 0}
            </span>
            <span>
              <b className="dot high-dot" /> High: {fireStats.high || 0}
            </span>
          </div>
        </div>

        <div className="panel-card">
          <p className="eyebrow">Community</p>
          <h2>Recent reports</h2>

          <div className="report-list">
            {reports.slice(0, 6).map((report) => (
              <article key={report.id} className="mini-report">
                <strong>{report.title}</strong>
                <span>
                  {report.category || "unknown"} · {report.urgency || "low"}
                </span>
              </article>
            ))}
          </div>
        </div>
      </aside>
    </main>
  );
}

export default App;