import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import { GameStateProvider } from "./Context/index.tsx";
import useDocumentTitle from "./pages/useDocumentTitle";

function App() {
  return (
    <GameStateProvider>
      <BrowserRouter>
        <Routes id="Routes">
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="mini" element={<MiniPage />} />
            <Route path="mega" element={<MegaPage />} />
            <Route path="maxi" element={<MaxiPage />} />
            <Route path="home" element={<AboutPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GameStateProvider>
  );
}

function PageWrapper({ children, title }) {
  useDocumentTitle(title);
  return children;
}

function HomePage() {
  return (
    <PageWrapper title="Boardle: Wordle for Chess Puzzles">
      <Home size={5} gameID={'medium'} />
    </PageWrapper>
  );
}

function MiniPage() {
  return (
    <PageWrapper title="Boardle Mini: Chess Wordle Game">
      <Home size={3} gameID={'easy'} />
    </PageWrapper>
  );
}

function MegaPage() {
  return (
    <PageWrapper title="Boardle Mega: Chess Wordle Game">
      <Home size={7} gameID={'hard'} />
    </PageWrapper>
  );
}

function MaxiPage() {
  return (
    <PageWrapper title="Boardle Maxi: Chess Wordle Game">
      <Home size={9} gameID={'expert'} />
    </PageWrapper>
  );
}

function AboutPage() {
  return (
    <PageWrapper title="Boardle: About">
      <About />
    </PageWrapper>
  );
}

export default App;
