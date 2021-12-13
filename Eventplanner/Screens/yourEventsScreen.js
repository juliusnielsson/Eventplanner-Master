import * as React from "react";
import {
  View,
  Button,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  query,
  child,
  get,
  orderByChild,
  equalTo,
  onValue,
} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const yourEventsScreen = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => navigation.navigate("Create Event")}
          title="Create Event"
        />
      ),
    });
  }, [navigation]);

  const auth = getAuth();
  const user = auth.currentUser;
  const [eventsHome, setEventsHome] = useState({});
  const db = getDatabase();

  React.useEffect(
    () => navigation.addListener("focus", () => refreshUpcoming()),
    []
  );

  const refreshUpcoming = async () => {
    const yourEventQuery = query(
      ref(db, "events"),
      orderByChild("UserID"),
      equalTo(user.uid)
    );
    const usersSnapshotHome = await get(yourEventQuery);

    if (usersSnapshotHome.val() !== null) {
      console.log(usersSnapshotHome.val());
      setEventsHome(usersSnapshotHome.val());
    } else {
      console.log("No data"); // put Alert here
    }
  };
/*
  useEffect(() => {
    const yourEventQueryScreen = query(
      ref(db, "events"),
      orderByChild("UserID"),
      equalTo(user.uid)
    );
    onValue(yourEventQueryScreen, (snapshot) => {
      if (snapshot.exists) {
        console.log(snapshot.val());
        setEventsHome(snapshot.val());
      } else {
        console.log("No data Available");
      }
    });
  }, []); */

  // Vi viser ingenting hvis der ikke er data
  if (!eventsHome) {
    return <Text>No Events Found</Text>;
  }

  const handleSelectEvent = (id) => {
    /*Her søger vi direkte i vores array af events og finder event objektet som matcher idet vi har tilsendt*/
    const event = Object.entries(eventsHome).find(
      (event) => event[0] === id /*id*/
    );
    navigation.navigate("Single Event Page", { event , id });
  };

  // Flatlist forventer et array. Derfor tager vi alle values fra vores events objekt, og bruger som array til listen
  const eventArray = Object.values(eventsHome);
  const eventKeys = Object.keys(eventsHome);

  const Item = ({ title, picture, date, time, index }) => (
    <View style={styles.item}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => handleSelectEvent(eventKeys[index])}
      >
        <Image
          style={{ width: 320, height: 120, alignSelf: "center" }}
          source={{ uri: picture }}
        />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.dateTime}>
          Date: {date} Time: {time}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <Item
      title={item.Name}
      picture={item.ImageURL}
      date={item.Date}
      time={item.Time}
      index={index}
    />
  );

  return (
    <FlatList
      data={eventArray}
      // Vi bruger eventKeys til at finde ID på den aktuelle bil og returnerer dette som key, og giver det med som ID til CarListItem
      keyExtractor={(item, index) => eventKeys[index]}
      renderItem={renderItem}
    />
  );
};

export default yourEventsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    alignSelf: "center",
  },
  dateTime: {
    fontSize: 15,
    alignSelf: "center",
  },
});
