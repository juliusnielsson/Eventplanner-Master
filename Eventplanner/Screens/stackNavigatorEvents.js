import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import upcomingEvents from "./upcomingEventsScreen";
import Invitations from "./invitationsScreen";
import singleEventScreenUpcoming from "./singleEventScreenUpcoming";
import singleEventScreenInvites from "./singleEventScreenInvites";

const Stack = createNativeStackNavigator();

function StackNavigatorEvents() {
  return (
    <Stack.Navigator initialRouteName="Upcoming Events">
      <Stack.Screen
        name="Upcoming Events"
        component={upcomingEvents}
        options={({ navigation, route }) => ({
          headerTitleStyle: { textAlign: "right", color: "white" },
          headerStyle: { backgroundColor: "#62bab5" },
        })}
      />
      <Stack.Screen
        name="Invitations"
        component={Invitations}
        options={({ navigation, route }) => ({
          headerTitleStyle: { textAlign: "right", color: "white" },
          headerStyle: { backgroundColor: "#62bab5" },
        })}
      />
      <Stack.Screen
        name="Single Event Page Invite (Events)"
        component={singleEventScreenInvites}
        options={({ navigation, route }) => ({
          headerTitleStyle: { textAlign: "right", color: "white" },
          headerStyle: { backgroundColor: "#62bab5" },
        })}
      />
      <Stack.Screen
        name="Single Event Page Upcoming (Events)"
        component={singleEventScreenUpcoming}
        options={({ navigation, route }) => ({
          headerTitleStyle: { textAlign: "right", color: "white" },
          headerStyle: { backgroundColor: "#62bab5" },
        })}
      />
    </Stack.Navigator>
  );
}

export default StackNavigatorEvents;
