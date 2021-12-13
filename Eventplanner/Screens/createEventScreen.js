import React, {useEffect, useState } from "react";
import {
  Button,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { getDatabase, ref, push, set } from "firebase/database";

function createEvent({ navigation }) {
  const [name, setName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCompleted, setCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const toggleSwitch = () => setIsPrivate(previousState => !previousState);

  const renderButton = () => {
    return <Button onPress={() => handleSubmit()} title="Create event" />;
  };

  const handleSubmit = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const db = getDatabase();
      const postListRef = ref(db, "events/");
      const newPostRef = push(postListRef);
      set(newPostRef, {
        Name: name,
        ImageURL: imageURL,
        Description: description,
        Time: time,
        Date: date,
        Location: location,
        UserID: user.uid,
        Private: isPrivate,
        Invited: [1],
        Going: [user.uid]
      });
      navigation.navigate("Your Events")
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  return (
    <View>
      <Text style={styles.header}>New Event</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={(name) => setName(name)}
        style={styles.inputField}
      />
      <TextInput
        placeholder="ImageURL"
        value={imageURL}
        onChangeText={(imageURL) => setImageURL(imageURL)}
        style={styles.inputField}
      />
      <TextInput
        placeholder="description"
        value={description}
        onChangeText={(description) => setDescription(description)}
        style={styles.inputField}
      />
      <TextInput
        placeholder="time"
        value={time}
        onChangeText={(time) => setTime(time)}
        style={styles.inputField}
      />
      <TextInput
        placeholder="date"
        value={date}
        onChangeText={(date) => setDate(date)}
        style={styles.inputField}
      />
      <TextInput
        placeholder="location"
        value={location}
        onChangeText={(location) => setLocation(location)}
        style={styles.inputField}
      />
      <Text>Private: </Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        onValueChange={toggleSwitch}
        value={isPrivate}
      />
      {errorMessage && <Text style={styles.error}>Error: {errorMessage}</Text>}
      {renderButton()}
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    color: "red",
  },
  inputField: {
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  header: {
    fontSize: 40,
  },
});

export default createEvent;