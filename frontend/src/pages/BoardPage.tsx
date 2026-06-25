import { Link } from "react-router-dom";

function BoardPage() {
  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Community</p>
          <h1>The Board</h1>
          <p>Pinned environmental reports will live here.</p>
        </div>

        <Link className="primary-link" to="/map">Back to map</Link>
      </header>
    </main>
  );
}

export default BoardPage;