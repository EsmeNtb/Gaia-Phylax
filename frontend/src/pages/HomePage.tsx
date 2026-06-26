import { Link } from "react-router-dom";
import HomeNav from "../components/HomeNav";
import HomeHeroVisual from "../components/HomeHeroVisual";
import HomeObjectiveCards from "../components/HomeObjectiveCards";

function HomePage() {
  return (
    <main className="home-page">
      <HomeNav />

      <section className="home-hero">
        <div className="home-copy">
          <p className="home-kicker">Environmental signals, made visible.</p>

          <h1>
            The planet’s voice,
            <span> in your pocket.</span>
          </h1>

          <p>
            Report pollution, fires, injured wildlife, and species at risk.
            Explore live alerts and help turn scattered signals into action.
          </p>

          <div className="home-actions">
            <Link className="primary-link" to="/auth">
              Open live map
            </Link>

            <Link className="secondary-link" to="/auth">
              Create report
            </Link>
          </div>
        </div>

        <HomeHeroVisual />
      </section>

      <section className="home-impact-strip">
        <article>
          <strong>NASA FIRMS</strong>
          <span>Fire signals</span>
        </article>

        <article>
          <strong>Citizen reports</strong>
          <span>Community alerts</span>
        </article>

        <article>
          <strong>Animalia</strong>
          <span>Species catalog</span>
        </article>
      </section>

      <HomeObjectiveCards />
    </main>
  );
}

export default HomePage;