// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import DashboardLayout from "./components/layout/DashboardLayout";

import Landing from "./pages/Landing";
import Pricing from "./pages/Pricing";
import Docs from "./pages/Docs";
import Register from "./pages/Register";
import Login from "./pages/Login";

import Overview from "./pages/dashboard/Overview";
import Sessions from "./pages/dashboard/Sessions";
import ApiKeys from "./pages/dashboard/ApiKeys";
import Playground from "./pages/dashboard/Playground";
import NewSession from "./pages/NewSession";
import JoinSession from "./pages/JoinSession";
import ShareSession from "./pages/ShareSession";
import SessionResult from "./pages/SessionResult";
function ProtectedRoute({ children }) {
  const key = localStorage.getItem("cg_api_key");
  return key ? children : <Navigate to="/login" replace />;
}

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Landing />
            </PublicLayout>
          }
        />
        <Route
          path="/pricing"
          element={
            <PublicLayout>
              <Pricing />
            </PublicLayout>
          }
        />
        <Route
          path="/docs"
          element={
            <PublicLayout>
              <Docs />
            </PublicLayout>
          }
        />
        <Route
          path="/register"
          element={
            <PublicLayout>
              <Register />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />
        <Route
          path="/session/new"
          element={
            <PublicLayout>
              <NewSession />
            </PublicLayout>
          }
        />
        <Route
          path="/session/:sessionId/share"
          element={
            <PublicLayout>
              <ShareSession />
            </PublicLayout>
          }
        />
        <Route
          path="/session/:sessionId/result"
          element={
            <PublicLayout>
              <SessionResult />
            </PublicLayout>
          }
        />
        <Route
          path="/join/:sessionId"
          element={
            <PublicLayout>
              <JoinSession />
            </PublicLayout>
          }
        />

        {/* Dashboard (protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <DashboardLayout />
              </>
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="keys" element={<ApiKeys />} />
          <Route path="playground" element={<Playground />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
