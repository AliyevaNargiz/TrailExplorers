// import React from "react";
// import {
//   Alert,
//   Pressable,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../app/navigationTypes";
// // import { getGuideById } from "../data/guides";
// import { getGuideById, Guide } from "../services/guideService";
// import { type ThemeColors, useAppTheme } from "../theme/themeContext";
// import { auth } from "../services/firebase";
// import { bookGuide } from "../services/guideBooking";


// type Props = NativeStackScreenProps<RootStackParamList, "GuideProfile">;

// function getInitials(name: string) {
//   return name
//     .split(" ")
//     .map((part) => part[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();
// }

// export default function GuideProfileScreen({ navigation, route }: Props) {
//   const { colors: COLORS } = useAppTheme();
//   const styles = createStyles(COLORS);
//   // const guide = getGuideById(route.params.guideId);
//   const [guide, setGuide] = React.useState<Guide | null>(null);

// React.useEffect(() => {
//   const load = async () => {
//     const data = await getGuideById(route.params.guideId);
//     setGuide(data);
//   };

//   load();
// }, [route.params.guideId]);

//   if (!guide) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.missingWrap}>
//           <Text style={styles.missingTitle}>Guide not found</Text>
//           <Pressable onPress={() => navigation.goBack()} style={styles.primaryButton}>
//             <Text style={styles.primaryButtonText}>Go back</Text>
//           </Pressable>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView
//         style={styles.container}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.content}
//       >
//         <View style={styles.topBar}>
//           <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
//             <Text style={styles.backText}>←</Text>
//           </Pressable>
//           <Text style={styles.headerTitle}>Guide Profile</Text>
//           <View style={styles.topBarSpacer} />
//         </View>

//         <View style={styles.heroCard}>
//           <View style={styles.avatar}>
//             <Text style={styles.avatarText}>{getInitials(guide.fullName)}</Text>
//           </View>
//           <Text style={styles.name}>{guide.fullName}</Text>
//           <Text style={styles.role}>{guide.agency}</Text>
//           <Text style={styles.meta}>
//             {guide.agency} • {guide.region}
//           </Text>
//         </View>

//         <Pressable
//   style={styles.primaryButton}
//   onPress={async () => {
//     await bookGuide({
//       guideId: guide.id,
//       // userId: auth.currentUser?.uid,
//       userId: auth.currentUser?.uid ?? "",
//       date: new Date().toISOString(),
//     });

//     Alert.alert("Booked!", "Guide request sent.");
//   }}
// >
//   <Text style={styles.primaryButtonText}>Book Guide</Text>
// </Pressable>

//         <View style={styles.statsRow}>
//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryValue}>{guide.rating.toFixed(1)}</Text>
//             <Text style={styles.summaryLabel}>Rating</Text>
//           </View>
//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryValue}>{guide.experienceYears}</Text>
//             <Text style={styles.summaryLabel}>Years experience</Text>
//           </View>
//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryValue}>{guide.region}</Text>
//             <Text style={styles.summaryLabel}>Region</Text>
//           </View>
//         </View>

//         <View style={styles.sectionCard}>
//           <Text style={styles.sectionTitle}>About</Text>
//           <Text style={styles.sectionText}>{guide.bio}</Text>
//         </View>

