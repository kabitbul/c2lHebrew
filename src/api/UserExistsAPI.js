import axios from "axios";

export default axios.create({
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
