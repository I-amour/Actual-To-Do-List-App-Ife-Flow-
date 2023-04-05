import React, {useState} from 'react';
import MainContainer from './NAVIGATION/MainContainer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './NAVIGATION/screens/HomeScreen';
import AddTaskScreen from './NAVIGATION/screens/AddTaskScreen';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {

  return(
    <MainContainer/>
    );
}

