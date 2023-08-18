import React,{useState,useEffect} from 'react'
import { View, FlatList, TextInput, Button, Text,TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import styles from './Chat.style';
import { Ionicons } from '@expo/vector-icons'; 
import {initiateSocket,getSocket,disconnectSocket} from "../utils/socket";
import AsyncStorage from "@react-native-async-storage/async-storage";
 const ChatScreen = () => {
    const socket = getSocket();
    const[FriendName,setFriendName] =useState("") 
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState(false);
    const [user, setUser] = useState("");
    const sendMessage = () => {
        if (message.trim() !== '' && socket) {  // check if socket is defined
            setMessages([...messages, { text: message, sender: user }]);
            socket.emit('message', { text: message, sender: user }); // emit your message
            setMessage('');
            setTyping(false);
        }
    };
    const handleTyping = (text) => {
        setMessage(text);
        if (text) {
            socket.emit('typing', { user });
        } else {
            socket.emit('stopTyping');
        }
    }
    const GetNames= async ()=>{
        const name=await AsyncStorage.getItem('FriendName');
        setFriendName(name);
        const username=await AsyncStorage.getItem('username');
        setUser(username);
    }
    useEffect(() => {
        GetNames();
        if (socket) {
            socket.on('typing', (data) => {
                if (data.user !== user) {
                    setTyping(true);
                }
            });

            socket.on('message', (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            socket.on('stopTyping', () => {
                setTyping(false);
            });
        }

        return () => {
            // Clean up event listeners when the component is unmounted.
            if (socket) {
                socket.off('typing');
                socket.off('message');
                socket.off('stopTyping');
            }
        };
    }, [socket]);
  return (
    <View style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("components/UserList2")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text>Chat with {FriendName}</Text>
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
                    onChangeText={handleTyping}
                    placeholder="Type a message"
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
        </View>
  )
}
export default ChatScreen
