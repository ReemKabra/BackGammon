import React,{useState,useEffect,useRef} from 'react'
import { useRouter,Stack } from 'expo-router';
import User from '../../models/user';
import userService from '../../services/userService';
import { View, Text, TextInput, Button,Alert } from 'react-native';
export const SignUp = ({navigation}) => {
  const router=useRouter();
    const [users, setUsers] = useState([]);
    const [isExists, setIsExists] = useState(false);
    const [isPassword, setIsPassword] = useState(true);
  
    const fetchUsers = async () => {
      try {
        const response = await userService.get();
        if (response) {
          setUsers(response.data);
        } else {
          console.error("sign up failed");
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
      fetchUsers();
    }, []);
  
    const currentUserNameRef = useRef(null);
    const currentPasswordRef = useRef(null);
    const currentEmailRef = useRef(null);
    const onChangeHandler = (fieldName, text) => {
      if (fieldName === 'username') {
        setIsExists(false);
      } else if (fieldName === 'password') {
        setIsPassword(true);
      }
    };
  
    const signupHandler = () => {
      const enteredUserName = currentUserNameRef.current?.value;
      const enteredEmail = currentEmailRef.current?.value;
      const enteredPassword = currentPasswordRef.current?.value||"";
  
      const user = users.find((user) => user.username === enteredUserName);
      if (user) {
        setIsExists(true);
      }
      if (enteredPassword.length < 6) {
        setIsPassword(false);
      } else if (enteredPassword.length >= 6 && !user) {
        setIsExists(false);
        setIsPassword(true);
        const newuser=new User(enteredUserName, enteredPassword,enteredEmail)
        console.log(newuser);
        userService.post(newuser);
        Alert.alert("Success", "User signed up successfully!");
        router.replace("/")
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
            ref={currentUserNameRef}
            onChangeText={(text) => onChangeHandler('username', text)}
        />
        {isExists && <Text style={{ color: 'red', marginBottom: 10 }}>This username already exists</Text>}

        <Text>Password:</Text>
        <TextInput
            required
            name="password"
            secureTextEntry={true}
            style={{ borderWidth: 1, borderColor: 'black', marginBottom: 5 }}
            ref={currentPasswordRef}
            onChangeText={(text) => onChangeHandler('password', text)}
        />
        {!isPassword && <Text style={{ color: 'red', marginBottom: 10 }}>Invalid Password</Text>}

        <Text>Email:</Text>
        <TextInput
            type="text"
            style={{ borderWidth: 1, borderColor: 'black', marginBottom: 10 }}
            ref={currentEmailRef}
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

