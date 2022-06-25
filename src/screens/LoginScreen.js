import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Text, Input } from "react-native-elements";
import AppLoader from "./AppLoader";
import UserExistsAPI from "../api/UserExistsAPI";
import SendOTPAPI from "../api/SendOTPAPI";

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [loginPending, setLoginPending] = useState(false);

  const signinAPIcall = async () => {
    setLoginPending(true);
    const Email = phone + "@gmail.com";
    const params = { Email: Email };
    const response = await UserExistsAPI.post("/Users/UserExists", params);
    //console.log('after response');
    //console.log(response);
    //console.log('response data = ' + response.data);
    if (response.data != "Yes") {
      setLoginPending(false);
      Alert.alert("אזהרה", "טלפון אינו קיים במערכת, יש לבצע הרשמה");
    } else {
      //on prod, remove 1==1 and uncomment bellow 2 lines
      const respOTP = await SendOTPAPI.get(
        "/sendOtp.php?get=1&token=1DZI5018d20ccfa1d705c08a40092b11b0d1&phone=" +
          phone +
          "&type=sms&From=Click2Lock"
      );
      if (respOTP.data == "CODE_SENT") {
        //if (1 === 1) {
        setLoginPending(false);
        navigation.navigate("Otp", {
          phoneNumber: phone,
          screen: "login",
          name: "",
        });
      }
      //replace on prod
      else if (respOTP.data == "ERROR") {
        //else if (1 == 2) {
        Alert.alert("אזהרה", "בוצעה שגיאה במהלך שליחת הודעה");
      }
      //replace on prod
      else if (respOTP.data == "MAX_SENT ") {
        //else if (1 == 2) {
        Alert.alert(
          "אזהרה",
          "מספר הודעות מקסימאלי נשלח בדקות האחרונות, נא לנסות שוב מאוחר יותר"
        );
      }
    }
  };

  const navToReg = () => {
    navigation.navigate("Register");
  };
  return (
    <>
      <ScrollView>
        <SafeAreaView style={styles.safeAreaStyle}>
          <Image
            style={styles.imageStyle}
            resizeMode={"stretch"}
            source={require("../../assets/c2l.png")}
          />
          <Text style={styles.textTitle}>התחברות</Text>
          <View style={{ marginTop: 20 }} />

          <KeyboardAwareScrollView>
            <View style={[styles.container]}>
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="הזן מספר טלפון"
                inputContainerStyle={styles.inputContainer}
                value={phone}
                inputStyle={styles.inputText}
                keyboardType={"number-pad"}
                maxLength={10}
                leftIcon={
                  <Icon
                    name={"phone"}
                    size={22}
                    color="grey" //{this.state.isFocused ? '#0779e4' : 'grey'}
                  />
                }
                onChangeText={(newValue) => setPhone(newValue)}
              />
            </View>
            {phone.length < 10 ? (
              <View style={[styles.containerText]}>
                <Text style={styles.textWarning}>
                  נא להזין מספר בן עשר ספרות
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.buttonOpacity}
              onPress={signinAPIcall}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>כניסה</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonOpacity} onPress={navToReg}>
              <View>
                <Text style={styles.navLink}>
                  אין לך חשבון? עבור למסך הרשמה
                </Text>
              </View>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </ScrollView>
      {loginPending ? <AppLoader /> : null}
    </>
  );
};

const styles = StyleSheet.create({
  text: { fontSize: 30 },
  textWarning: { marginLeft: 30, fontSize: 18, color: "#FF8800" },
  textTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 50,
    color: "#007096",
  }, //'#4682B4'  },
  //fontFamily: 'Foundation',
  imageStyle: { width: 300, height: 250, marginLeft: 30, marginRight: 30 },
  safeAreaStyle: { flex: 1, backgroundColor: "rgb(255,255,255)" },
  input: {
    fontWeight: "bold",
    paddingLeft: 11,
    width: "90%",
    height: 50,
    borderRadius: 100,
    margin: 15,
    borderColor: "black",
    borderWidth: 1,
    fontSize: 15,
  },
  inputText: {
    color: "#0779e4",
    marginLeft: 10,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#EE7629", //'#F28C28',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 50,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
  buttonOpacity: { borderRadius: 100 },
  navLink: {
    textAlign: "center",
    color: "#0000EE",
    marginTop: 20,
    marginBottom: 160,
    fontSize: 17,
  },
  container: {
    width: "90%",
    height: 50,
    borderRadius: 100,
    marginVertical: 10,
    marginLeft: 25,
    borderWidth: 1,
  },
  containerText: {
    width: "90%",
    height: 30,
    marginVertical: 1,
    marginLeft: 25,
  },
  inputContainer: { borderBottomWidth: 0, borderColor: "#0779ef" },
});

export default LoginScreen;
