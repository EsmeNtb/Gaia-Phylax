import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import petDog from "../assets/babydog1.png";
import petDogHeart from "../assets/babydogloving.png";
import petDogSleep from "../assets/babydogslepping.png";
import petCat from "../assets/kitt.png";
import petCatLove from "../assets/kitt_love.png";
import petCatSleep from "../assets/kitt_sleppy.png";
import giftBox from "../assets/giftbox.png";
import AppNav from "../components/AppNav";

type PetType = "dog" | "cat";

type OwnedPet = {
  unlocked: boolean;
  name: string;
  hunger: number;
  energy: number;
  love: number;
  isSleeping: boolean;
};

type PetState = {
  hasStarted: boolean;
  activeType: PetType | null;
  ownedPets: Record<PetType, OwnedPet>;
};

const STORAGE_KEY = "gaia.pet_state_v2";

const emptyOwnedPet: OwnedPet = {
  unlocked: false,
  name: "",
  hunger: 50,
  energy: 70,
  love: 50,
  isSleeping: false,
};

const defaultPetState: PetState = {
  hasStarted: false,
  activeType: null,
  ownedPets: {
    dog: { ...emptyOwnedPet },
    cat: { ...emptyOwnedPet },
  },
};

function loadInitialPetState(): PetState {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return defaultPetState;
  }

  try {
    const parsed = JSON.parse(saved);

    if (
      typeof parsed.hasStarted === "boolean" &&
      "activeType" in parsed &&
      parsed.ownedPets?.dog &&
      parsed.ownedPets?.cat
    ) {
      return parsed;
    }

    return defaultPetState;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return defaultPetState;
  }
}
const petOptions = [
  {
    type: "dog" as PetType,
    title: "Baby dog",
    description: "Loyal little forest guardian",
    image: petDog,
  },
  {
    type: "cat" as PetType,
    title: "Baby cat",
    description: "Soft little moon guardian",
    image: petCat,
  },
];

const comingSoonPets = [
  { name: "Zumzum", species: "Bee", rarity: "Common" },
  { name: "Croaky", species: "Tree frog", rarity: "Common" },
  { name: "Caparazón", species: "Sea turtle", rarity: "Rare" },
  { name: "Buhito", species: "Owl", rarity: "Rare" },
];

