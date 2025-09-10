import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./Components/Navbar";
import ErrorMessage from "./Components/ErrorMessage";
import { UserProvider } from "./context/UserContext";

const HomeList = lazy(() => import("./pages/HomeList"));
const Booking = lazy(() => import("./pages/Booking"));
const Favourite = lazy(() => import("./pages/Favourite"));
const HostHomes = lazy(() => import("./pages/HostHomes"));
const AddHome = lazy(() => import("./pages/AddHome"));
const Contact = lazy(() => import("./pages/Contact"));
const SignupPage = lazy(() => import("./auth/SignupPage"));
const LoginPage = lazy(() => import("./auth/LoginPage"));
const Profile = lazy(() => import("./pages/profile"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const EditHome = lazy(() => import("./pages/EditHome"));

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomeList />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/favourite" element={<Favourite />} />
            <Route path="/host-homes" element={<HostHomes />} />
            <Route path="/add-home" element={<AddHome />} />
            <Route path="/host/edit-home/:homeId" element={<EditHome />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="*" element={<ErrorMessage />} />
          </Routes>
        </Suspense>
      </Router>
    </UserProvider>
  );
}

export default App;