//         <View style={styles.sectionCard}>
//           <Text style={styles.sectionTitle}>Languages</Text>
//           <View style={styles.tagRow}>
//             {guide.languages.map((language) => (
//               <View key={language} style={styles.tag}>
//                 <Text style={styles.tagText}>{language}</Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         <View style={styles.sectionCard}>
//           <Text style={styles.sectionTitle}>Specialties</Text>
//           <View style={styles.tagRow}>
//             {guide.specialties.map((specialty) => (
//               <View key={specialty} style={styles.tag}>
//                 <Text style={styles.tagText}>{specialty}</Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         <View style={styles.noteCard}>
//           <Text style={styles.noteTitle}>Ready for real guide data</Text>
//           <Text style={styles.noteText}>
//             This profile is scaffolded with local placeholder content for now.
//             Later we can connect it to Firestore and add booking, contact, and
//             reviews.
//           </Text>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const createStyles = (COLORS: ThemeColors) =>
//   StyleSheet.create({
//     safeArea: {
//       flex: 1,
//       backgroundColor: COLORS.white,
//     },
//     container: {
//       flex: 1,
//       backgroundColor: COLORS.white,
//     },
//     content: {
//       paddingHorizontal: 20,
//       paddingTop: 10,
//       paddingBottom: 32,
//     },
//     topBar: {
//       flexDirection: "row",
//       alignItems: "center",
//       justifyContent: "space-between",
//       marginBottom: 20,
//     },
//     backBtn: {
//       width: 36,
//       height: 36,
//       borderRadius: 18,
//       borderWidth: 1,
//       borderColor: COLORS.border,
//       alignItems: "center",
//       justifyContent: "center",
//       backgroundColor: COLORS.white,
//     },
//     backText: {
//       fontSize: 18,
//       fontWeight: "700",
//       color: COLORS.black,
//     },
//     headerTitle: {
//       fontSize: 18,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     topBarSpacer: {
//       width: 36,
//     },
//     heroCard: {
//       backgroundColor: COLORS.lightGray,
//       borderRadius: 26,
//       padding: 22,
//       alignItems: "center",
//       gap: 6,
//     },
//     avatar: {
//       width: 96,
//       height: 96,
//       borderRadius: 48,
//       backgroundColor: COLORS.darkGreen,
//       alignItems: "center",
//       justifyContent: "center",
//       marginBottom: 8,
//     },
//     avatarText: {
//       color: COLORS.white,
//       fontSize: 32,
//       fontWeight: "800",
//     },
//     name: {
//       fontSize: 24,
//       fontWeight: "800",
//       color: COLORS.black,
//       textAlign: "center",
//     },
//     role: {
//       fontSize: 14,
//       fontWeight: "700",
//       color: COLORS.darkGreen,
//       textAlign: "center",
//     },
//     meta: {
//       fontSize: 13,
//       color: COLORS.grayText,
//       textAlign: "center",
//     },
//     statsRow: {
//       flexDirection: "row",
//       gap: 10,
//       marginTop: 18,
//     },
//     summaryCard: {
//       flex: 1,
//       backgroundColor: COLORS.lightGray,
//       borderRadius: 18,
//       paddingHorizontal: 12,
//       paddingVertical: 14,
//       alignItems: "center",
//       gap: 4,
//     },
//     summaryValue: {
//       fontSize: 15,
//       fontWeight: "800",
//       color: COLORS.black,
//       textAlign: "center",
//     },
//     summaryLabel: {
//       fontSize: 11,
//       color: COLORS.grayText,
//       textAlign: "center",
//     },
//     sectionCard: {
//       marginTop: 18,
//       backgroundColor: COLORS.lightGray,
//       borderRadius: 22,
//       padding: 18,
//       gap: 10,
//     },
//     sectionTitle: {
//       fontSize: 15,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     sectionText: {
//       fontSize: 14,
//       lineHeight: 21,
//       color: COLORS.black,
//     },
//     tagRow: {
//       flexDirection: "row",
//       flexWrap: "wrap",
//       gap: 8,
//     },
//     tag: {
//       backgroundColor: COLORS.white,
//       borderRadius: 999,
//       paddingHorizontal: 12,
//       paddingVertical: 8,
//     },
//     tagText: {
//       fontSize: 12,
//       fontWeight: "700",
//       color: COLORS.black,
//     },
//     noteCard: {
//       marginTop: 18,
//       backgroundColor: "#eef4ef",
//       borderRadius: 22,
//       padding: 18,
//       gap: 8,
//     },
//     noteTitle: {
//       fontSize: 15,
//       fontWeight: "800",
//       color: COLORS.black,
//     },
//     noteText: {
//       fontSize: 13,
//       lineHeight: 20,
//       color: COLORS.grayText,
//     },
//     missingWrap: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       paddingHorizontal: 24,
//       gap: 12,
//       backgroundColor: COLORS.white,
//     },
//     missingTitle: {
//       fontSize: 20,
//       fontWeight: "800",
//       color: COLORS.black,
//       textAlign: "center",
//     },
//     primaryButton: {
//       borderRadius: 18,
//       backgroundColor: COLORS.darkGreen,
//       paddingHorizontal: 18,
//       paddingVertical: 12,
//     },
//     primaryButtonText: {
//       color: COLORS.white,
//       fontSize: 13,
//       fontWeight: "800",
//     },
//   });
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigationTypes";
import { getGuideById, type Guide } from "../services/guideService";
import { bookGuide } from "../services/guideBooking";
import { auth } from "../services/firebase";
import { type ThemeColors, useAppTheme } from "../theme/themeContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getBookedTimeSlots } from "../services/guideBooking";

