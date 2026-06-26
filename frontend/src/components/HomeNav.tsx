import { Link } from "react-router-dom";

function HomeNav() {
  return (
    <nav className="home-nav">
      <Link to="/" className="brand-mark">
        <strong>
          <span className="brand-gaia">Gaia</span>{" "}
          <span className="brand-phylax">Phylax</span>
        </strong>
      </Link>

      <Link to="/auth" className="nav-enter">
        Login/Sign Up
      </Link>
    </nav>
  );
}

export default HomeNav;