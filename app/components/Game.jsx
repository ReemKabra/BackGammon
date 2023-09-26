import React,{useEffect,useState} from 'react';
import { View, StyleSheet,Text } from 'react-native';
import { Stack } from 'expo-router';
import Board from './GameBoard';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Game = () => {
  const [user, setUser] = useState("");
  const[FriendName,setFriendName] =useState("") 
  const GetNames = async () => {
    try {
        const name = await AsyncStorage.getItem('FriendName');
        const username = await AsyncStorage.getItem('username');
  
        if (!name || !username) {
            console.error('Failed to retrieve one or both names from AsyncStorage.');
            return;
        }
  
        setFriendName(name);
        setUser(username);
  
    } catch (error) {
        console.error('Error in GetNames:', error.message);
    }
  };
useEffect(()=>{
  GetNames();
},[]);  
  return (
    
    <View style={styles.container}>
             <Stack.Screen
          options={
          {
            headerShadowVisible: true,
            headerTitle:"Checkers"
          }
          }/>
    <View style={styles.namesContainer}>
      <Text style={styles.userName}>User: {user}</Text>
      <Text style={styles.friendName}>Opponent: {FriendName}</Text>
    </View>
    <View style={styles.boardContainer}>
        <Board />
      </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',  // Add a background color if you wish
  },
  namesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 10,
  },
  userName: {
    fontSize: 20,
    color: 'blue', // Customize the color as needed
  },
  friendName: {
    fontSize: 20,
    color: 'green', // Customize the color as needed
  },
  boardContainer: {
    width: 400, // Adjust the width to make the board bigger
    height: 400, // Adjust the height to make the board bigger
    justifyContent: 'center', // Center the board horizontally
    alignItems: 'center', // Center the board vertically
    marginTop: 20, // Adjust the margin as needed
  },
});

export default Game;