import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { Text } from "react-native-elements";
import SendOTPAPI from "../api/SendOTPAPI";
import VerifyOTPAPI from "../api/VerifyOTPAPI";
import registerAPI from "../api/registerAPI";
import AppLoader from "./AppLoader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

const Otp = ({ navigation }) => {
  const phoneNumber = navigation.getParam("phoneNumber");
  const screen = navigation.getParam("screen");
  const name = navigation.getParam("name");
  var isReverse = true;
  if (Localization.isRTL) {
    isReverse = false;
  } else {
    isReverse = true;
  }
  const [loginPending, setLoginPending] = useState(false);

  const pin1Ref = useRef("");
  const pin2Ref = useRef("");
  const pin3Ref = useRef("");
  const pin4Ref = useRef("");
  const pin5Ref = useRef("");
  const [pin1, setPin1] = useState("");
  const [pin2, setPin2] = useState("");
  const [pin3, setPin3] = useState("");
  const [pin4, setPin4] = useState("");
  const [pin5, setPin5] = useState("");

  const ResendAPI = async () => {
    setLoginPending(true);
    const respOTP = await SendOTPAPI.get(
      "/sendOtp.php?get=1&token=1DZI5018d20ccfa1d705c08a40092b11b0d1&phone=" +
        phoneNumber +
        "&type=sms&From=Click2Lock"
    );
    setLoginPending(false);
  };

  const verifyAPI = async () => {
    setLoginPending(true);
    //console.log('OTP in verify API phone is ' + phoneNumber + ' code is pin1 '+pin1+ ' pin2' + pin2+ ' pin3 '+pin3+ 'pin4 ' +pin4+ ' pin5 '+pin5);
    const verOTP = await VerifyOTPAPI.get(
      "/sendOtp.php?get=1&token=1DZI5018d20ccfa1d705c08a40092b11b0d1&phone=" +
        phoneNumber +
        "&code=" +
        pin1 +
        pin2 +
        pin3 +
        pin4 +
        pin5
    );
    //replace on prod
    //if (pin1 != 1 || pin2 != 2 || pin3 != 3 || pin4 != 4 || pin5 != 5) {
    /////////TEMP
    if (verOTP.data == "WRONG_CODE") {
      setLoginPending(false);
      Alert.alert("אזהרה", "הקוד שהוזן אינו תואם");
      return 0;
    }
    //replace on prod
    //else if (pin1 == 1 && pin2 == 2 && pin3 == 3 && pin4 == 4 && pin5 == 5) {
    //////////TEMP
    else if (verOTP.data == "CODE_VALID") {
      const Email = phoneNumber + "@gmail.com";
      const Password =
        "Click2Lock!" + phoneNumber.substring(phoneNumber.length - 4);
      const ConfirmPassword =
        "Click2Lock!" + phoneNumber.substring(phoneNumber.length - 4);
      const FullName = name;
      if (screen == "registration") {
        const params = {
          Email: Email,
          Password: Password,
          ConfirmPassword: ConfirmPassword,
          FullName: FullName,
        };
        const response = await registerAPI.post("/Users/Register", params);
        //console.log('OTP after registretaion API respons is '+ response.data);
        if (response.data == "Name Exist") {
          setLoginPending(false);
          Alert.alert("אזהרה", "טלפון כבר קיים במערכת!");
          return 0;
        } else {
          setLoginPending(false);
          var dt = new Date().toString();
          await AsyncStorage.setItem("token", response.data);
          await AsyncStorage.setItem("email", params.Email);
          await AsyncStorage.setItem("dateToken", dt);
          return 1;
        }
      } // from login
      else {
        //console.log('IN LOGIN LOGIC');
        const params = {
          username: Email,
          password: Password,
        };
        const response = await registerAPI.post("/Users/Authenticate", params);
        setLoginPending(false);
        // console.log('response.data.message ' + response.data.message);
        // console.log('response.data.token ' + response.data.token);
        if (response.data.message == "User Not Found") {
          Alert.alert("אזהרה", "טלפון אינו קיים במערכת");
          return 0;
        } else {
          var dt = new Date().toString();
          await AsyncStorage.setItem("token", response.data.token);
          await AsyncStorage.setItem("email", Email);
          await AsyncStorage.setItem("dateToken", dt);
          //navigation.navigate('TakeCart');
          return 1;
        }
      }
    }
    setLoginPending(false);
  };
  const navToPrev = () => {
    if (screen == "registration") {
      navigation.navigate("Register");
    } else {
      navigation.navigate("Login");
    }
  };
  useEffect(() => {
    (async () => {
      if (pin1 != "" && pin2 != "" && pin3 != "" && pin4 != "" && pin5 != "") {
        const stat = await verifyAPI();
        if (stat == 1) {
          navigation.navigate("TakeCart");
        }
      } else if (
        pin1 == "" &&
        pin2 == "" &&
        pin3 == "" &&
        pin4 == "" &&
        pin5 == ""
      ) {
        pin1Ref.current.focus();
      }
    })();
  }, [pin5]);
  return (
    <>
      <SafeAreaView style={[{ flex: 1 }]}>
        <View style={[{ height: "10%", flex: 0.3 }]}></View>
        <View
          style={[
            {
              height: "10%",
              backgroundColor: "#EE7629",
              alignContent: "center",
              textAlignVertical: "center",
              justifyContent: "center",
            },
          ]}
        >
          <TouchableOpacity style={styles.logoutStyle} onPress={navToPrev}>
            <Text style={styles.logoutText}>חזור למסך קודם</Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            {
              height: "18%",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 10,
            },
          ]}
        >
          <Image
            style={styles.imageStyle}
            source={require("../../assets/c2l.png")}
          />
        </View>
        <View
          style={[
            {
              height: "15%",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text
            style={[{ fontSize: 24, fontWeight: "bold", color: "#EE7629" }]}
          >
            וודא את מספר הטלפון שלך
          </Text>
        </View>
        <View
          style={[
            {
              height: "10%",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text style={[{ fontSize: 15 }]}>קוד אימות נשלח אלייך</Text>
          <Text style={[{ fontSize: 15 }]}>מספר טלפון {phoneNumber}</Text>
        </View>
        <View
          style={{
            height: "20%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: isReverse ? "row" : "row-reverse",
            justifyContent: "space-around",
          }}
        >
          <View style={styles.TextInputView}>
            <TextInput
              ref={pin1Ref}
              keyboardType={"number-pad"}
              maxLength={1}
              onChangeText={(pinVal1) => {
                setPin1(pinVal1);
                if (pinVal1 != "") {
                  pin2Ref.current.focus();
                }
              }}
              style={styles.TextInputText}
            />
          </View>
          <View style={styles.TextInputView}>
            <TextInput
              ref={pin2Ref}
              keyboardType={"number-pad"}
              maxLength={1}
              onChangeText={(pin2) => {
                setPin2(pin2);
                if (pin2 != "") {
                  pin3Ref.current.focus();
                }
              }}
              style={styles.TextInputText}
            />
          </View>
          <View style={styles.TextInputView}>
            <TextInput
              ref={pin3Ref}
              keyboardType={"number-pad"}
              maxLength={1}
              onChangeText={(pin3) => {
                setPin3(pin3);
                if (pin3 != "") {
                  pin4Ref.current.focus();
                }
              }}
              style={styles.TextInputText}
            />
          </View>
          <View style={styles.TextInputView}>
            <TextInput
              ref={pin4Ref}
              keyboardType={"number-pad"}
              maxLength={1}
              onChangeText={(pin4) => {
                setPin4(pin4);
                if (pin4 != "") {
                  pin5Ref.current.focus();
                }
              }}
              style={styles.TextInputText}
            />
          </View>
          <View style={styles.TextInputView}>
            <TextInput
              ref={pin5Ref}
              keyboardType={"number-pad"}
              maxLength={1}
              onChangeText={(pin5) => {
                setPin5(pin5);
                if (pin5 != "") {
                  //verifyAPI();
                }
              }}
              style={styles.TextInputText}
            />
          </View>
        </View>
        <View
          style={[
            { height: "10%", justifyContent: "center", alignItems: "center" },
          ]}
        >
          <TouchableOpacity style={styles.buttonOpacity} onPress={ResendAPI}>
            <Text style={[{ color: "blue", fontSize: 18 }]}>
              שלח שוב קוד אימות
            </Text>
          </TouchableOpacity>
        </View>
        {loginPending ? <AppLoader /> : null}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  TextInputView: {
    borderWidth: 1,
    borderRadius: 10,
    width: 45,
    height: 60,
    borderColor: "#EE7629",
    justifyContent: "center",
    alignItems: "center",
  },
  TextInputText: {
    fontSize: 30,
  },
  logoutStyle: {
    textAlign: "center",
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
    alignContent: "flex-end",
  },
  logoutText: { fontWeight: "bold", fontSize: 18, color: "#007096" },
  imageStyle: { height: "100%", width: 150, paddingTop: 20 },
});

export default Otp;
