import { Link } from "react-router-dom";

function PetsPage() {
  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Eco pets</p>
          <h1>Seeds and guardians</h1>
          <p>Your impact system, pets, and seed points will live here.</p>
        </div>

        <Link className="primary-link" to="/map">Back to map</Link>
      </header>
    </main>
  );
}

export default PetsPage;