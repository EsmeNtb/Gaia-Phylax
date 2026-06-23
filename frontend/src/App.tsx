import { useEffect, useMemo, useState } from "react";
import { api, FireSignal, CitizenReport, Species } from "./api/clients";
import "./styles/index.css";

function App() {
  const [fires, setFires] = useState<FireSignal[]>([]);
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [intensity, setIntensity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [firesData, reportsData, speciesData] = await Promise.all([
          api.getFires(intensity || undefined, 100),
          api.getReports(100),
          api.getSpecies(100),
        ]);

        setFires(firesData);
        setReports(reportsData);
        setSpecies(speciesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [intensity]);

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Gaia Phylax</p>
        <h1>Planet pulse dashboard</h1>
        <p>
          Fire signals, citizen reports, and species intelligence flowing from
          FastAPI and Supabase.
        </p>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span>🔥</span>
          <strong>{fires.length}</strong>
          <p>Fire signals loaded</p>
        </article>

        <article className="stat-card">
          <span>📍</span>
          <strong>{reports.length}</strong>
          <p>Citizen reports</p>
        </article>

        <article className="stat-card">
          <span>🦎</span>
          <strong>{species.length}</strong>
          <p>Species preview</p>
        </article>
      </section>

      <section className="filters">
        <button
          className={intensity === "" ? "active" : ""}
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

      {loading && <p className="status-text">Loading Gaia signals...</p>}
      {error && <p className="error-text">{error}</p>}

      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">NASA FIRMS</p>
              <h2>Fire signals</h2>
            </div>
            <div className="mini-stats">
              <span>Low: {fireStats.low || 0}</span>
              <span>Medium: {fireStats.medium || 0}</span>
              <span>High: {fireStats.high || 0}</span>
            </div>
          </div>

          <div className="fire-list">
            {fires.slice(0, 12).map((fire) => (
              <div key={fire.id} className={`fire-card ${fire.fire_intensity}`}>
                <div>
                  <strong>{fire.fire_intensity}</strong>
                  <p>
                    {fire.latitude.toFixed(3)}, {fire.longitude.toFixed(3)}
                  </p>
                </div>
                <div>
                  <span>FRP {fire.frp}</span>
                  <small>{fire.daynight === "D" ? "Day" : "Night"}</small>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Community</p>
              <h2>Citizen reports</h2>
            </div>
          </div>

          <div className="report-list">
            {reports.slice(0, 6).map((report) => (
              <div key={report.id} className="report-card">
                <strong>{report.title}</strong>
                <p>{report.description}</p>
                <small>
                  {report.category} · {report.urgency} · {report.city}
                </small>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

export default App;