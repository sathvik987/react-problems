import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { ProblemPage } from "./pages/ProblemPage";

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/problems/:slug" element={<ProblemPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
