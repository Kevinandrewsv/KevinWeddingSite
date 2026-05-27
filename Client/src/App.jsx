import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { ScrollToTop } from "./components/common";

const Home = lazy(() => import("./pages/public/Home"));
const Events = lazy(() => import("./pages/public/Events"));
const Gallery = lazy(() => import("./pages/public/Gallery"));
const Wishes = lazy(() => import("./pages/public/Wishes"));
const GuestResponse = lazy(() => import("./pages/public/GuestResponse"));
const CircleOfLove = lazy(() => import("./pages/public/CircleOfLove"));
const CouplePolls = lazy(() => import("./pages/public/CouplePolls"));
const ProjectOverview = lazy(() => import("./pages/public/ProjectOverview"));
const ComingSoon = lazy(() => import("./pages/public/ComingSoon"));
const NotFound = lazy(() => import("./pages/public/NotFound"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));
const AdminWishes = lazy(() => import("./pages/admin/AdminWishes"));
const AdminGuestResponses = lazy(() => import("./pages/admin/AdminGuestResponses"));
const AdminChatbotMessages = lazy(() => import("./pages/admin/AdminChatbotMessages"));
const AdminCircleOfLove = lazy(() => import("./pages/admin/AdminCircleOfLove"));
const AdminPolls = lazy(() => import("./pages/admin/AdminPolls"));

const PageLoader = () => (
  <div className="grid min-h-[55vh] place-items-center bg-white px-4 text-center">
    <div className="rounded-[1.75rem] border border-rose-100 bg-white px-6 py-5 shadow-[0_18px_45px_rgba(244,63,94,0.08)]">
      <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-rose-100 border-t-rose-700" />
      <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-rose-700">
        Loading
      </p>
    </div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/wishes" element={<Wishes />} />
            <Route path="/guest-response" element={<GuestResponse />} />
            <Route path="/circle-of-love" element={<CircleOfLove />} />
            <Route path="/couple-polls" element={<CouplePolls />} />
            <Route path="/project-overview" element={<ProjectOverview />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/gallery" element={<AdminGallery />} />
              <Route path="/admin/wishes" element={<AdminWishes />} />
              <Route path="/admin/guest-responses" element={<AdminGuestResponses />} />
              <Route path="/admin/chatbot-messages" element={<AdminChatbotMessages />} />
              <Route path="/admin/circle-of-love" element={<AdminCircleOfLove />} />
              <Route path="/admin/polls" element={<AdminPolls />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
