import React, { useEffect, useState } from 'react'
import userService from "../../services/userService";
import  UserService  from '../../services/userService';
import styles from './UserItem.style';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Stack } from 'expo-router';
import { UserItem } from './UserItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
 const Userlist2 = () => {
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
    useEffect(()=>{
      getuser()
    },[])
    const handleLogout=()=>{
      AsyncStorage.removeItem("token");
      const user=users.find(User=>User.username=user)
      const newuser={
        username: user.username,
        password: user.password,
        email: user.email,
        token:""
      }
      UserService.put(newuser);
    }
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
