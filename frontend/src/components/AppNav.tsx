import { Link, useLocation } from "react-router-dom";

import iconDirection from "../assets/direction.png";
import iconSiren from "../assets/siren.png";
import iconCamera from "../assets/camera.png";
import iconCat from "../assets/cat_footprint.png";
import iconAvatar from "../assets/dinosaur-32.png";
import iconPlus from "../assets/plus.png";

function AppNav() {
  const location = useLocation();

  function isActive(path: string) {
    return location.pathname === path;
  }

  return (
    <nav className="view-tabs app-nav">
      <Link className={isActive("/map") ? "active" : ""} to="/map">
        <img src={iconDirection} alt="Map" />
        Map
      </Link>

      <Link className={isActive("/board") ? "active" : ""} to="/board">
        <img src={iconCamera} alt="Board" />
        Board
      </Link>

      <Link className={isActive("/urgent") ? "active" : ""} to="/urgent">
        <img src={iconSiren} alt="Urgent" />
        Urgent
      </Link>

      <Link className={isActive("/report") ? "active" : ""} to="/report">
        <img src={iconPlus} alt="Report" />
        Report
      </Link>

      <Link className={isActive("/pets") ? "active" : ""} to="/pets">
        <img src={iconCat} alt="Pets" />
        Pets
      </Link>

      <Link className={isActive("/profile") ? "active" : ""} to="/profile">
        <img src={iconAvatar} alt="Profile" />
        Profile
      </Link>
    </nav>
  );
}

export default AppNav;