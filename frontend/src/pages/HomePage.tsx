import { Link } from "react-router-dom";

function HomePage() {
  return (
    <main className="home-page">
      <nav className="home-nav">
        <strong>🐸 Gaia Phylax</strong>
        <Link to="/map">Enter</Link>
      </nav>

      <section className="home-hero">
        <div>
          <span className="gold-pill">Powered by community + AI</span>
          <h1>The planet’s voice, in your pocket.</h1>
          <p>
            Report pollution, fires, injured wildlife, and species at risk.
            Explore live signals and grow your guardian impact.
          </p>

          <div className="home-actions">
            <Link className="primary-link" to="/map">Start protecting</Link>
            <Link className="secondary-link" to="/board">See the board</Link>
          </div>
        </div>

        <div className="hero-photo">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
            alt="Green landscape"
          />
        </div>
      </section>
    </main>
  );
}

export default HomePage;