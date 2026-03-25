import React, { useEffect } from "react";
import Navigation from "./src/app/Navigation";
import { configureGoogleSignIn } from "./src/services/google";

export default function App() {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  return <Navigation />;
}