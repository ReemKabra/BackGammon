import React,{useState,useEffect} from 'react'
import { View, FlatList, TextInput, Button, Text,TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import styles from './Chat.style';
import { Ionicons } from '@expo/vector-icons'; 
import {initiateSocket,getSocket,disconnectSocket} from "../utils/socket";
import AsyncStorage from "@react-native-async-storage/async-storage";
 const ChatScreen = () => {
    const[FriendName,setFriendName] =useState("") 
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState(false);
    const [user, setUser] = useState("");
    const sendMessage = () => {
        if (message.trim() !== '') {
            setMessages([...messages, { text: message, sender: user }]);
            setMessage('');
        }
    };
    const GetNames= async ()=>{
        const name=await AsyncStorage.getItem('FriendName');
        setFriendName(name);
        const username=await AsyncStorage.getItem('username');
        setUser(username);
    }
    // const handleTyping = () => {
    //     socket.emit('typing', { sender: 'me' });
    // };
    useEffect(()=>{
        GetNames();
        // socket.on('receiveMessage', (data) => {
        //     setMessages(prevMessages => [...prevMessages, data]);
        // });
        // socket.on('typing', (data) => {
        //     if (data.sender !== 'me') {
        //         setTyping(true);
        //         setTimeout(() => {
        //             setTyping(false);
        //         }, 2000);  // Reset typing status after 2 seconds
        //     }
        // });
        // return () => {
        //     socket.disconnect();
        // }
    },[]);
  return (
    <View style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("components/UserList2")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
         {typing && <Text>{FriendName} is typing...</Text>}
          <Stack.Screen
          options={
          {
            headerShadowVisible: true,
            headerTitle:"Chat"
          }
          }/>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View style={[styles.messageBox, item.sender === 'me' ? styles.sentMessage : styles.receivedMessage]}>
                        <Text>{item.text}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={text => {
                        setMessage(text);
                        // handleTyping();
                    }}
                    placeholder="Type a message"
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
        </View>
  )
}
export default ChatScreen
