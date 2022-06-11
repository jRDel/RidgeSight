import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import NewSighting from "./pages/NewSighting";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";


export default function Links() {
  return (
    <Routes>
      <Route
        path="/"
        element={
            <AuthenticatedRoute>
            <Home />
            </AuthenticatedRoute>
        }
      />
      <Route
        path="/login"
        element={
            <UnauthenticatedRoute>
            <Login />
            </UnauthenticatedRoute>
        }
      />
      <Route
        path="/signup"
        element={
            <UnauthenticatedRoute>
            <Signup />
            </UnauthenticatedRoute>
        }
      />
      <Route
        path="/"
        element={
            <AuthenticatedRoute>
            <Home />
            </AuthenticatedRoute>
        }
      />
      <Route
        path="/sighting/new"
        element={
            <AuthenticatedRoute>
            <NewSighting />
            </AuthenticatedRoute>
        }
      />
      <Route
        path="/profile"
        element={
            <AuthenticatedRoute>
            <Profile />
            </AuthenticatedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />;
    </Routes>
  );
}