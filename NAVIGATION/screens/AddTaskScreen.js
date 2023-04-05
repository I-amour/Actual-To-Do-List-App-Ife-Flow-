import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function AddTaskScreen({ navigation }) {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [isTimeTrackingEnabled, setIsTimeTrackingEnabled] = useState(false);

  const handleAddTask = () => {
    navigation.navigate('Home', {
      newTask: {
        text: task,
        priority: priority,
        timeSpent: isTimeTrackingEnabled ? parseInt(timeSpent) || 0 : null,
      },
    });
    setTask('');
    setPriority('');
    setTimeSpent('');
    setIsTimeTrackingEnabled(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        <MaterialIcons name="assignment" size={24} color="#89c7ff" />
        <TextInput
          style={styles.input}
          placeholder="Write a Task"
          placeholderTextColor="#FFFFFF80"
          value={task}
          onChangeText={(text) => setTask(text)}
        />
      </View>
      
      <View style={[styles.inputContainer, { alignItems: 'flex-start', paddingTop: 10 }]}>
        <MaterialIcons name="priority-high" size={24} color="#89c7ff" />
        <Picker
          style={styles.picker}
          selectedValue={priority}
          onValueChange={(itemValue) => setPriority(itemValue)}
        >
          <Picker.Item label="Set Priority" value="" color="#FFFFFF80" />
          <Picker.Item label="High" value="High" color="#0AE2FF" />
          <Picker.Item label="Low" value="Low" color="#2EFF2A" />
        </Picker>
      </View>

      <View style={[styles.inputContainer, { alignItems: 'center' }]}>
        <Text style={styles.formLabel}>Time tracking:</Text>
        <Switch
          value={isTimeTrackingEnabled}
          onValueChange={(value) => setIsTimeTrackingEnabled(value)}
        />
      </View>

      {isTimeTrackingEnabled && (
        <View style={styles.inputContainer}>
          <MaterialIcons name="timer" size={24} color="#89c7ff" />
          <TextInput
            style={styles.input}
            placeholder="Time Spent (mins)"
            placeholderTextColor="#FFFFFF80"
            value={timeSpent}
            onChangeText={(text) => setTimeSpent(text)}
            keyboardType="numeric"
          />
        </View>
      )}

      <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c2c2c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    width: '80%',
    padding: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    borderColor: '#89c7ff',
    borderWidth: 1,
    marginLeft: 10,
    color: '#FFFFFF',
  },
  picker: {
    flex: 1,
    marginLeft: 10,
    height: 40,
    justifyContent: 'center',
    color: '#FFFFFF',
  },
  formLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#89c7ff',
    borderRadius: 10,
    padding: 15,
    alignSelf: 'stretch',
    marginHorizontal: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
});