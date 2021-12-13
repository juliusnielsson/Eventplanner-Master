import * as React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import profileScreen from "./profileScreen";
import editProfileScreen from "./editProfileScreen";

const Stack = createNativeStackNavigator();

function StackNavigatorProfile() {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        component={profileScreen}
        options={({ navigation, route }) => ({
          headerTitleStyle: { textAlign: "right", color: "white" },
          headerStyle: { backgroundColor: "#62bab5" }

        })}
      />

      <Stack.Screen
        name="Edit Profile"
        component={editProfileScreen}
        options={({ navigation, route }) => ({
          headerTitleStyle: { textAlign: "right", color: "white" },
          headerStyle: { backgroundColor: "#62bab5" }

        })}
      />
    </Stack.Navigator>
  );
}

export default StackNavigatorProfile;