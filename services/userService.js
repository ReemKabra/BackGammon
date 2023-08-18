import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const URL="http://192.168.1.33:8080/"
class userService {
    get(){
        return axios.get(URL);
    }
    delete(id){
        return axios.delete(`${URL}${id}`);
    }
    post(user){
        return axios.post(URL+"signup", user);
    }
    getById(id) {
        return axios.get(`${URL}${id}`);
      }
      async login(username, password){
        try {
              const response = await axios.post(URL+"login", { username: username, password: password });
              const token = response.data.token;
              const user = response.data.username;
              AsyncStorage.setItem("token",token);
              AsyncStorage.setItem("username",user);
              return true;
          } catch (error) {
              console.error("Login failed:", error);
              return false;
          }
      }
      put(user){
        return axios.put(URL,user)
      }

}
export default new userService;