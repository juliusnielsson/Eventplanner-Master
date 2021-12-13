import {
    SafeAreaView,
    FlatList,
    Button,
    StyleSheet,
    Text,
    View,
    StatusBar,
    Image,
    TouchableOpacity
  } from "react-native";
  import * as React from "react";
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
  import { useEffect, useState } from "react";
  
  function invitationsScreen({ navigation }) {
  
    const auth = getAuth();
    const user = auth.currentUser;
    const [events, setEvents] = useState([]);
    const db = getDatabase();
    const dbRef = ref(getDatabase());
  
    useEffect(() => {
        get(child(dbRef, `users/${user.uid}/Invited`))
        .then((snapshot) => {
            console.log(snapshot.val());
            snapshot.val().forEach(eventID => {
                get(child(dbRef, `events/${eventID}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                      console.log(snapshot.val());
                      setEvents(events => [...events, snapshot.val()]);
                    } else {
                      console.log("No data available");
                    }
                  }).catch((error) => {
                    console.error(error);
                  });
            });
        })
    }, []);
  
    
    // Vi viser ingenting hvis der ikke er data
    if (!events) {
      return <Text>Loading...</Text>;
    }
  
    const handleSelectEvent = (id) => {
      /*Her søger vi direkte i vores array af events og finder event objektet som matcher idet vi har tilsendt*/
      const event = Object.entries(events).find(
        (event) => event[0] === id /*id*/
      );
      console.log(id);
      navigation.navigate("Single Event Page Invite (Events)", { event , id });
    };
  
    // Flatlist forventer et array. Derfor tager vi alle values fra vores events objekt, og bruger som array til listen
    const eventArray = Object.values(events);
    const eventKeys = Object.keys(events);
  
    //console.log(eventArray);
    //console.log(eventKeys);
  
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
  
  export default invitationsScreen;
  