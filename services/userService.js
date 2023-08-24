import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const URL="http://192.168.1.54:8080/"
class userService {
    get(){
        return axios.get(URL);
    }
    post(user){
        return axios.post(URL+"signup", user);
    }
      async login(username, password){
        try {
              const response = await axios.post(URL+"login", { username: username, password: password });
              const token = response.data.token;
              const user = response.data.username;
              AsyncStorage.setItem("token",token);
              AsyncStorage.setItem("username",user);
              AsyncStorage.setItem("refreshToken",response.data.refreshToken);
              return true;
          } catch (error) {
              console.error("Login failed:", error);
              return false;
          }
      }
      async logout() {
        try {
            await axios.post(URL + "logout");
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("username");
            return true;
        } catch (error) {
            console.error("Logout failed:", error);
            return false;
        }
    }
}
export default new userService;