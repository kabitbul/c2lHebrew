import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { Text, Button } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import { BarCodeScanner } from "expo-barcode-scanner";
import AppLoader from "./AppLoader";
import takecartAPI from "../api/TakeCartAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const qrSize = width * 0.7;

const CameraScreen = ({ navigation }) => {
  const { state, unlockCart } = useContext(AuthContext);

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loginPending, setLoginPending] = useState(false);

  const navToTakeCart = () => {
    navigation.navigate("TakeCart");
  };
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    //console.log('scanned');
    setScanned(true);
    setLoginPending(true);
    //console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
    //get the mac from string
    //console.log("***********************************");
    //console.log(data);
    //console.log("***********************************");
    var startMac = data.indexOf("mac=") + 4;
    var startAmpersand = data.indexOf("&");
    const mac = data.substring(startMac, startAmpersand);
    //console.log(mac);
    const Email = await AsyncStorage.getItem("email");
    //console.log(Email);
    //const response = null;
    try {
      //console.log("/Broker/UnlockCart?mac=" + mac + "&userId=" + Email);
      //console.log("***B4***");
      const response = await takecartAPI.get(
        "/Broker/UnlockCart?mac=" + mac + "&userId=" + Email
      );
      //console.log("***AFTER***");
      //console.log("***" + response);
      //console.log(response.data);
      const resp = JSON.stringify(response.data);
      //console.log(resp);
      if (response.data == "UnRecogLock") {
        setLoginPending(false);
        Alert.alert("??????????", "?????????? ???? ???????? ???? ??????????");
      } else if (response.data == "NoReturnCart") {
        setLoginPending(false);
        Alert.alert(
          "??????????",
          "???? ???????? ???????????? ?????? ?????????? ????????????. ?????? ?????? ?????????? ????????????"
        );
        //"Check with manager, last cart wasnt returned!");
      } else if (response.data == "nightHours") {
        setLoginPending(false);
        Alert.alert("??????????", "???? ???????? ?????????? ???????? ???????? ?????????? ???????????? ???? ??????????");
      } else if (resp.startsWith('"unlockCartOk')) {
        //console.log('unlock ok');
        const compId = resp.substring(resp.indexOf("Ok") + 2).slice(0, -1);
        //console.log(compId);
        setLoginPending(false);
        navigation.navigate("Image", { paramKey: compId });
      } else if (response.data.message == null) {
        setLoginPending(false);
        window.alert("?????????? ???????? ????????????, ???? ?????????? ??????.");
      }
    } catch (err) {
      setLoginPending(false);
      // console.log(response);
      window.alert("?????????? ???????? ????????????, ???? ?????????? ??????.");
    }
  };
  if (hasPermission === null) {
    return <Text style={[{ justifyContent: "center" }]}>???????? ??????????...</Text>;
  }
  if (hasPermission === false) {
    return (
      <SafeAreaView style={[{ flex: 1 }]}>
        <View style={[{ height: "6%" }]}></View>
        <View style={{ height: "40%" }}>
          <Image
            style={styles.imageStyle}
            source={require("../../assets/c2l.png")}
          />
        </View>
        <View style={[{ height: "6%" }]}></View>
        <View
          style={[
            {
              height: "48%",
              backgroundColor: "#FFC14D",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text
            style={[{ fontSize: 30, fontWeight: "bold", color: "#DD3224" }]}
          >
            ???? ?????????? ???? ?????????????????? ???????? ???????????? ???????? ???????????? ?????????? ?????????? ??????????
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <>
      <SafeAreaView style={[{ flex: 1 }]}>
        <View style={[{ flex: 1 }]}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.logoutStyle}
              onPress={navToTakeCart}
            >
              <Text style={styles.logoutText}>???????? ???????? ????????</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: "85%" }}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            >
              <Text style={styles.description}>???? ?????????? ???? ???????? ???? ????????????</Text>
            </BarCodeScanner>
          </View>
          {scanned && (
            <Button
              title={"?????? ???????????? ??????????"}
              onPress={() => setScanned(false)}
            />
          )}
        </View>
      </SafeAreaView>
      {loginPending ? <AppLoader /> : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
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
  qr: {
    marginTop: "20%",
    marginBottom: "20%",
    width: qrSize,
    height: qrSize,
  },
  description: {
    fontSize: width * 0.09,
    marginTop: "10%",
    textAlign: "center",
    width: "100%",
    color: "white",
  },
  logoutText: { fontWeight: "bold", fontSize: 18, color: "#007096" },
  imageStyle: { height: 400, width: 400 },
  header: {
    paddingTop: 10,
    marginTop: 10,
    backgroundColor: "darkorange",
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    textAlignVertical: "center",
  },
});

export default CameraScreen;
