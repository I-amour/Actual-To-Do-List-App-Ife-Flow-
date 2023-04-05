import React, { useState, useEffect } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Animated } from "react-native";
import {Picker} from '@react-native-picker/picker';
import { FontAwesome, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SwipeListView } from "react-native-swipe-list-view";
import { useIsFocused } from "@react-navigation/native";

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("@task_items", jsonValue);
  } catch (e) {
    console.error("Error storing data", e);
  }
};

const loadData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@task_items");
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error loading data", e);
    return [];
  }
};

export default function HomeScreen({ navigation, route }) {

    const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      (async () => {
        const loadedData = await loadData();
        setTaskItems(loadedData);
      })();
    }
  }, [isFocused]);

    useEffect(() => {
        (async () => {
            const loadedData = await loadData();
            setTaskItems(loadedData);
        })();
    }, []);

    useEffect(() => {
      if (route.params?.newTask) {
          handleAddTask(route.params.newTask.text, route.params.newTask.priority, route.params.newTask.timeSpent);
      }
    }, [route.params?.newTask]);

        const [filteredTasks, setFilteredTasks] = useState([]);
    const [sortedTasks, setSortedTasks] = useState([]);

    const [filterType, setFilterType] = useState('all');
    const [sortPriority, setSortPriority] = useState(false);


    useEffect(() => {
      if (taskItems) {
        // Apply the filtering according to filterType
        const filtered = taskItems?.filter((task) => {
          if (filterType === "highPriority") return task.priority === "High";
          if (filterType === "lowPriority") return task.priority === "low";
          if (filterType === "shortTasks") return task.timeSpent < 60;
          if (filterType === "longTasks") return task.timeSpent >= 60;
          return true;
        });
        
        setFilteredTasks(filtered);
      }
    }, [taskItems, filterType]);
    
    
    useEffect(() => {
      // Apply the sorting according to sortPriority
      const sort = (a, b) => (a.priority === b.priority ? 0 : a.priority === "High" ? -1 : 1);
    
      if (sortPriority) {
        setSortedTasks(filteredTasks.sort(sort));
      } else {
        setSortedTasks(filteredTasks);
      }
    }, [filteredTasks, sortPriority]);

    const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  

  const Task = ({ text, completed, onPress, priority, timeSpent }) => (
    <TouchableOpacity style={[styles.item, completed && styles.completedItem]} onPress={onPress} activeOpacity={0.99}>
      <Text style={[styles.square, completed && styles.completedSquare]}>{completed && <FontAwesome name="check" size={18} color="#FFF" />}</Text>
      <View style={styles.itemDetails}>
        <Text style={[styles.itemText, completed && styles.completedText]}>{text}</Text>
        {timeSpent !== null && <Text style={[styles.itemSubText, completed && styles.completedText]}>Time Spent: {timeSpent} mins</Text>}
        {priority !== null && <Text style={[styles.itemSubText, completed && styles.completedText]}>Priority: {priority}</Text>}
      </View>
    </TouchableOpacity>
  );

    const [taskItems, setTaskItems] = useState([]);
    

    const handleAddTask = async (task, priority, timeSpent) => {
      // Set timeSpent to null if it is not provided
      if (!timeSpent) {
        timeSpent = null;
      }
      
      const newTaskItems = [
        ...taskItems,
        { text: task, completed: false, priority: priority, timeSpent: timeSpent },
      ];
      
      try {
        // Store the updated task items in AsyncStorage
        await AsyncStorage.setItem("@task_items", JSON.stringify(newTaskItems));
        
        // Update the state with the new task items
        setTaskItems(newTaskItems);
        
        // Apply the filtering and sorting logic immediately
        const filtered = newTaskItems.filter((task) => {
          if (filterType === "highPriority") return task.priority === "High";
          if (filterType === "lowPriority") return task.priority === "low";
          if (filterType === "shortTasks") return task.timeSpent < 60;
          if (filterType === "longTasks") return task.timeSpent >= 60;
          return true;
        });
    
        const sort = (a, b) => (a.priority === b.priority ? 0 : a.priority === "High" ? -1 : 1);
        const sorted = sortPriority ? filtered?.sort(sort) : filtered;
    
        setFilteredTasks(filtered);
        setSortedTasks(sorted);
      } catch (e) {
        console.error("Error storing data", e);
      }
    };

    
    const completeTask = (index) => {
      setTaskItems((prevItems) => {
        const itemsCopy = [...prevItems];
        itemsCopy[index].completed = !itemsCopy[index].completed;
        storeData(itemsCopy);
        return itemsCopy;
      });
    };
    const deleteTask = (index) => {
      const itemsCopy = [...taskItems];
      itemsCopy.splice(index, 1);
      setTaskItems(itemsCopy);
      storeData(itemsCopy);
    };

    // Update filteredTasks and sortedTasks whenever taskItems changes
