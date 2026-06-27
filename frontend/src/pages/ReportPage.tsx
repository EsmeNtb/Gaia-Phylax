import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import AppNav from "../components/AppNav";

function ReportPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("pollution");
  const [urgency, setUrgency] = useState("medium");
  const [latitude, setLatitude] = useState("19.4326");
  const [longitude, setLongitude] = useState("-99.1332");
  const [city, setCity] = useState("Mexico City");
  const [country, setCountry] = useState("Mexico");
  const [relatedSpecies, setRelatedSpecies] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!title.trim()) {
      setMessage("Title is required.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await api.createReport({
        title,
        description,
        category,
        latitude: Number(latitude),
        longitude: Number(longitude),
        country,
        city,
        urgency,
        status: "open",
        related_species: relatedSpecies || undefined,
      });

      setMessage("Report created successfully 🌿");

      setTimeout(() => {
        navigate("/board");
      }, 900);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <header className="page-header compact">
        <div>
          <p className="eyebrow">Citizen signal</p>
          <h1>New Report</h1>
          <p>Send an environmental alert to the Gaia Phylax board.</p>
        </div>

        <AppNav/>
      </header>

      <section className="report-form-card">
        <form onSubmit={handleSubmit} className="report-form">
          <label>
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Plastic waste near canal"
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What did you see? Any wildlife affected?"
            />
          </label>

          <div className="form-grid">
            <label>
              Category
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="pollution">Pollution</option>
                <option value="fire">Fire / Smoke</option>
                <option value="habitat_damage">Habitat damage</option>
                <option value="injured_animal">Injured animal</option>
                <option value="endangered_species">Endangered species</option>
                <option value="illegal_hunting_fishing">Illegal hunting / fishing</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label>
              Urgency
              <select
                value={urgency}
                onChange={(event) => setUrgency(event.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </label>
          </div>

          <div className="form-grid">
            <label>
              Latitude
              <input
                value={latitude}
                onChange={(event) => setLatitude(event.target.value)}
              />
            </label>

            <label>
              Longitude
              <input
                value={longitude}
                onChange={(event) => setLongitude(event.target.value)}
              />
            </label>
          </div>

          <div className="form-grid">
            <label>
              City
              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </label>

            <label>
              Country
              <input
                value={country}
                onChange={(event) => setCountry(event.target.value)}
              />
            </label>
          </div>

          <label>
            Related species
            <input
              value={relatedSpecies}
              onChange={(event) => setRelatedSpecies(event.target.value)}
              placeholder="Ambystoma mexicanum"
            />
          </label>

          {message && <p className="form-message">{message}</p>}

          <button className="primary-link submit-button" disabled={loading}>
            {loading ? "Sending..." : "Send report 🌱"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default ReportPage;