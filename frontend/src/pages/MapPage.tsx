import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../api/client";
import type { FireSignal, CitizenReport, Species } from "../api/client";
import FiresMap from "../components/FiresMap";

import iconDirection from "../assets/direction.png";
import iconSiren from "../assets/siren.png";
import iconExplotion from "../assets/explosion.png";
import iconCamera from "../assets/camera.png";
import iconCat from "../assets/cat_footprint.png";
import iconLocation from "../assets/pin.png";
import iconSpecies from "../assets/bird.png";

type ExtendedReport = CitizenReport & {
  boost_count?: number;
  like_count?: number;
  vote_count?: number;
};

const categoryLabels: Record<string, string> = {
  pollution: "Pollution",
  habitat_damage: "Habitat damage",
  fire: "Fire",
  injured_animal: "Injured animal",
  illegal_dumping: "Illegal dumping",
  wildlife_risk: "Wildlife risk",
  deforestation: "Deforestation",
  water_contamination: "Water contamination",
  flood: "Flood",
  floods: "Floods",
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

function MapPage() {
  const [fires, setFires] = useState<FireSignal[]>([]);
  const [reports, setReports] = useState<ExtendedReport[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [intensity, setIntensity] = useState("");
  const [reportCategory, setReportCategory] = useState("all");
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

  const reportCategories = useMemo(() => {
    const unique = new Set(
      reports.map((report) => report.category).filter(Boolean)
    );

    return Array.from(unique) as string[];
  }, [reports]);

  const filteredReports = useMemo(() => {
    if (reportCategory === "all") return reports;

    return reports.filter((report) => report.category === reportCategory);
  }, [reports, reportCategory]);

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
    <main className="map-page">
      <section className="map-main">
        <header className="top-glass">
          <div className="title-block">
            <p>Gaia Phylax</p>
            <h1>Planet pulse</h1>
          </div>

          <nav className="view-tabs">
            <Link className="active" to="/map">
              <img src={iconDirection} alt="Map" />
              Map
            </Link>

            <Link to="/board">
              <img src={iconCamera} alt="Board" />
              Board
            </Link>

            <Link to="/urgent">
              <img src={iconSiren} alt="Urgent" />
              Urgent
            </Link>

            <Link to="/pets">
              <img src={iconCat} alt="Pets" />
              Pets
            </Link>
          </nav>
        </header>

        <section className="map-card">
          <FiresMap fires={fires} />

          <div className="signal-pills">
            <span>
              <img src={iconExplotion} alt="Fires" /> {fires.length}
            </span>

            <span>
              <img src={iconLocation} alt="Reports" /> {reports.length}
            </span>

            <span>
              <img src={iconSpecies} alt="Species" /> {species.length}
            </span>
          </div>

          <section className="map-filter-bar">
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

          {loading && (
            <div className="loading-pill">Scanning planet signals...</div>
          )}

          {error && <div className="error-pill">{error}</div>}
        </section>
      </section>

      <aside className="side-panel">
        <div className="panel-card">
          <p className="eyebrow">Available source</p>
          <h2>Fire signals</h2>
          <h4>Source: NASA FIRMS</h4>

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

          <p className="panel-note">
            Currently the only global environmental dataset connected to Gaia
            Phylax.
          </p>
        </div>

        <div className="panel-card">
          <p className="eyebrow">Community</p>
          <h2>Recent reports</h2>

          <div className="report-category-filters">
            <button
              className={reportCategory === "all" ? "active" : ""}
              onClick={() => setReportCategory("all")}
            >
              All
            </button>

            {reportCategories.map((category) => (
              <button
                key={category}
                className={reportCategory === category ? "active" : ""}
                onClick={() => setReportCategory(category)}
              >
                {formatLabel(category)}
              </button>
            ))}
          </div>

          <p className="report-count">
            Showing {filteredReports.length} of {reports.length} reports
          </p>

          <div className="report-list">
            {filteredReports.slice(0, 6).map((report) => (
              <article key={report.id} className="mini-report">
                <strong>{report.title}</strong>

                <span>
                  {formatLabel(report.category)} · {formatLabel(report.urgency)}
                </span>
              </article>
            ))}
          </div>
        </div>
      </aside>
    </main>
  );
}

export default MapPage;