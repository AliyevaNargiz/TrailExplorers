// import React, { useEffect } from "react";
// import Navigation from "./src/app/Navigation";
// // import { configureGoogleSignIn } from "./src/services/google";

// export default function App() {

// // useEffect(() => {
// //   configureGoogleSignIn({
// //     iosClientId: "286057375578-76liluki67a516ic4up3ftmov10f4087.apps.googleusercontent.com"
// //   });
// // }, []);

//   return <Navigation />;
// }

// import React from "react";
import React, { useEffect } from "react";
import "./src/services/backgroundLocationTask";
import Navigation from "./src/app/Navigation";
import { syncPendingRecordedTrails } from "./src/services/pendingTrailSyncService";

export default function App() {
  useEffect(() => {
    syncPendingRecordedTrails().catch(console.log);
  }, []);
  return <Navigation />;
}