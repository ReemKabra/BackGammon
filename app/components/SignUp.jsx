import React,{useState,useEffect} from 'react'
import { useRouter,Stack } from 'expo-router';
import User from '../../models/user';
import userService from '../../services/userService';
import {getSocket,disconnectSocket,initiateSocket} from "../utils/socket";
import { View, Text, TextInput, Button,Alert } from 'react-native';
export const SignUp = () => {
  const router=useRouter();
    const [isExists, setIsExists] = useState(false);
    const [isPassword, setIsPassword] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
    useEffect(() => {
    
    }, []);
    const onChangeHandler = (fieldName, text) => {
      if (fieldName === 'username') {
        setIsExists(false);
        setUsername(text);
      } else if (fieldName === 'password') {
        setPassword(text);
        setIsPassword(true);
      }
      else{
        setEmail(text);
      }
    };
    const signupHandler = () => {
      if (password.length < 6) {
        setIsPassword(false);
      } else if (password.length >= 6 ) {
        setIsExists(false);
        setIsPassword(true);
        const newuser=new User(username, password,email)
        console.log(newuser);
        try{
          userService.post(newuser);
          Alert.alert("Success", "User signed up successfully!");
          router.replace("/")
        }
        catch(eror){
          setIsExists(true);
        }
      }
    };
    const BackHandler = () => {
      router.replace("/")
    };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
       <Stack.Screen
          options={
          {
            headerShadowVisible: true,
            headerTitle:"Register"
          }
          }/>

    <View style={{ width: '80%', padding: 10, backgroundColor: '#f5f5f5', borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 }}>
        
        <Text>Username:</Text>
        <TextInput
            required
            name="username"
            type="text"
            style={{ borderWidth: 1, borderColor: 'black', marginBottom: 5 }}
            onChangeText={(text) => onChangeHandler('username', text)}
        />
        {isExists && <Text style={{ color: 'red', marginBottom: 10 }}>This username already exists</Text>}

        <Text>Password:</Text>
        <TextInput
            required
            name="password"
            secureTextEntry={true}
            style={{ borderWidth: 1, borderColor: 'black', marginBottom: 5 }}
            onChangeText={(text) => onChangeHandler('password', text)}
        />
        {!isPassword && <Text style={{ color: 'red', marginBottom: 10 }}>Invalid Password</Text>}

        <Text>Email:</Text>
        <TextInput
            type="text"
            style={{ borderWidth: 1, borderColor: 'black', marginBottom: 10 }}
            onChangeText={(text) => onChangeHandler('email', text)}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <Button title="Sign up" onPress={signupHandler} color="#007AFF" />
            <Button title="Back" onPress={BackHandler} color="#4CAF50" />
        </View>
    </View>
</View>

  );
};
 export default SignUp

