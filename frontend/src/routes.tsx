import { createBrowserRouter, ScrollRestoration, Outlet } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { AnalyzerPage } from "./pages/AnalyzerPage";
import { ResultsPage } from "./pages/ResultsPage";
import { HistoryPage } from "./pages/HistoryPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsConditionsPage } from "./pages/TermsConditionsPage";
import { AuthModal } from "./components/AuthModal";

const RootLayer = () => (
  <>
    <ScrollRestoration />
    <Outlet />
    <AuthModal />
  </>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayer />,
    children: [
      { index: true, Component: LandingPage },
      { path: "analyze", Component: AnalyzerPage },
      { path: "results", Component: ResultsPage },
      { path: "history", Component: HistoryPage },
      { path: "privacy", Component: PrivacyPolicyPage },
      { path: "terms", Component: TermsConditionsPage },
    ]
  }
]);