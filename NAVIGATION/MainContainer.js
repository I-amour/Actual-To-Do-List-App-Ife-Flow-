import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import SettingsScreen from './screens/SettingsScreen';
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
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='AddTask' component={AddTaskScreen} />
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
                        iconName = focused ? 'home' : 'home-outline'
                    } else if(rn=== detailsName){
                        iconName = focused ? 'list' : 'list-outline'
                    } else if (rn===settingsName){
                        iconName = focused ? 'settings' : 'settings-outline'
                    }

                    return <Ionicons name={iconName} size={size} color={color}/>
                },
                    activeTintColor: 'black',
                    inactiveTintColor:'white',
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: '#586AE2',
                        borderRadius: 15,
                        position: 'absolute',
                        bottom:25,
                        left: 20,
                        right:20,
                        elevation:0,
                        height: 90,
                    },
            })}
            tabBarOptions={{
                activeTintColor: '#2A2356',
                inactiveTintColor: 'white',
              }} 
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