type Props = NativeStackScreenProps<RootStackParamList, "GuideProfile">;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function GuideProfileScreen({ navigation, route }: Props) {
  const { colors: COLORS } = useAppTheme();
  const styles = createStyles(COLORS);

  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);

  const [booking, setBooking] = useState(false);
  const timeSlots = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "12:00 - 14:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
];
const [selectedDate, setSelectedDate] = useState(new Date());
const [showDatePicker, setShowDatePicker] = useState(false);
const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
const [bookedSlots, setBookedSlots] = useState<string[]>([]);
const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

  useEffect(() => {
    const loadGuide = async () => {
      try {
        setLoading(true);
        const data = await getGuideById(route.params.guideId);
        setGuide(data);
      } catch (error) {
        console.log("Failed to load guide:", error);
        setGuide(null);
      } finally {
        setLoading(false);
      }
    };

    loadGuide();
  }, [route.params.guideId]);

  useEffect(() => {
  const loadBookedSlots = async () => {
    if (!guide) return;

    const slots = await getBookedTimeSlots(
      guide.id,
      formatDate(selectedDate)
    );

    setBookedSlots(slots);
    setSelectedTimeSlot("");
  };

  loadBookedSlots();
}, [guide, selectedDate]);

 const handleBookGuide = async () => {
  if (!guide) return;

  const user = auth.currentUser;

  if (!user) {
    Alert.alert("Login required", "Please log in before booking a guide.");
    return;
  }

  if (!selectedTimeSlot) {
    Alert.alert("Select time", "Please choose a time slot.");
    return;
  }

  try {
    await bookGuide({
      guideId: guide.id,
      guideName: guide.fullName,
      userId: user.uid,
      userEmail: user.email,
      date: formatDate(selectedDate),
      timeSlot: selectedTimeSlot,
      guidePhone: guide.phone ?? "",
      guideEmail: guide.email ?? "",
    });

    Alert.alert("Booking pending",
  "Your booking request was sent. Please wait for admin approval.");
  } catch (error) {
    console.log(error);
  }
};

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  if (!guide) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.missingWrap}>
          <Text style={styles.missingTitle}>Guide not found</Text>

          <Pressable onPress={() => navigation.goBack()} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </Pressable>

          <Text style={styles.headerTitle}>Guide Profile</Text>

          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.heroCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(guide.fullName)}</Text>
          </View>

          <Text style={styles.name}>{guide.fullName}</Text>
          <Text style={styles.role}>{guide.agency}</Text>

          <Text style={styles.meta}>
            {guide.agency} • {guide.region}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{guide.rating.toFixed(1)}</Text>
            <Text style={styles.summaryLabel}>Rating</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{guide.experienceYears}</Text>
            <Text style={styles.summaryLabel}>Years experience</Text>
          </View>
        </View>
        
        <View style={styles.sectionCard}>
  <Text style={styles.sectionTitle}>Pick Date</Text>

  <Pressable
    style={styles.dateButton}
    onPress={() => setShowDatePicker(true)}
  >
    <Text style={styles.dateButtonText}>
      {formatDate(selectedDate)}
    </Text>
  </Pressable>

  {showDatePicker ? (
    <DateTimePicker
      value={selectedDate}
      mode="date"
      minimumDate={new Date()}
      onChange={(event, date) => {
        setShowDatePicker(false);

        if (date) {
          setSelectedDate(date);
          setSelectedTimeSlot("");
        }
      }}
    />
  ) : null}
</View>

        <View style={styles.sectionCard}>
  <Text style={styles.sectionTitle}>Choose Time</Text>

  <View style={styles.timeSlotWrap}>
    {timeSlots.map((slot) => {
      const isBooked = bookedSlots.includes(slot);
      const isSelected = selectedTimeSlot === slot;

      return (
        <Pressable
          key={slot}
          disabled={isBooked}
          style={[
            styles.timeSlot,
            isSelected && styles.timeSlotSelected,
            isBooked && styles.timeSlotBooked,
          ]}
          onPress={() => setSelectedTimeSlot(slot)}
        >
          <Text
            style={[
              styles.timeSlotText,
              isSelected && styles.timeSlotTextSelected,
              isBooked && styles.timeSlotTextBooked,
            ]}
          >
            {slot}
          </Text>

          <Text style={styles.timeSlotStatus}>
            {isBooked ? "Booked" : isSelected ? "Selected" : "Available"}
          </Text>
        </Pressable>
      );
    })}
  </View>
  <Pressable
  style={styles.primaryButton}
  onPress={handleBookGuide}
  disabled={booking}
