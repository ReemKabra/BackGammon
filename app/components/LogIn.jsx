import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, Button,Alert } from "react-native";
import { useRouter } from "expo-router"
import userService from "../../services/userService";
import { TouchableOpacity } from "react-native-gesture-handler";

 const LogIn = () => {
const router=useRouter()
  const [isExists, setIsExists] = useState(true);
  const [users, setUsers] = useState([]);
  const currentUserNameRef = useRef(null);
  const currentPasswordRef = useRef(null);
  const fetchUsers = async () => {
    const response = await userService.get();
    setUsers(response.data);
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const onChangeUsername = () => {
    setIsExists(true);
  };

  const loginHandler = () => {
    const enterdUserName = currentUserNameRef.current?.value;
    const enterdPassword = currentPasswordRef.current?.value;
    const user = users.find((user) => user.username === enterdUserName);
    if (!user) {
      setIsExists(false);
    }
     else if (user) {
      userService
        .login(enterdUserName, enterdPassword)
        .then((loginSucceeded) => {
          if (loginSucceeded) {
            Alert.alert("loginSucceeded");
            router.replace("components/UserList2")
          } else Alert.alert("Login failed");
        });
    }
  };
  const NavigateToSignUp=()=>{
    router.replace("components/SignUp")
  }
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

    <View style={{ width: '80%', padding: 10, backgroundColor: '#f5f5f5', borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 }}>

        <TextInput
            placeholder="Username"
            name=""
            onChangeText={onChangeUsername}
            ref={currentUserNameRef}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
        />
        {!isExists && (
            <Text style={{ color: "red", marginBottom: 10 }}>This username doesn't exist</Text>
        )}
        <TextInput
            placeholder="Password"
            name=""
            secureTextEntry={true}
            ref={currentPasswordRef}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
        />
    </View>

    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>

        <TouchableOpacity 
            onPress={loginHandler} 
            style={{ backgroundColor: '#007AFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, marginRight: 10 }}>
            <Text style={{ color: 'white' }}> Log in </Text>
        </TouchableOpacity>

        <TouchableOpacity 
            onPress={(NavigateToSignUp) } 
            style={{ backgroundColor: '#4CAF50', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 }}>
            <Text style={{ color: 'white' }}> Register </Text>
        </TouchableOpacity>

    </View>

</View>

  );
};
export default LogIn
