import { Link } from "react-router-dom";

function UrgentPage() {
  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Urgent matters</p>
          <h1>Most boosted signals</h1>
          <p>The most voted and critical reports will appear here.</p>
        </div>

        <Link className="primary-link" to="/map">Back to map</Link>
      </header>
    </main>
  );
}

export default UrgentPage;