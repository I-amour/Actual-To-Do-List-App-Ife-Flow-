import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import SettingsScreen from './screens/SettingsScreen.js';
import AddTaskScreen from './screens/AddTaskScreen';

// Screen Names
const homeName = 'Home';
const detailsName = 'Details';
const settingsName = 'Settings';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TaskStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name='AddTask' component={AddTaskScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}


export default function MainContainer(){
    return(
        <NavigationContainer>
            
            <Tab.Navigator
            initialRouteName={homeName}
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;

                    if (rn=== homeName){
                        iconName = focused ? 'add-circle-outline' : 'checkbox-outline'
                    } else if(rn=== detailsName){
                        iconName = focused ? 'calendar' : 'calendar-outline'
                    } else if (rn===settingsName){
                        iconName = focused ? 'time' : 'hourglass-outline'
                    }

                    return <Ionicons name={iconName} size={size} color={color}/>
                },
                    activeTintColor: 'black',
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: '#141414',
                        borderRadius: 25,
                        position: 'absolute',
                        bottom:25,
                        left: 20,
                        right:20,
                        elevation:0,
                        height: 70,
                        borderTopWidth: 0,
                    },
                      tabBarActiveTintColor: "#39ff14",
                      tabBarInactiveTintColor: "white",
                    
            })}
                ><Tab.Screen
                name={homeName}
                component={TaskStackNavigator}
                options={{ headerShown: false }}
              />
              <Tab.Screen
                name={detailsName}
                component={DetailsScreen}
                options={{ headerShown: false }}
              />
              <Tab.Screen
                name={settingsName}
                component={SettingsScreen}
                options={{ headerShown: false }}
              />

            </Tab.Navigator>
        </NavigationContainer>
    );
}