function PetsPage() {
  const [petState, setPetState] = useState<PetState>(loadInitialPetState); 
  const [starterType, setStarterType] = useState<PetType>("dog");
  const [starterName, setStarterName] = useState("");
  const [showLoveFx, setShowLoveFx] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(petState));
  }, [petState]);

  const activePet =
    petState.activeType ? petState.ownedPets[petState.activeType] : null;

  function hatchPet() {
    const cleanName = starterName.trim();

    if (!cleanName) return;

    setPetState({
      hasStarted: true,
      activeType: starterType,
      ownedPets: {
        dog:
          starterType === "dog"
            ? {
                unlocked: true,
                name: cleanName,
                hunger: 60,
                energy: 80,
                love: 70,
                isSleeping: false,
              }
            : { ...emptyOwnedPet },
        cat:
          starterType === "cat"
            ? {
                unlocked: true,
                name: cleanName,
                hunger: 60,
                energy: 80,
                love: 70,
                isSleeping: false,
              }
            : { ...emptyOwnedPet },
      },
    });

    setShowLoveFx(false);
  }

  function updateActivePet(updater: (pet: OwnedPet) => OwnedPet) {
    if (!petState.activeType) return;

    setPetState((current) => ({
      ...current,
      ownedPets: {
        ...current.ownedPets,
        [current.activeType as PetType]: updater(
          current.ownedPets[current.activeType as PetType]
        ),
      },
    }));
  }

  function feedPet() {
    if (!activePet) return;

    updateActivePet((current) => ({
      ...current,
      hunger: Math.min(current.hunger + 15, 100),
      love: Math.min(current.love + 8, 100),
      isSleeping: false,
    }));

    setShowLoveFx(true);
    setTimeout(() => setShowLoveFx(false), 1400);
  }

  function toggleSleep() {
    if (!activePet) return;

    updateActivePet((current) => ({
      ...current,
      isSleeping: !current.isSleeping,
      energy: current.isSleeping
        ? current.energy
        : Math.min(current.energy + 20, 100),
    }));

    setShowLoveFx(false);
  }

  function switchPet(type: PetType) {
    const targetPet = petState.ownedPets[type];

    if (!targetPet.unlocked) return;

    setPetState((current) => ({
      ...current,
      activeType: type,
    }));

    setShowLoveFx(false);
  }

  function getPetImage() {
    if (!petState.activeType || !activePet) return null;

    if (petState.activeType === "dog") {
      if (activePet.isSleeping) return petDogSleep;
      if (showLoveFx) return petDogHeart;
      return petDog;
    }

    if (petState.activeType === "cat") {
      if (showLoveFx) return petCatLove;
      return petCat;
    }

    return null;
  }

  const petImage = getPetImage();

  return (
    <main className="pets-page">
      <header className="pets-header">
        <div>
          <p className="board-kicker">Gaia Companion :3</p>
          <h2>Gaia Pets with love</h2>
          <p>
            Care for your baby companion, grow affection, and build your Gaia
            bond.
          </p>
        </div>

        <AppNav/>
      </header>

      {!petState.hasStarted ? (
        <section className="pet-welcome-card">
          <p className="gift-kicker">Your first gaia companion is waiting!!!</p>
          <h2>Name your baby companion</h2>

          <div className="starter-form">
            <label>
              Pet name
              <input
                value={starterName}
                onChange={(event) => setStarterName(event.target.value)}
                placeholder="Milo, Luna, Croqueta..."
                maxLength={18}
              />
            </label>

            <div className="starter-pet-picker">
              {petOptions.map((option) => (
                <button
                  key={option.type}
                  type="button"
                  className={starterType === option.type ? "active" : ""}
                  onClick={() => setStarterType(option.type)}
                >
                  <img src={option.image} alt={option.title} />
                  <strong>{option.title}</strong>
                  <span>{option.description}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            className="gift-box-button"
            onClick={hatchPet}
            disabled={!starterName.trim()}
          >
            <img src={giftBox} alt="Gift box" />
            <span>Open present</span>
          </button>

          <p className="gift-note">
            Choose carefully. The other starter companion will stay locked until
            you unlock it later :3.
          </p>
        </section>
      ) : (
        <>
          <section className="pet-room-shell">
            <aside className="pet-stats-card">
              <h2>{activePet?.name || "Guardian"}</h2>

              <p className="pet-subtitle">
                {petState.activeType === "dog"
                  ? "Baby dog guardian"
                  : "Baby cat guardian"}
              </p>

              <div className="stat-line">
                <span>Hunger</span>
                <strong>{activePet?.hunger || 0}/100</strong>
              </div>
              <div className="stat-bar">
                <div style={{ width: `${activePet?.hunger || 0}%` }} />
              </div>

              <div className="stat-line">
                <span>Energy</span>
                <strong>{activePet?.energy || 0}/100</strong>
              </div>
              <div className="stat-bar">
                <div style={{ width: `${activePet?.energy || 0}%` }} />
              </div>

              <div className="stat-line">
                <span>Love</span>
                <strong>{activePet?.love || 0}/100</strong>
              </div>
              <div className="stat-bar">
                <div style={{ width: `${activePet?.love || 0}%` }} />
              </div>

              <div className="pet-actions">
                <button type="button" onClick={feedPet}>
                  Feed
                </button>

                <button type="button" onClick={toggleSleep}>
                  {activePet?.isSleeping ? "Wake up" : "Sleep"}
                </button>
              </div>
            </aside>

            <section className="pet-room-card">
              <div className="pet-room-top">
                <span className="room-badge">My companion room</span>

                <span
                  className={`room-status ${
                    activePet?.isSleeping ? "sleeping" : "awake"
                  }`}
                >
                  {activePet?.isSleeping ? "Sleeping" : "Awake"}
                </span>
              </div>

              <div className="pet-room">
                {showLoveFx && (
                  <div className="pet-love-fx">
                  </div>
                )}

                {activePet?.isSleeping && (
                  <div className="pet-sleep-fx">
                  </div>
                )}

                {petImage && (
                  <img
                    className={`pet-character ${
                      activePet?.isSleeping ? "pet-sleeping" : ""
                    }`}
                    src={petImage}
                    alt={activePet?.name || "Pet"}
                  />
                )}
              </div>
            </section>
          </section>

          <section className="pet-collection-section">
            <div className="pet-collection-header">
              <div>
                <p className="board-kicker">Gaia Companion collection</p>
                <h2>My companions</h2>
              </div>

              <p>
                Choose your active companion. Locked pets can be named when you
                unlock them.
              </p>
            </div>

            <div className="pet-collection-grid">
              {petOptions.map((option) => {
                const ownedPet = petState.ownedPets[option.type];
                const isActive = petState.activeType === option.type;

                return (
                  <article
                    key={option.type}
                    className={`pet-collection-card ${
                      isActive ? "active" : ""
                    } ${ownedPet.unlocked ? "" : "locked"}`}
                  >
                    <img src={option.image} alt={option.title} />

                    <h3>{ownedPet.unlocked ? ownedPet.name : option.title}</h3>
                    <p>{option.description}</p>

                    {ownedPet.unlocked ? (
                      <button
                        type="button"
                        onClick={() => switchPet(option.type)}
                      >
                        {isActive ? "Active" : "Choose"}
                      </button>
                    ) : (
                      <>
                        <span className="pet-lock-badge">Locked</span>
                        <button type="button" disabled>
                          Name when unlocked
                        </button>
                      </>
                    )}
                  </article>
                );
              })}

              {comingSoonPets.map((lockedPet) => (
                <article
                  className="pet-collection-card locked"
                  key={lockedPet.name}
                >
                  <div className="locked-pet-icon">?</div>
                  <h3>{lockedPet.name}</h3>
                  <p>{lockedPet.species}</p>
                  <span>{lockedPet.rarity}</span>
                  <button type="button" disabled>
                    Coming soon
                  </button>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default PetsPage;