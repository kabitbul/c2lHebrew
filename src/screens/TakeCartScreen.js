import React from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import AwesomeButtonRick from "react-native-really-awesome-button/src/themes/rick";

const TakeCartScreen = ({ navigation }) => {
  const navToLogout = () => {
    navigation.navigate("Account");
  };
  const navToCamera = () => {
    var dt = new Date().toString();
    const dat = Date.parse(dt);
    const datsub = Date.parse("Sun Mar 20 2022 20:00:45 GMT+0200 (IST)");
    const datsub2 = Date.parse("Sun Mar 20 2020 20:00:45 GMT+0200 (IST)");

    //console.log(datsub - datsub2);
    //console.log((datsub - datsub2)/(1000*60*60*24));
    navigation.navigate("Camera");
  };

  return (
    <SafeAreaView style={[{ flex: 1 }]}>
      <View style={[{ height: "10%", backgroundColor: "#EE7629" }]}>
        <TouchableOpacity style={styles.logoutStyle} onPress={navToLogout}>
          <Text style={styles.logoutText}>התנתק</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: "40%" }}>
        <Image
          style={styles.imageStyle}
          source={require("../../assets/c2l.png")}
        />
      </View>
      <View
        style={{
          height: "20%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20, color: "#C0C0C0" }}>ברוכים הבאים,</Text>
        <Text style={{ fontSize: 20, color: "#C0C0C0" }}>
          נא הקש על הכפתור במסך
        </Text>
        <Text style={{ fontSize: 20, color: "#C0C0C0" }}>
          על מנת לסרוק את המנעול ולקחת עגלה.
        </Text>
      </View>
      <View
        style={{
          height: "30%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
        }}
      >
        {/*			         <TouchableOpacity style={styles.roundButton} onPress={navToCamera}>
                             <Text style={styles.btnText}>Unlock Cart</Text>
	 </TouchableOpacity>*/}
        <AwesomeButtonRick
          onPress={navToCamera}
          type="primary"
          width={170}
          height={120}
          textSize={25}
          raiseLevel={15}
          borderRadius={40}
          backgroundColor={"#EE7629"}
          backgroundDarker={"#E63D11"}
          textColor={"#FFFFFF"}
          textLineHeight={100}
        >
          סרוק ברקוד
        </AwesomeButtonRick>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageView: {
    height: 300,
    position: "absolute",
    marginBottom: 100,
    backgroundColor: "green",
  },
  imageStyle: { height: 400, width: 400 },
  safeAreaStyle: { backgroundColor: "rgb(255,255,255)" },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  header: {
    paddingTop: 30,
    marginTop: 30,
    backgroundColor: "#EE7629",
    fontWeight: "bold",
  },
  logoutStyle: {
    textAlign: "center",
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
    alignContent: "flex-end",
    marginTop: 35,
    marginRight: 10,
  },
  roundButton: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
    backgroundColor: "#EE7629",
    borderColor: "black",
  },
  logoutText: { fontWeight: "bold", fontSize: 18, color: "#007096" },
  btnText: {
    textAlign: "center",
    color: "#007096",
    marginTop: 20,
    marginBottom: 20,
    fontWeight: "bold",
    fontSize: 30,
  },
});

export default TakeCartScreen;