useEffect(() => {
  const filtered = taskItems?.filter((task) => {
    if (filterType === "highPriority") return task.priority === "High";
    if (filterType === "lowPriority") return task.priority === "low";
    if (filterType === "shortTasks") return task.timeSpent < 60;
    if (filterType === "longTasks") return task.timeSpent >= 60;
    return true;
  });

  const sort = (a, b) => (a.priority === b.priority ? 0 : a.priority === "High" ? -1 : 1);
  const sorted = sortPriority ? filtered?.sort(sort) : filtered;

  setFilteredTasks(filtered);
  setSortedTasks(sorted);
}, [taskItems, filterType, sortPriority]);

    

    return (
        <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.tasksWrapper}>
          <Animated.Text style={[styles.titleText, { opacity: fadeAnim }]}>Today's tasks</Animated.Text>
          <View
  style={{flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 10,
  marginLeft: 5,
  alignSelf: 'stretch',
  borderWidth: 2,
  borderColor:'#89c7ff',
  borderRadius: 10
}}>
          <Picker
        selectedValue={filterType}
        style={[styles.picker, styles.pickerBorder]}
        itemStyle={styles.pickerItem}
        onValueChange={(itemValue, itemIndex) => setFilterType(itemValue)}
      >
                        <Picker.Item label="All Tasks" value="all" />
                        <Picker.Item label="High Priority" value="highPriority" />
                        <Picker.Item label="Low Priority" value="lowPriority" />
                        <Picker.Item label="Shorter than 1 hour" value="shortTasks" />
                        <Picker.Item label="1 hour or longer" value="longTasks" />
                    </Picker>
                    </View>
                    <TouchableOpacity onPress={() => setSortPriority(!sortPriority)}>
                    <Animated.Text style={[styles.sortText, { opacity: fadeAnim }]}>
  <View style={styles.sortTextView}>
    <Text style={styles.sortLabel}>Sort by Priority:</Text>
    <Text style={styles.sortValue}>{sortPriority ? 'Enabled' : 'Disabled'}</Text>
  </View>
</Animated.Text>
          </TouchableOpacity>

          <SwipeListView
                        // Change data={taskItems} to data={sortedTasks}
                        data={sortedTasks}
                        
                        renderItem={({ item, index }) => <Task text={item.text} completed={item.completed} onPress={() => completeTask(index)} priority={item.priority} timeSpent={item.timeSpent} />}
                        renderHiddenItem={({ item, index }) => (
                            <View style={styles.hiddenItem}>
                                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(index)}>
                                    <Text style={styles.deleteText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()} // Add this line
                        useNativeDriver={false} // Add this line
                        rightOpenValue={-80}
                        disableRightSwipe
                        previewRowKey={"0"}
                        previewOpenValue={-40}
                        previewOpenDelay={3000}
                    />
                </View>
                </ScrollView>
                <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'padding' : 'height'} style={styles.writeTaskWrapper}>
        <View style={styles.overlayStyle} onStartShouldSetResponder={() => true}>
          <TouchableOpacity onPress={() => navigation.navigate('AddTask')}>
            {/* Replace FontAwesome icon with Entypo icon */}
            <View style={styles.addButton}>
              <Entypo name="plus" size={24} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2c2c2c',
      },
      tasksWrapper: {
        paddingTop: 80,
        paddingHorizontal: 20,
      },
      titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#89c7ff',
        marginBottom: 10,
        fontFamily: "Orbitron",
      },
    item: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#141414",
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    completedItem: {
        backgroundColor: "#5c5c5c",
    },
    square: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: "#39ff14",
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
    },
    completedSquare: {
        borderColor: "#25a8ff",
    },
    itemDetails: {
        flex: 1,
    },
    itemText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#d6ffae",
    },
    completedText: {
        textDecorationLine: "line-through",
        color: "#e6e6e6",
    },
    itemSubText: {
        fontSize: 12,
        color: "#89c7ff",
    },
    writeTaskWrapper: {
      position: 'absolute',
      bottom: Platform.OS === 'android' ? 120 : 80,
      alignItems: 'center',
      justifyContent: "center",
      width: "100%",
  },
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 60,
        backgroundColor: "#89c7ff",
        justifyContent: "center",
        alignItems: "center",
        elevation: 7,
    },
    hiddenItem: {
      backgroundColor: "#ff1e56",
      borderRadius: 10,
      justifyContent: "flex-end",
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 15,
      paddingRight: 10,
      marginBottom: 10,
      height:'85%',
  },
  deleteButton: {
      paddingHorizontal: 20,
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ff1e56",
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
  },

    deleteText: {
        color: "#FFF",
        fontSize: 16,
    },
    overlayStyle: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
      },
      picker: {
        width: 150,
        height: 50,
        color: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 20,
        borderColor: '#89c7ff',
        marginBottom: 10,
        marginLeft: 5,
      },

      pickerItem: {
        color: "#2c2c2c",
        backgroundColor:'#2c2c2c',
      },
      sortText: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
        borderWidth: 2, // add a border
        borderColor: '#89c7ff', // set the border color
        borderRadius: 10, // add rounded corners
        marginBottom: 10 // add spacing
      },
      sortTextView: {
        flexDirection: 'row'
      },
      sortLabel: {
        color: "#FFFFFF",
        flex: 1,
        marginRight: 2,
      },
      sortValue: {
        flex: 1,
        marginLeft: 2,
        textAlign: 'left'
      },
});