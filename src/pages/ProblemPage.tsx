import { Link, Navigate, useParams } from "react-router-dom";
import { problems } from "../problems";

export function ProblemPage() {
  const { slug } = useParams<{ slug: string }>();
  const problem = problems.find((p) => p.slug === slug);

  if (!problem) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="problem-page">
      <Link to="/" className="back-link">
        ← Back to problems
      </Link>
      <h1>{problem.title}</h1>
      {problem.element}
    </div>
  );
}
