
import * as React from 'react';
import {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity,TouchableWithoutFeedback, Modal} from 'react-native';
import {Calendar} from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import moment from 'moment-timezone';
import { PermissionsAndroid, Platform } from 'react-native';

if (Platform.OS === 'android') {
  PermissionsAndroid.request('android.permission.ACCESS_FINE_LOCATION').then(() => {
    console.log('Permission granted');
  });
}


    

export default function DetailsScreen({navigation}) {
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [reminders, setReminders] = React.useState({});
    const [showReminderForm, setShowReminderForm] = React.useState(false);
    const [reminderTime, setReminderTime] = React.useState('');
    const [reminderDescription, setReminderDescription] = React.useState('');

    const onDayPress = (day) => {
      setSelectedDate(day.dateString);
      setReminders((prevReminders) => {
        const updatedReminders = {...prevReminders};
        Object.keys(updatedReminders).forEach((date) => {
          updatedReminders[date] = {
            ...updatedReminders[date],
            selected: false,
            selectedColor: undefined,
          };
        });
        updatedReminders[day.dateString] = {
          ...updatedReminders[day.dateString],
          selected: true,
          selectedColor: '#39ff14',
        };
        return updatedReminders;
      });
    };


    const onReminderSet = () => {
      if (selectedDate) {
        const reminderDateTime = moment.tz(selectedDate + 'T' + reminderTime, 'YYYY-MM-DDTHH:mm', 'Europe/London').toDate();
        
        setReminders((prevReminders) => {
          const updatedReminders = {
            ...prevReminders,
            [selectedDate]: {
              selected: true,
              selectedColor: '#dcd6f7',
              reminders: [
                ...(prevReminders[selectedDate]?.reminders || []),
                {time: reminderTime, description: reminderDescription},
              ],
            },
          };
          AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
        
          return updatedReminders;
        });
        
        setShowReminderForm(false);
        setReminderTime('');
        setReminderDescription('');
        
        console.log('Scheduling notification...');
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'Reminder',
            body: reminderDescription,
          },
          trigger: {
            date: reminderDateTime,
            repeats: false,
          },
        })
          .then((notificationId) =>
            console.log(`Scheduled notification with ID: ${notificationId}`),
            console.log(reminderDateTime)
          )
          .catch((error) => console.error('Error scheduling notification:', error));
      }
    };
    

    const onReminderDelete = (reminderIndex) => {
        if (selectedDate) {
            setReminders((prevReminders) => ({
                ...prevReminders,
                [selectedDate]: {
                    ...prevReminders[selectedDate],
                    reminders: prevReminders[selectedDate].reminders.filter(
                        (_, index) => index !== reminderIndex
                    ),
                },
            }));
        }
    };

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    
    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === 'ios');
      setDate(currentDate);
      setReminderTime(moment(currentDate).format('HH:mm'));
    };
    
    const showMode = currentMode => {
      setShow(true);
      setMode(currentMode);
    };
    
    const showTimepicker = () => {
      showMode('time');
    };

      const [pressedIndex, setPressedIndex] = useState(null);

    return (
<View style={{flex: 1, backgroundColor: '#2c2c2c'}}>
  <View style={{ backgroundColor: '#2c2c2c', padding: 20}}>
    <Calendar
      onDayPress={onDayPress}
      markedDates={reminders}
      theme={{
        backgroundColor: '#2c2c2c',
        calendarBackground: '#2c2c2c',
        textSectionTitleColor: '#fff',
        selectedDayBackgroundColor: '#dcd6f7',
        selectedDayTextColor: '#333',
        todayTextColor: '#00adf5',
        dayTextColor: '#fff',
        textDisabledColor: '#666',
        dotColor: '#dcd6f7',
        selectedDotColor: '#333',
        arrowColor: '#fff',
        monthTextColor: '#fff',
        indicatorColor: '#fff',
        textDayFontSize: 16,
        textMonthFontSize: 20,
        textDayHeaderFontSize: 16
      }}
    />
  </View>

            <View style={{ alignItems: 'center', justifyContent: 'center'}}>
  <Modal animationType="slide" transparent={true} visible={showReminderForm}>
    <View style={{ flex: 1 }}>
    <TouchableWithoutFeedback onPress={() => setShowReminderForm(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,.4)',
          }}
        />
      </TouchableWithoutFeedback>
<View
  style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -120 }, { translateY: -120 }],
    backgroundColor: '#141414',
    paddingVertical: 40,
    paddingHorizontal: 60,
    borderRadius: 20,
  }}
>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom :10, color: '#89c7ff' }}>Add Reminder</Text>
        <TouchableOpacity onPress={showTimepicker}>
    <Text style={{ color:'#39ff14' }}>
      {reminderTime || 'Select Time'}
    </Text>
  </TouchableOpacity>
  {show && (
    <DateTimePicker
      testID="dateTimePicker"
      value={date}
      mode={mode}
      is24Hour={true}
      display="default"
      onChange={onChange}
    />
  )}
        <TextInput
            placeholder="Description"
            value={reminderDescription}
            onChangeText={setReminderDescription}
            style={{
              borderWidth :1,
              borderColor :'#dcd6f7',
              borderRadius :4,
              paddingVertical :8,
              paddingHorizontal :12,
              marginBottom :8,
              backgroundColor :'white'}}
         />
         <TouchableOpacity 
             onPress={onReminderSet} 
             style={{
                 backgroundColor:'#89c7ff',
                 paddingVertical :10,
                 paddingHorizontal :20,
                 borderRadius :4}}>
             <Text style={{color:'white'}}>Save Reminder</Text>
         </TouchableOpacity>
      </View>
                    </View>
                </Modal>
                <>
                   <TouchableOpacity
  style={{
    marginTop: 20,
    backgroundColor: '#89c7ff',
    padding: 10,
    borderRadius: 5,
  }}
  onPress={() => setShowReminderForm(true)}
>
  <Text>Set Reminder</Text>
</TouchableOpacity>




{reminders[selectedDate]?.reminders?.length > 0 ? (
  reminders[selectedDate].reminders.map((reminder, index) => (
    <View
      key={index}
      style={{
        marginTop:20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#141414',
        paddingVertical :10,
        paddingHorizontal :20,
        borderRadius :4,
        marginBottom :8
      }}
    >
      <View style={{marginTop: 10, marginBottom:10}}>
          <Text style={{ fontWeight:'bold', color: '#89c7ff' }}>{reminder.time}</Text>
          <Text style={{color:'#89c7ff'}}>{reminder.description}</Text>
      </View>
      <TouchableOpacity 
         onPressIn={() => setPressedIndex(index)}
         onPressOut={() => setPressedIndex(null)}
         onPress={() => onReminderDelete(index)}
         style={{paddingHorizontal:5}}
       >
          <Icon name="trash-o" size={24} color={pressedIndex === index ? "red" : "#4a47a3"} />
       </TouchableOpacity> 
    </View> 
  ))
) : (
  <Text>No reminders for today</Text>
)}
</>
            </View>
        </View>
    );
}