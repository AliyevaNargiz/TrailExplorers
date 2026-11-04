// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import { auth, db } from "./firebase";

// export async function registerForPushNotifications() {
//   if (!Device.isDevice) return;

//   const { status: existingStatus } =
//     await Notifications.getPermissionsAsync();

//   let finalStatus = existingStatus;

//   if (existingStatus !== "granted") {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }

//   if (finalStatus !== "granted") return;

//   const tokenData = await Notifications.getExpoPushTokenAsync();
//   const token = tokenData.data;

//   const user = auth.currentUser;
//   if (!user) return;

//   await setDoc(
//     doc(db, "users", user.uid),
//     {
//       expoPushToken: token,
//       updatedAt: serverTimestamp(),
//     },
//     { merge: true }
//   );
// }

// export const scheduleEcoChallengeReminder = async () => {
//   try {
//     const { status } = await Notifications.requestPermissionsAsync();

//     if (status !== "granted") return;

//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "Eco Challenge Reminder 🌿",
//         body: "Don’t forget to complete an eco challenge during your hike!",
//         sound: true,
//       },
//       trigger: {
//         type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
//         seconds: 5,
//         repeats: false,
//       },
//     });
//   } catch (error) {
//     console.log("Failed to schedule eco reminder:", error);
//   }
// };

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) return;

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return;

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const token = tokenData.data;

  const user = auth.currentUser;
  if (!user) return;

  await setDoc(
    doc(db, "users", user.uid),
    {
      expoPushToken: token,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export const scheduleEcoChallengeReminder = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      console.log("Notification permission not granted");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Eco Challenge Reminder 🌿",
        body: "Don’t forget to complete an eco challenge during your hike!",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds:20,
        repeats: false,
      },
    });

    console.log("Eco challenge reminder scheduled");
  } catch (error) {
    console.log("Failed to schedule eco reminder:", error);
  }
};


export const sendLocalNotification = async (
  title: string,
  body: string
) => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      console.log("Notification permission not granted");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null,
    });
  } catch (error) {
    console.log("Failed to send local notification:", error);
  }
};