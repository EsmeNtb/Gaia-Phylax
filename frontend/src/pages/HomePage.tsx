import { Link } from "react-router-dom";

function HomePage() {
  return (
    <main className="home-page">
      <nav className="home-nav">
        <strong> Gaia Phylax</strong>
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
        </div>

        <div className="hero-photo">
          <img
            src="../assets/photo_main.png"
          />
        </div>
      </section>
    </main>
  );
}

export default HomePage;