import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { Species } from "../api/client";
import AppNav from "../components/AppNav";
function SpeciesPage() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSpecies() {
      try {
        setLoading(true);
        setMessage("");

        const data = await api.getSpecies(100);
        setSpecies(data);
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Failed to load species."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSpecies();
  }, []);

  async function handleSearch(event: FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      if (!query.trim()) {
        const data = await api.getSpecies(100);
        setSpecies(data);
        return;
      }

      const data = await api.searchSpecies(query.trim(), 100);
      setSpecies(data);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to search species."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <header className="page-header compact">
        <div>
          <p className="eyebrow">Animalia catalog</p>
          <h1>Species intelligence</h1>
          <p>Search scientific names and taxonomy signals from your dataset.</p>
        </div>

        <AppNav/>
      </header>

      <section className="species-card">
        <form className="species-search" onSubmit={handleSearch}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search: Ambystoma, Panthera, Danaus..."
          />

          <button className="primary-link">Search</button>
        </form>

        {loading && <p className="form-message">Loading species...</p>}
        {message && <p className="form-message">{message}</p>}

        <div className="species-grid">
          {species.slice(0, 24).map((item, index) => (
            <article
              key={item.id ?? item.taxon_id ?? index}
              className="species-tile"
            >
              <span>🦎</span>
              <strong>
                {item.scientific_name || "Unknown scientific name"}
              </strong>

              <p>
                {item.taxon_rank || "taxon"} ·{" "}
                {item.taxonomic_status || "unknown status"}
              </p>

              <small>
                {item.family || "unknown family"}{" "}
                {item.genus ? `· ${item.genus}` : ""}
              </small>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default SpeciesPage;