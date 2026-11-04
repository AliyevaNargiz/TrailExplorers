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
// import React, { useEffect } from "react";
// import "./src/services/backgroundLocationTask";
// import Navigation from "./src/app/Navigation";
// import { syncPendingRecordedTrails } from "./src/services/pendingTrailSyncService";

// export default function App() {
//   useEffect(() => {
//     syncPendingRecordedTrails().catch(console.log);
//   }, []);
//   return <Navigation />;
// }

import React, { useEffect } from "react";
import "./src/services/backgroundLocationTask";
import Navigation from "./src/app/Navigation";
import { syncPendingRecordedTrails } from "./src/services/pendingTrailSyncService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/services/firebase";
import { seedGuides } from "./src/services/seedGuides";
import { registerForPushNotifications } from "./src/services/notificationService";


export default function App() {
  useEffect(() => {
    seedGuides();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User ready, syncing pending trails...");
          registerForPushNotifications().catch(console.log);

        syncPendingRecordedTrails().catch(console.log);
      } else {
        console.log("No user yet, waiting...");
      }
    });
    

    return unsubscribe;
  }, []);

  return <Navigation />;
}