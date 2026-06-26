import { Link } from "react-router-dom";

function HomeNav() {
  return (
    <nav className="home-nav">
      <Link to="/" className="brand-mark">
        <strong>Gaia Phylax</strong>
      </Link>

      <Link to="/map" className="nav-enter">
        Enter
      </Link>
    </nav>
  );
}

export default HomeNav;