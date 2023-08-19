import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import userService from "../../services/userService";
import { TouchableOpacity } from "react-native-gesture-handler";
import {initiateSocket,getSocket} from "../utils/socket";
const LogIn = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isExists, setIsExists] = useState(true);
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    const response = await userService.get();
    setUsers(response.data);
  };
  useEffect(() => {
    fetchUsers();
    
  }, []);
  const onChangeHandler = (fieldName, text) => {
    if (fieldName === 'username') {
    setUsername(text);
    setIsExists(true);
    } else if (fieldName === 'password') {
      setPassword(text);
    }
  };
  const loginHandler = () => {
    const user = users.find((user) => user.username === username);
    if (!user) {
      setIsExists(false);
    } else if (user) {
      userService
        .login(username, password)
        .then((loginSucceeded) => {
          if (loginSucceeded) {
            initiateSocket();
            const socket = getSocket();
            const loggedInUser = {
              username: user.username,
            };
            socket.emit("user-login", loggedInUser);  
            Alert.alert("loginSucceeded");
            router.replace("components/UserList2");
          } else Alert.alert("Login failed");
        });
    }
  };
  
  const NavigateToSignUp = () => {
    router.push("components/SignUp");
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: "80%",
          padding: 10,
          backgroundColor: "#f5f5f5",
          borderRadius: 10,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        <TextInput
          placeholder="Username"
          name=""
          onChangeText={(text) => onChangeHandler('username', text)}
          style={{ borderBottomWidth: 1, marginBottom: 10 }}
        />
        {!isExists && (
          <Text style={{ color: "red", marginBottom: 10 }}>
            This username doesn't exist
          </Text>
        )}
        <TextInput
          placeholder="Password"
          name=""
          secureTextEntry={true}
          onChangeText={(text) => onChangeHandler('password', text)}
          style={{ borderBottomWidth: 1, marginBottom: 10 }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          onPress={loginHandler}
          style={{
            backgroundColor: "#007AFF",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            marginRight: 10,
          }}
        >
          <Text style={{ color: "white" }}> Log in </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={NavigateToSignUp}
          style={{
            backgroundColor: "#4CAF50",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "white" }}> Register </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default LogIn;
