import React, { useEffect, useState } from 'react'
import userService from "../../services/userService";
import  UserService  from '../../services/userService';
import styles from './UserItem.style';
import {getSocket,disconnectSocket} from "../utils/socket";
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
  const [isLoading,setIsLoading]=useState();
  const [users, setUsers] = useState([]);
  const [user,setUser] = useState("");
  const[offlineUsers,setOfflineUsers]=useState([]);
  const getuser= async()=>{
    const username = await AsyncStorage.getItem("username");
    setUser(username);
    const response= await userService.get();
    if(response){
      setOnlineUsers(response.data.filter(user=>user.username!=username&&user.token));
      setOfflineUsers(response.data.filter(user=>!user.token));
      setUsers(response.data);
    }
  }
  useEffect(() => {
    getuser();
    const handleUserLogin = (loggedInUser) => {
        if (loggedInUser.username !== user) {  // Prevent adding yourself to the list
            setOnlineUsers(prevUsers => [...prevUsers, loggedInUser]);
            setOfflineUsers(prevUsers => 
                prevUsers.filter(u => u.username !== loggedInUser.username)
            );
        }
    }
    const handleUserLogout = (loggedOutUser) => {
        if (loggedOutUser.username !== user) {  // Prevent removing yourself from the list
            setOfflineUsers(prevUsers => [...prevUsers, loggedOutUser]);
            setOnlineUsers(prevUsers => 
                prevUsers.filter(u => u.username !== loggedOutUser.username)
            );
        }
    }
    socket.on("recieved user-login", handleUserLogin);
    socket.on("received-logout", handleUserLogout);

    return () => {
        socket.off("recieved user-login", handleUserLogin);
        socket.off("received-logout", handleUserLogout);
    };
}, [socket, user]);
const handleLogout = async () => {
  try {
      const currentUser = users.find(u => u.username === user);
      if (currentUser) {
          // First, update the user's status in your database/service
          const updatedUser = {
              username: currentUser.username,
              token: null  // Assuming null token indicates they are offline
          };
          await UserService.put(updatedUser);

          // Emit logout event with user data so that server knows who logged out
          socket.emit("logout", updatedUser);

          // Now proceed to client-side logout operations
          disconnectSocket();
          await AsyncStorage.removeItem("token");
          router.replace("/");
      }
  } catch (error) {
      console.error("Error during logout:", error);
  }
};

  
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
                <Text>Users</Text>
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
                            <UserItem user={item} />
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
