import React,{useState,useEffect} from 'react'
import styles from "./UserItem.style"
import { View,Text,TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
export const UserItem = (props) => {
  const router=useRouter();
  const handlePress = async () => {
    
    await AsyncStorage.setItem("FriendName", props.user.username);
    setTimeout(() => {
        router.push("components/ChatScreen");
    }, 100);
};
  return (
    <View style={styles.userContainer}>
    <View style={styles.header}>
      <Text>userName:{props.user.username}</Text>
      <TouchableOpacity onPress={handlePress}>
    <MaterialIcons name="message" size={24} color="blue" />
</TouchableOpacity>
    </View>
  </View>
  )
}