>
  <Text style={styles.primaryButtonText}>
    {booking ? "Booking..." : "Book Guide"}
  </Text>
</Pressable>
</View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionText}>{guide.bio}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Languages</Text>

          <View style={styles.tagRow}>
            {guide.languages.map((language) => (
              <View key={language} style={styles.tag}>
                <Text style={styles.tagText}>{language}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Specialties</Text>

          <View style={styles.tagRow}>
            {guide.specialties.map((specialty) => (
              <View key={specialty} style={styles.tag}>
                <Text style={styles.tagText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
      backgroundColor: COLORS.white,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 32,
    },
    loadingWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.white,
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.white,
    },
    backText: {
      fontSize: 18,
      fontWeight: "700",
      color: COLORS.black,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: COLORS.black,
    },
    topBarSpacer: {
      width: 36,
    },
    heroCard: {
      backgroundColor: COLORS.lightGray,
      borderRadius: 26,
      padding: 22,
      alignItems: "center",
      gap: 6,
    },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: COLORS.darkGreen,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    avatarText: {
      color: COLORS.white,
      fontSize: 32,
      fontWeight: "800",
    },
    name: {
      fontSize: 24,
      fontWeight: "800",
      color: COLORS.black,
      textAlign: "center",
    },
    role: {
      fontSize: 14,
      fontWeight: "700",
      color: COLORS.darkGreen,
      textAlign: "center",
    },
    meta: {
      fontSize: 13,
      color: COLORS.grayText,
      textAlign: "center",
    },
    primaryButton: {
      marginTop: 18,
      borderRadius: 18,
      backgroundColor: COLORS.darkGreen,
      paddingHorizontal: 18,
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    primaryButtonText: {
      color: COLORS.white,
      fontSize: 14,
      fontWeight: "800",
    },
    statsRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 18,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: COLORS.lightGray,
      borderRadius: 18,
      paddingHorizontal: 12,
      paddingVertical: 14,
      alignItems: "center",
      gap: 4,
    },
    summaryValue: {
      fontSize: 15,
      fontWeight: "800",
      color: COLORS.black,
      textAlign: "center",
    },
    summaryLabel: {
      fontSize: 11,
      color: COLORS.grayText,
      textAlign: "center",
    },
    sectionCard: {
      marginTop: 18,
      backgroundColor: COLORS.lightGray,
      borderRadius: 22,
      padding: 18,
      gap: 10,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "800",
      color: COLORS.black,
    },
    sectionText: {
      fontSize: 14,
      lineHeight: 21,
      color: COLORS.black,
    },
    tagRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    tag: {
      backgroundColor: COLORS.white,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    tagText: {
      fontSize: 12,
      fontWeight: "700",
      color: COLORS.black,
    },
    missingWrap: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
      gap: 12,
      backgroundColor: COLORS.white,
    },
    missingTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: COLORS.black,
      textAlign: "center",
    },

timeSlotWrap: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 10,
},

timeSlot: {
  width: "47%",
  backgroundColor: COLORS.white,
  borderRadius: 16,
  padding: 12,
  borderWidth: 1,
  borderColor: COLORS.border,
},

timeSlotSelected: {
  backgroundColor: COLORS.darkGreen,
  borderColor: COLORS.darkGreen,
},

timeSlotBooked: {
  backgroundColor: "#e5e5e5",
  borderColor: "#d0d0d0",
},

timeSlotText: {
  fontSize: 13,
  fontWeight: "800",
  color: COLORS.black,
},

timeSlotTextSelected: {
  color: COLORS.white,
},

timeSlotTextBooked: {
  color: COLORS.grayText,
},

timeSlotStatus: {
  marginTop: 4,
  fontSize: 10,
  color: COLORS.grayText,
},
dateButton: {
  backgroundColor: COLORS.white,
  borderRadius: 14,
  padding: 14,
  borderWidth: 1,
  borderColor: COLORS.border,
},

dateButtonText: {
  fontSize: 14,
  fontWeight: "800",
  color: COLORS.black,
},
  });