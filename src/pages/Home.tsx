import { Link } from "react-router-dom";
import { problems } from "../problems";

export function Home() {
  return (
    <div className="home">
      <h1>Interview Problems</h1>
      <ul className="problem-list">
        {problems.map((problem) => (
          <li key={problem.slug}>
            <Link to={`/problems/${problem.slug}`}>{problem.title}</Link>
            <p>{problem.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
