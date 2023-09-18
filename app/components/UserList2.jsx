import React, { useEffect, useState } from 'react'
import userService from "../../services/userService";
import styles from './UserItem.style';
import {getSocket,disconnectSocket,initiateSocket} from "../utils/socket";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Stack, router } from 'expo-router';
import { UserItem } from './UserItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
 const Userlist2 = () => {
  const socket=getSocket();
  const [onlinedUsers,setOnlineUsers]=useState([]);
  const [user,setUser] = useState("");
  const[offlineUsers,setOfflineUsers]=useState([]);
  useEffect(() => {
    const getuser = async() => {
        const username = await AsyncStorage.getItem("username");
        setUser(username);
    };
    getuser();
    const handleUsers = (offlineusers,onlineusers) => {
        console.log("username",user);
        offlineusers = offlineusers.filter(offlineUser => {
            return offlineUser.username !== user;
        })
        onlineusers = onlineusers.filter(onlineusers => {
            return onlineusers.username !== user;
        })
        console.log("offline",offlineusers,"online",onlineusers)
            setOfflineUsers(offlineusers);
            setOnlineUsers(onlineusers);      
    }
    socket.on("getUsers",handleUsers);
    socket.on("user-registered",handleUsers);
    socket.on("user-logged-in", handleUsers);
    socket.on("user-logged-out", handleUsers);
    return () => {
        socket.off("getUsers", handleUsers);
        socket.off("user-logged-in", handleUsers);
        socket.off("user-logged-out", handleUsers);
    };
}, []);
const handleLogout = async () => {
    const username = await AsyncStorage.getItem("username"); 
    const token = await AsyncStorage.getItem("refreshToken");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("username");
    await AsyncStorage.removeItem("FriendName");
    const socket = getSocket();
    socket.emit('userLoggedOut', { username: username, token:token });
    console.log(username, token);
    disconnectSocket();
    router.replace('/'); 


};
// const handleGameReqest=(FriendName)=>{
//     if (user==FriendName){

//     }


//     router.push("components/GameBoard");
// }
  return (
    <View>
       <Stack.Screen
          options={
          {
            headerShadowVisible: true,
            headerTitle:"Users"
          }
          }/>
      <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={{ color: 'red' }}>Logout</Text>
                </TouchableOpacity>
            </View>
      <View style={{ padding: 10 }}>
                <Text>Welcome {user}</Text>
            </View>
            <View style={{ padding: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>Online Users</Text>
                <FlatList
                    data={onlinedUsers}
                    renderItem={({ item }) => (
                        <View style={{ marginBottom: 15 }}>
                            <UserItem user={item}/>
                        </View>
                    )}
                    keyExtractor={item => item.username} 
                />
            </View>
            <View style={{ height: 1, backgroundColor: 'grey', marginVertical: 10 }} />
            <View style={{ padding: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>Offline Users</Text>
                <FlatList
                    data={offlineUsers}
                    renderItem={({ item }) => (
                        <View style={{ marginBottom: 15 }}>
                            <Text>{item.username}</Text>
                        </View>
                    )}
                    keyExtractor={item => item.username} 
                />
            </View>
        </View>
    </View>
  )
}
export default Userlist2
