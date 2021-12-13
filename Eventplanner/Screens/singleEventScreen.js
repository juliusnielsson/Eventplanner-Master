import * as React from "react";
import {
  Pressable,
  View,
  Text,
  Platform,
  FlatList,
  StyleSheet,
  Button,
  Alert,
  Modal,
  TextInput,
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
  update,
} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const singleEventScreen = ({ route, navigation }) => {
  const [event, setEvent] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [searchUser, setSearchUser] = useState({});
  const db = getDatabase();
  const dbRef = ref(getDatabase());

  useEffect(() => {
    /*Henter event values og sætter dem*/
    setEvent(route.params.event[1]);
    /*Når vi forlader screen, tøm object*/
    return () => {
      setEvent({});
    };
  });

  const handleEdit = () => {
    // Vi navigerer videre til EditEvent skærmen og sender eventet videre med
    const event = route.params.event;
    navigation.navigate("Edit Event", { event });
  };

  // Vi spørger brugeren om han er sikker
  const confirmDelete = () => {
    /*Er det mobile?*/
    console.log("penis");
    Alert.alert("Are you sure?", "Do you want to delete the event?", [
      { text: "Cancel", style: "cancel" },
      // Vi bruger this.handleDelete som eventHandler til onPress
      { text: "Delete", style: "destructive", onPress: () => handleDelete() },
    ]);
  };

  // Vi sletter det aktuelle event
  const handleDelete = () => {
    const id = route.params.event[0];
    try {
      const db = getDatabase();
      remove(ref(db, `events/${id}`))
        .then(function () {
          console.log("Remove succeeded.");
        })
        .catch(function (error) {
          console.log("Remove failed: " + error.message);
        });
      navigation.goBack();
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const getInvitedUser = async () => {
    const userQuery = query(
      ref(db, "users"),
      orderByChild("Email"),
      equalTo(email)
    ); 
    const usersSnapshot = await get(userQuery);
    
    if (usersSnapshot.val() !== null){
      const key = Object.keys(usersSnapshot.val());
      const test = Object.values(usersSnapshot.val());
      handleInvite(key,test,usersSnapshot.val());
    } else {
      console.log("No user with that email found"); // put Alert here
    }
  }

  const handleInvite = (key, test, user) => {
    const eventArray = [];
    const userArray = [];
    userArray.push.apply(userArray, test[0].Invited);
    userArray.push(route.params.id);
    //console.log(key);
    //console.log(userArray);
    update(ref(db, `users/${key}`), {
      Invited: userArray,
    }).then(() => {
      get(child(dbRef, `events/${route.params.id}/Invited`))
        .then((snapshot) => {
          //console.log(snapshot.val());
          eventArray.push.apply(eventArray, snapshot.val());
          //console.log(eventArray);
        })
        .then(() => {
          // If statement needed here to prevent multiple invitions being sent about the same event
          eventArray.push(key[0]);
          update(ref(db, `events/${route.params.id}`), {
            Invited: eventArray,
          });
        });
    });
  };

  if (!event) {
    return <Text>No data</Text>;
  }

  //all content
  return (
    <View style={styles.container}>
      <Button title="Edit" onPress={() => handleEdit()} />
      <Button title="Delete" onPress={() => handleDelete()} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="email"
              value={email}
              onChangeText={(email) => setEmail(email)}
              style={styles.inputField}
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => getInvitedUser()}
            >
              <Text style={styles.textStyle}>Submit</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Invite</Text>
      </Pressable>

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
    </View>
  );
};

export default singleEventScreen;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#2196F3",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  container: { flex: 1, justifyContent: "flex-start" },
  row: {
    margin: 5,
    padding: 5,
    flexDirection: "row",
  },
  inputField: {
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  label: { width: 100, fontWeight: "bold" },
  value: { flex: 1 },
});
