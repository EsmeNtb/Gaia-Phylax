import AppNav from "../components/AppNav";
import { useAuth } from "../auth";
import iconAvatar from "../assets/dinosaur-32.png"

function ProfilePage() {
  const { user, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    window.location.href = "/";
  }

  return (
    <main className="page-shell">
      <header className="page-header compact">
        <div>
          <p className="home-kicker">Gaia profile</p>
          <h2>My profile</h2>
          <p>Manage your account, session, and Gaia identity.</p>
        </div>

        <AppNav />
      </header>

      <section className="profile-card">
        <div className="profile-avatar">
          {user?.picture ? (
            <img src={user.picture} alt={user.name} />
          ) : (
            <img src={iconAvatar} alt="Avatar" />
          )}
        </div>

        <p className="profile-label">Signed in as</p>
        <h2>{user?.name || "Gaia Guardian"}</h2>
        <p>{user?.email || "No email available"}</p>

        <div className="profile-stats">
          <article>
            <strong>{user?.points || 0}</strong>
            <span>points</span>
          </article>

          <article>
            <strong>{user?.level || 1}</strong>
            <span>level</span>
          </article>

          <article>
            <strong>{user?.unlocked_pets?.length || 0}</strong>
            <span>pets</span>
          </article>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Log out
        </button>
      </section>
    </main>
  );
}

export default ProfilePage;