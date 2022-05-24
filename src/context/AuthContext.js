import createDataContext from "./createDataContext";
import registerAPI from "../api/registerAPI";
import takecartAPI from "../api/TakeCartAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../navigationRef";

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "register":
      return { errorMessage: "", token: action.payload };
    case "signout":
      return { token: null, errorMessage: "" };
    case "unlockCart":
      return { errorMessage: "", token: action.payload };
    default:
      return state;
  }
};

const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("token");
  const tokenDate = await AsyncStorage.getItem("dateToken");
  //last token date into date from string
  const lastTokenDate = Date.parse(tokenDate);
  var currentDate = new Date();
  // get days between today and token date
  var daysGap = Math.floor(
    (currentDate - lastTokenDate) / (1000 * 60 * 60 * 24)
  );
  console.log(daysGap);
  if (!token) {
    navigate("Register");
  } else if (daysGap < 365 * 5 - 5) {
    //if token is valid
    dispatch({ type: "register", payload: token });
    navigate("TakeCart");
  } else if (daysGap > 365 * 5 - 5) {
    //if token is almost reaching 5 years delete token
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("email");
    await AsyncStorage.removeItem("dateToken");
    navigate("Login");
  }
};

const register = (dispatch) => {
  return async ({ Email, Password, ConfirmPassword, FullName }) => {
    //make api request to register
    try {
      const params = {
        Email: Email,
        Password: Password,
        ConfirmPassword: ConfirmPassword,
        FullName: FullName,
      };
      const response = await registerAPI.post("/Users/Register", params);
      if (response.data == "Name Exist") {
        dispatch({ type: "add_error", payload: "Phone already exists!" });
        window.alert("Phone already exists!");
      } else {
        var isoDateString = date.toISOString();
        await AsyncStorage.setItem("token", response.data);
        await AsyncStorage.setItem("email", params.Email);

        dispatch({ type: "register", payload: response.data });
        navigate("TakeCart");
      }
    } catch (err) {
      dispatch({
        type: "add_error",
        payload: "Something went wrong with sign up",
      });
      window.alert("Something went wrong with sign up!");
    }
  };
};

const signin = (dispatch) => {
  return async ({ Email, Password }) => {
    //make api request to signin
    try {
      const params = {
        username: Email,
        password: Password,
      };
      const response = await registerAPI.post("/Users/Authenticate", params);
      if (response.data.message == "User Not Found") {
        dispatch({ type: "add_error", payload: "Phone doesnt exists!" });
        window.alert("Phone doesnt exists!");
      } else {
        await AsyncStorage.setItem("token", response.data.token);
        await AsyncStorage.setItem("email", Email);

        dispatch({ type: "register", payload: response.data.token });
        navigate("TakeCart");
      }
    } catch (err) {
      dispatch({
        type: "add_error",
        payload: "Something went wrong with login",
      });
      window.alert("Something went wrong with login!");
    }
  };
};

const unlockCart = (dispatch) => {
  return async ({ Email, mac }) => {
    //make api request to signin
    try {
      const params = {
        mac: mac,
        userId: Email,
      };
      const response = await takecartAPI.get(
        "/Broker/UnlockCart?mac=" + mac + "&userId=" + Email
      );
      if (response.data == "UnRecogLock") {
        dispatch({ type: "add_error", payload: "Lock exists!" });
        window.alert("could not verify cart!");
      } else if (response.data == "NoReturnCart") {
        dispatch({ type: "add_error", payload: "Cart Not Returned!" });
        window.alert("Check with manager, last cart wasnt returned!");
      } else if (response.data == "unlockCartOk") {
        navigate("Image");
      } else if (response.data.message == null) {
        dispatch({ type: "add_error", payload: "Error on message!" });
        window.alert("Error Occured during Cart Unlock!");
      }
    } catch (err) {
      dispatch({
        type: "add_error",
        payload: "Error Occured during Cart Unlock",
      });
      window.alert("Error Occured during Cart Unlock!");
    }
  };
};

const signout = (dispatch) => {
  return async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("email");
    await AsyncStorage.removeItem("dateToken");
    dispatch({ type: "signout" });
    navigate("Login");
  };
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout, register, unlockCart, tryLocalSignin },
  { token: null, errorMessage: "" }
);
