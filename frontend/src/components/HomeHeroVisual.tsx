import iconEarth from "../assets/earth.png";
import iconFire from "../assets/fireHome.png";
import iconPin from "../assets/home_pin.png";
import iconIguana from "../assets/iguana.png";
import { Link } from "react-router-dom";

function HomeHeroVisual() {
  return (
    <section className="home-visual-card">
      <div className="visual-sky" />

      <div className="visual-map-card">
        <div className="visual-header">
            <img src={iconEarth} alt="Earth" />
          Planet pulse
          <strong>Live</strong>
        </div>

        <div className="visual-signal fire-signal">
          <img src={iconFire} alt="Fire" />
          <div>
            <strong>Fire signal</strong>
            <small>High intensity</small>
          </div>
        </div>

        <div className="visual-signal report-signal">
          <img src={iconPin} alt="Pin" />
          <div>
            <strong>Citizen report</strong>
            <small>Pollution near canal</small>
          </div>
        </div>

        <div className="visual-signal species-signal">
          <img src={iconIguana} alt="Iguana" />
          <div>
            <strong>Species nearby</strong>
            <small>Animalia catalog</small>
          </div>
        </div>
      </div>

      <div className="seed-chip">
        <img src={iconSeed} alt="Seed" />
        <div>
          <strong>+10 seeds</strong>
          <small>Report submitted</small>
        </div>
      </div>

      <Link to="/report" className="floating-report-link">
        + New report
      </Link>
    </section>
  );
}

export default HomeHeroVisual;