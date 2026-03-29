import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { AnalyzerPage } from "./pages/AnalyzerPage";
import { ResultsPage } from "./pages/ResultsPage";
import { HistoryPage } from "./pages/HistoryPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/analyze",
    Component: AnalyzerPage,
  },
  {
    path: "/results",
    Component: ResultsPage,
  },
  {
    path: "/history",
    Component: HistoryPage,
  },
]);
