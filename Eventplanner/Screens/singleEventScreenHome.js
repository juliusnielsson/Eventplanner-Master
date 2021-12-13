import * as React from "react";
import {
  View,
  Text,
  Platform,
  FlatList,
  StyleSheet,
  Button,
  Alert,
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
  remove,
  push,
  set,
  update,
} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const singleEventScreenHome = ({ route, navigation }) => {
  const [event, setEvent] = useState({});
  const [going, setGoing] = useState();
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getDatabase();
  const dbRef = ref(getDatabase());
  const [id, setID] = useState();

  useEffect(() => {
    setEvent(route.params.event[1]);
    setID(route.params.id);
    const eventGoing = route.params.event[1];
    console.log(eventGoing);
    if (eventGoing.UserID.includes(user.uid)) {
      setGoing(1);
    } else if (eventGoing.Going.includes(user.uid)) {
      setGoing(2);
      console.log("true");
    } else {
      setGoing(3);
      console.log("false");
    }
    /*Når vi forlader screen, tøm object*/
    return () => {
      setEvent({});
    };
  }, [going]);


  //check this i have doubts!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const setGoingFunc = () => {
    const preArray = [];
    const userArray = [];
    get(child(dbRef, `events/${route.params.id}/Going`))
      .then((snapshot) => {
        console.log(snapshot.val());
        preArray.push.apply(preArray, snapshot.val());
        console.log(preArray);
        console.log(user.uid);
      })
      .then(() => {
        preArray.push(user.uid);
        update(ref(db, `events/${route.params.id}`), {
          Going: preArray,
        });
        navigation.goBack();
      })
      .then(() => {
        get(child(dbRef, `users/${user.uid}/Going`))
        .then((snapshot) => {
          console.log(snapshot.val());
          userArray.push.apply(userArray, snapshot.val());
          console.log(userArray);
          console.log(user.uid);
        })
        .then(() => {
          userArray.push(route.params.id);
          update(ref(db, `users/${user.uid}`), {
            Going: userArray,
          });     
        });
      })
  };

  const setNotGoingFunc = () => {
    const preArray = [];
    const userArray = [];
    get(child(dbRef, `events/${route.params.id}/Going`))
      .then((snapshot) => {
        console.log(snapshot.val());
        preArray.push.apply(preArray, snapshot.val());
      })
      .then(() => {
        const index = preArray.indexOf(user.uid);
        preArray.splice(index, 1);
        update(ref(db, `events/${route.params.id}`), {
          Going: preArray,
        });
        navigation.goBack();
      })
      .then(() => {
        get(child(dbRef, `users/${user.uid}/Going`))
        .then((snapshot) => {
          console.log(snapshot.val());
          userArray.push.apply(userArray, snapshot.val());
        })
        .then(() => {
          const index = userArray.indexOf(route.params.id);
          userArray.splice(index, 1);
          update(ref(db, `users/${user.uid}`), {
            Going: userArray,
          });
        })
      })
  };

  const renderButton = () => {
    if (going == 1) {
      return <View></View>;
    } else if (going == 3) {
      return (
        <View>
          <Button title="Going" onPress={() => setGoingFunc()} />
        </View>
      );
    } else {
      return (
        <View>
          <Button title="Not Going" onPress={() => setNotGoingFunc()} />
        </View>
      );
    }
  };

  if (!event) {
    return <Text>No data</Text>;
  }

  //all content
  return (
    <View style={styles.container}>
      {Object.entries(event).map((item, index) => {
        return (
          <View style={styles.row} key={index}>
            {/*Vores event keys navn*/}
            <Text style={styles.label}>{item[0]} </Text>
            {/*Vores event values navne */}
            <Text style={styles.value}>{item[1]}</Text>
          </View>
        );
      })}
      {renderButton()}
    </View>
  );
};

export default singleEventScreenHome;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-start" },
  row: {
    margin: 5,
    padding: 5,
    flexDirection: "row",
  },
  label: { width: 100, fontWeight: "bold" },
  value: { flex: 1 },
});
