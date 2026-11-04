import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  addDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { type ThemeColors, useAppTheme } from "../theme/themeContext";


type Booking = {
   id: string;
  guideId: string;
  guideName: string;
  userId: string;
  userEmail: string;
  date?: string;
  timeSlot?: string;
  guidePhone?: string;
  guideEmail?: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: any;
};

export default function AdminBookingsScreen({ navigation }: any) {
  const { colors: COLORS } = useAppTheme();
  const styles = createStyles(COLORS);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  

  const loadBookings = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "guideBookings"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Booking[];

      setBookings(data);
    } catch (error) {
      console.log("Failed to load bookings:", error);
      Alert.alert("Error", "Could not load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

 const updateBookingStatus = async (
  bookingId: string,
  status: "approved" | "rejected"
) => {
  try {
    await updateDoc(doc(db, "guideBookings", bookingId), {
      status,
    });

    const booking = bookings.find((b) => b.id === bookingId);

    if (!booking) {
        Alert.alert("Error", "Booking not found.");
      return;
    }

    const guideSnap = await getDoc(doc(db, "guides", booking.guideId));
    const guideData = guideSnap.exists() ? guideSnap.data() : null;

    await addDoc(collection(db, "notifications"), {
      userId: booking.userId,
      bookingId: booking.id,

      title:
        status === "approved"
          ? "Booking Approved ✅"
          : "Booking Rejected ❌",

      message:
        status === "approved"
          ? `Your booking with ${booking.guideName} was approved.`
          : `Your booking with ${booking.guideName} was rejected.`,

      status,
      guideId: booking.guideId,
      guideName: booking.guideName,
      userEmail: booking.userEmail,
      date: booking.date ?? "",
      timeSlot: booking.timeSlot ?? "",

      guidePhone: booking.guidePhone || guideData?.phone || "",
      guideEmail: booking.guideEmail || guideData?.email || "",

      read: false,
      createdAt: serverTimestamp(),
    });

const userSnap = await getDoc(doc(db, "users", booking.userId));
    const userData = userSnap.data();
    const token = userData?.expoPushToken;


    console.log("Booking userId:", booking.userId);
console.log("Push token:", token);
   if (token) {
  const pushResponse = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: token,
      sound: "default",
      title:
        status === "approved"
          ? "Booking Approved ✅"
          : "Booking Rejected ❌",
      body:
        status === "approved"
          ? `Your booking with ${booking.guideName} is confirmed.`
          : `Your booking with ${booking.guideName} was rejected.`,
    }),
  });

  const pushResult = await pushResponse.json();
  console.log("Expo push result:", pushResult);
} else {
  console.log("No push token found for user:", booking.userId);
}

    Alert.alert("Success", `Booking ${status}.`);
    loadBookings();
  } catch (error) {
    console.log("Failed to update booking:", error);
    Alert.alert("Error", "Could not update booking.");
  }
};

  const renderBooking = ({ item }: { item: Booking }) => (
    <View style={styles.card}>
      <Text style={styles.guideName}>{item.guideName}</Text>
      <Text style={styles.text}>User: {item.userEmail}</Text>
      <Text style={styles.text}>Date: {item.date}</Text>
      <Text style={styles.text}>Time Slot: {item.timeSlot}</Text>
      <Text style={styles.text}>Status: {item.status}</Text>

      {item.status === "pending" ? (
        <View style={styles.actions}>
          <Pressable
            style={styles.approveBtn}
            onPress={() => updateBookingStatus(item.id, "approved")}
          >
            <Text style={styles.btnText}>Approve</Text>
          </Pressable>

          <Pressable
            style={styles.rejectBtn}
            onPress={() => updateBookingStatus(item.id, "rejected")}
          >
            <Text style={styles.btnText}>Reject</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </Pressable>

          <Text style={styles.title}>Guide Bookings</Text>

          <View style={{ width: 24 }} />
        </View>

        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.id}
            renderItem={renderBooking}
            contentContainerStyle={{ paddingBottom: 30 }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No bookings found.</Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (COLORS: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: COLORS.white,
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    backText: {
      fontSize: 24,
      fontWeight: "800",
      color: COLORS.black,
    },
    title: {
      fontSize: 18,
      fontWeight: "800",
      color: COLORS.black,
    },
    card: {
      backgroundColor: COLORS.lightGray,
      borderRadius: 18,
      padding: 16,
      marginBottom: 12,
    },
    guideName: {
      fontSize: 16,
      fontWeight: "800",
      color: COLORS.black,
      marginBottom: 6,
    },
    text: {
      fontSize: 13,
      color: COLORS.grayText,
      marginBottom: 4,
    },
    actions: {
      flexDirection: "row",
      gap: 10,
      marginTop: 12,
    },
    approveBtn: {
      flex: 1,
      backgroundColor: COLORS.darkGreen,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: "center",
    },
    rejectBtn: {
      flex: 1,
      backgroundColor: "#9b1c1c",
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: "center",
    },
    btnText: {
      color: COLORS.white,
      fontSize: 13,
      fontWeight: "800",
    },
    emptyText: {
      textAlign: "center",
      color: COLORS.grayText,
      marginTop: 30,
    },
  });