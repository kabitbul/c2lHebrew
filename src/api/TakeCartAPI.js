import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const instance = axios.create({
  baseURL: "https://click2lockapi.azurewebsites.net",
  //headers:{
  //    Authorization: 'bearer aaaaaa'
  // }
  /*data:{Email: "0503034610"+"gmail.com", 
         Password: "Click2Lock!"+"4610",
         ConfirmPassword: "Click2Lock!"+"4610", 
         FullName: "Kobi Abitbul"

   }*/
});
instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    console.log("Bearer " + token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
