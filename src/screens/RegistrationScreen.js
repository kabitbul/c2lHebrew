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

const RegistrationScreen = ({ navigation }) => {
  //const {state , register} = useContext(AuthContext);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loginPending, setLoginPending] = useState(false);

  //function from onPress
  const registerAPIcall = async () => {
    if (name.length < 3 || !name.includes(" ")) {
      Alert.alert("אזהרה", "שם לא תקין, נא לציין שם פרטי ומשפחה.");
      return;
    }
    if (phone.length < 10) {
      Alert.alert("אזהרה", "מספר טלפון לא תקין, נא להזין מספר בן 10 ספרות");
      return;
    }
    setLoginPending(true);
    const Email = phone + "@gmail.com";
    const params = { Email: Email };
    const response = await UserExistsAPI.post("/Users/UserExists", params);
    const resp = JSON.stringify(response.data);
    //console.log('regScreen response.data is ' + response.data);
    if (response.data == "Yes") {
      setLoginPending(false);
      Alert.alert("אזהרה", "טלפון כבר קיים במערכת!");
      return;
    } else {
      //console.log('regScreen before sending SMS');
      //********TEMP*****
      //const respOTP = await SendOTPAPI.get('/sendOtp.php?get=1&token=1DZI5018d20ccfa1d705c08a40092b11b0d1&phone='+phone+'&type=sms&From=Click2Lock');
      setLoginPending(false);
      //console.log('regScreen status from API IS '+ respOTP.data);
      if (1 === 1) {
        //********TEMP*****
        //if(respOTP.data == 'CODE_SENT')
        //console.log('regScreen CODE_SENT nav to OTP: ' );
        navigation.navigate("Otp", {
          phoneNumber: phone,
          screen: "registration",
          name: name,
        });
      }
      //else if(respOTP.data == 'ERROR')
      else if (1 == 2) {
        Alert.alert("אזהרה", "אירעה שגיאה בזמן שליחת ההודעה");
        return;
      }
      //else if(respOTP.data == 'MAX_SENT ')
      else if (1 == 2) {
        Alert.alert(
          "אזהרה",
          "מספר הודעות מקסימאלי נשלח בדקות האחרונות, נא לנסות שוב מאוחר יותר"
        );
        return;
      }
    }
  };

  const navToLogin = () => {
    navigation.navigate("Login");
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
          <KeyboardAwareScrollView>
            <Text style={styles.textTitle}>הרשמה</Text>

            <View style={{ marginTop: 20 }} />

            <View style={[styles.container]}>
              <Input
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="הזן שם פרטי + משפחה"
                placeholderTextColor={"grey"}
                value={name}
                onChangeText={(newValue) => setName(newValue)}
                leftIcon={<Icon name={"user"} size={22} color="grey" />}
              />
            </View>
            {name.length < 4 || !name.includes(" ") ? (
              <View style={[styles.containerText]}>
                <Text style={styles.textWarning}>נא הזן שם מלא</Text>
              </View>
            ) : null}
            <View style={[styles.container]}>
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="הזן מספר טלפון"
                inputContainerStyle={styles.inputContainer}
                //onFocus={this.onFocusChange}
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
                <Text style={styles.textWarning}>נא להזין מספר טלפון תקין</Text>
              </View>
            ) : null}
            {/*<Inputs name="Name" icon="user" />
            <Inputs name="Phone" icon="phone" />*/}
            <TouchableOpacity
              style={styles.buttonOpacity}
              onPress={registerAPIcall}
              //navigation.navigate('Login')
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>הרשם</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonOpacity} onPress={navToLogin}>
              <View>
                <Text style={styles.navLink}>
                  חשבון כבר קיים? עבור למסך התחברות כאן
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
  },
  //fontFamily: 'Foundation',
  imageStyle: { width: 300, height: 250, marginLeft: 30, marginRight: 30 },
  safeAreaStyle: { backgroundColor: "rgb(255,255,255)" },
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
    marginLeft: 5,
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
    marginBottom: 80,
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

export default RegistrationScreen;
