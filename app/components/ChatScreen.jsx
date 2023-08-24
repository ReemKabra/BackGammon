import React,{useState,useEffect} from 'react'
import { View, FlatList, TextInput, Button, Text,TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import styles from './Chat.style';
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client/dist/socket.io";
 const ChatScreen = () => {
    const socket=io.connect("http://192.168.1.54:2000")
    const[FriendName,setFriendName] =useState("") 
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState(false);
    const [user, setUser] = useState("");
    const [roomId, setRoomId] = useState("");
    const sendMessage = () => {
        if (message.trim() !== '' && socket) {
            const messageObj = {
                text: message,
                sender: user,
                recipient: FriendName,
                roomId: roomId 
            };
            setMessages([...messages, messageObj]);
            socket.emit('message', messageObj);
            setMessage('');
        
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
        setRoomId([username, name].sort().join('-'));
        console.log('roomid: ', roomId);
        socket.emit("joinRoom", user, FriendName);
    }
    useEffect(() => {
        GetNames();
        const handleNewMessage = (message,RoomName) => {
            console.log("Roomname",RoomName,"RoomId",roomId);
            if (RoomName === roomId) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        };
    
        const handleTyping = (data) => {
            if (data!== user) {
                setTyping(true);
            }
        };
    
        const handleStopTyping = () => {
            setTyping(false);
        };
        if (socket && user && FriendName) {
            socket.on('Newmessage', handleNewMessage);
            socket.on('typing', handleTyping);
            socket.on('stopTyping', handleStopTyping);
        }
        return () => {
            if (socket) {
                socket.off('Newmessage', handleNewMessage);
                socket.off('typing', handleTyping);
                socket.off('stopTyping', handleStopTyping);
            }
            if (user && FriendName) {
                socket.emit("leaveRoom", { user: user, friend: FriendName });
            }
        };
     
    }, [socket, roomId, user, FriendName]);
  
  return (
    <View style={styles.container}>
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
                    <View style={[styles.messageBox, item.sender === user ? styles.sentMessage : styles.receivedMessage]}>
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
