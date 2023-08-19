import React from 'react'
import styles from "./UserItem.style"
import { View,Text,TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
export const UserItem = (props) => {
  const router=useRouter();
  return (
    <View style={styles.userContainer}>
    <View style={styles.header}>
      <Text>userName:{props.user.username}</Text>
      <TouchableOpacity onPress={() => { 
        AsyncStorage.setItem("FriendName",props.user.username);
        router.push("components/ChatScreen")
                }}>
                    <MaterialIcons name="message" size={24} color="blue" />
                </TouchableOpacity>
    </View>
  </View>
  )
}
