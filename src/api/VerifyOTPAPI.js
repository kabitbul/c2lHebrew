import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const instance = axios.create({
  baseURL: "https://www.micropay.co.il/extApi",
  //headers:{
  //    Authorization: 'bearer aaaaaa'
  // }
  /*data:{Email: "0503034610"+"gmail.com", 
         Password: "Click2Lock!"+"4610",
         ConfirmPassword: "Click2Lock!"+"4610", 
         FullName: "Kobi Abitbul"

   }*/
});

export default instance;
