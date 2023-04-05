import * as React from 'react';
import { View, Text, Button, StyleSheet, Animated, Easing } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Svg, Circle } from 'react-native-svg';


const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds



export default function SettingsScreen({navigation}) {
  const [timeRemaining, setTimeRemaining] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkPeriod, setIsWorkPeriod] = useState(true); // added state variable

  const maxDuration = isWorkPeriod ? POMODORO_DURATION : 5 * 60;
  const progress = 1 - (timeRemaining / maxDuration);
  const circumference = 2 * Math.PI * 180;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * progress;

  useEffect(() => {
    let timer = null;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeRemaining(prevTimeRemaining => {
          if (prevTimeRemaining <= 0) {
            clearInterval(timer);
            setIsRunning(false);
            const nextIsWorkPeriod = !isWorkPeriod; // toggle between work and break periods
            setIsWorkPeriod(nextIsWorkPeriod);
            return nextIsWorkPeriod ? POMODORO_DURATION : 5 * 60; // switch between work and break durations
          }
          return prevTimeRemaining - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, isWorkPeriod]);

  const startTimer = () => setIsRunning(true);
  const stopTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setTimeRemaining(POMODORO_DURATION);
    setIsRunning(false);
    setIsWorkPeriod(true);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getDurationLabel = () => {
    const workLabel = "Work";
    const breakLabel = "Break";
    return (
      <View style={styles.panel}>
        <Text style={[styles.label, isWorkPeriod && styles.active]}>{workLabel}</Text>
        <Text style={[styles.label, !isWorkPeriod && styles.active]}>{breakLabel}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Svg height="400" width="400">
          <Circle cx="200" cy="200" r="180" stroke="white" strokeWidth="5" fill="transparent" />
          <Circle cx="200" cy="200" r="180" stroke="#39ff14" strokeWidth="5" fill="transparent" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset}/>
          <Text x="200" y="200" textAnchor="middle" dominantBaseline="central" style={styles.timerText}>
            {formatTime(timeRemaining)}
          </Text>
        </Svg>
        <View style={styles.iconContainer}>
          <Ionicons name="play-outline" size={40} color="white" onPress={startTimer} />
          <Ionicons name="stop-circle-outline" size={40} color="white" onPress={stopTimer} />
          <Ionicons name="reload-circle-outline" size={40} color="white" onPress={resetTimer} />
        </View>
        <View style={styles.panel}>
        <Text style={[styles.label, isWorkPeriod && styles.active]}>{getDurationLabel()}</Text>
        </View>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2c2c2c',
  },
  timerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginLeft: 28,
    width: '40%',
  },
  timerText: {
    fontSize: 40,
    color: 'white',
    textAlign: 'center',
    marginTop: 180,
  },
  panel: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 200,
    marginVertical: 40,
    padding: 5,
    borderRadius: 100,
    backgroundColor: '#141414', // add background color to panel
  },
  label: {
    flex:1,
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
  active: {
    opacity: 1,
    color: '#89c7ff',
  },
});
