import React from "react";
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";

const ImageScreen = ({ navigation }) => {
  const compId = navigation.getParam("paramKey");
  const navToTakeCart = () => {
    navigation.navigate("TakeCart");
  };
  return (
    <SafeAreaView style={[{ flex: 1 }]}>
      <View style={[{ height: "8%", backgroundColor: "#EE7629" }]}>
        <TouchableOpacity style={styles.backStyle} onPress={navToTakeCart}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
      <View style={[{ height: "92%", backgroundColor: "#EE7629" }]}>
        <Image
          source={{
            uri:
              "https://click2lock.azurewebsites.net/Images/AdvertiseImg/Image" +
              compId +
              ".jpeg",
          }}
          style={{ width: "100%", height: "100%", resizeMode: "stretch" }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backStyle: {
    textAlign: "center",
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
    alignContent: "flex-end",
    marginTop: 35,
    marginRight: 10,
  },
  backText: { fontWeight: "bold", fontSize: 18, color: "#007096" },
});

export default ImageScreen;
