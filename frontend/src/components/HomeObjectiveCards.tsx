import { Link } from "react-router-dom";

import iconMap from "../assets/route.png";
import iconReport from "../assets/megafono.png";
import iconSpecies from "../assets/iguana.png";

const objectives = [
  {
    icon: iconMap,
    title: "Live environmental map",
    text: "Visualize fires, community reports, and ecological signals in one place.",
  },
  {
    icon: iconReport,
    title: "Citizen reporting",
    text: "Send alerts about pollution, injured animals, habitat damage, or fire.",
  },
  {
    icon: iconSpecies,
    title: "Species awareness",
    text: "Connect reports with species and taxonomy data from your catalog.",
  },
];

function HomeObjectiveCards() {
  return (
    <section className="objective-grid">
      {objectives.map((item) => (
        <article className="objective-card" key={item.title}>
          <img src={item.icon} alt={item.title} />
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </section>
  );
}

export default HomeObjectiveCards;