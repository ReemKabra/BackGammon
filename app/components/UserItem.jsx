import React,{useState,useEffect} from 'react'
import styles from "./UserItem.style"
import { View,Text,TouchableOpacity } from 'react-native'
import { MaterialIcons ,FontAwesome5 } from '@expo/vector-icons'; 
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
const handleCubePress = async () => {
  await AsyncStorage.setItem("FriendName", props.user.username);
  // props.gamerequest();
  router.push("components/Game");
};
  return (
    <View style={styles.userContainer}>
  <View style={styles.header}>
    <Text>userName:{props.user.username}</Text>
    <View style={{ flexDirection: 'row' }}>  {/* <-- Wrap the icons in a View with a row direction */}
      <TouchableOpacity onPress={handlePress}>
        <MaterialIcons name="message" size={24} color="blue" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCubePress}>
        <FontAwesome5 name="dice-six" size={24} color="black" />
      </TouchableOpacity>
    </View>
  </View>
</View>
  )
}
