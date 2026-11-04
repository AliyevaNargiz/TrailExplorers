import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  where,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { type ThemeColors, useAppTheme } from "../theme/themeContext";

type AppNotification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  status?: "approved" | "rejected";
  guideName?: string;
  guidePhone?: string;
  guideEmail?: string;
  date?: string;
  timeSlot?: string;
  createdAt?: any;
};

export default function NotificationsScreen({ navigation }: any) {
  const { colors: COLORS } = useAppTheme();
  const styles = createStyles(COLORS);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      setLoading(true);

      const q = query(
  collection(db, "notifications"),
  where("userId", "==", user.uid)
);

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as AppNotification[];

      setNotifications(data);
    } catch (error) {
      console.log("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (id: string) => {
  try {
    await updateDoc(doc(db, "notifications", id), {
      read: true,
    });

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  } catch (error) {
    console.log("Failed to mark notification as read:", error);
  }
};

  const renderItem = ({ item }: { item: AppNotification }) => (
  <Pressable
    style={[styles.card, !item.read && styles.unreadCard]}
    onPress={() => markAsRead(item.id)}
  >
    <View style={styles.cardHeader}>
      <Text style={styles.title}>{item.title}</Text>

      {!item.read ? (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>
      ) : null}
    </View>

    <Text style={styles.message}>{item.message}</Text>

     <View style={styles.detailBox}>
      <Text style={styles.detailText}>Guide: {item.guideName ?? "Unknown"}</Text>
      <Text style={styles.detailText}>Date: {item.date ?? "No date"}</Text>
      <Text style={styles.detailText}>Time: {item.timeSlot ?? "No time"}</Text>
      <Text style={styles.detailText}>Status: {item.status ?? "pending"}</Text>

      {item.guidePhone ? (
        <Text style={styles.detailText}>Phone: {item.guidePhone}</Text>
      ) : null}

      {item.guideEmail ? (
        <Text style={styles.detailText}>Email: {item.guideEmail}</Text>
      ) : null}
    </View>

    <Text style={styles.status}>{item.read ? "Read" : "Tap to mark as read"}</Text>
  </Pressable>
);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </Pressable>

          <Text style={styles.headerTitle}>Notifications</Text>

          <View style={{ width: 24 }} />
        </View>

        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 30 }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No notifications yet.</Text>
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
    headerTitle: {
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
    unreadCard: {
      borderWidth: 2,
      borderColor: COLORS.darkGreen,
    },
    title: {
      fontSize: 15,
      fontWeight: "800",
      color: COLORS.black,
      marginBottom: 6,
    },
    message: {
      fontSize: 13,
      color: COLORS.grayText,
      lineHeight: 19,
    },
    status: {
      marginTop: 8,
      fontSize: 11,
      fontWeight: "800",
      color: COLORS.darkGreen,
    },
    emptyText: {
      textAlign: "center",
      marginTop: 30,
      color: COLORS.grayText,
    },
    cardHeader: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
},

newBadge: {
  backgroundColor: COLORS.darkGreen,
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 999,
},

newBadgeText: {
  color: COLORS.white,
  fontSize: 10,
  fontWeight: "800",
},
detailBox: {
  marginTop: 12,
  backgroundColor: COLORS.white,
  borderRadius: 14,
  padding: 12,
  gap: 4,
},

detailText: {
  fontSize: 12,
  color: COLORS.black,
  fontWeight: "600",
},
  });