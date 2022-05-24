import React, { useContext } from "react";
import { StyleSheet, View, TouchableOpacity, SafeAreaView } from "react-native";
import { Text } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";

const AccountScreen = ({ navigation }) => {
  const { state, signout } = useContext(AuthContext);
  const navToTakeCart = () => {
    navigation.navigate("TakeCart");
  };
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={{ fontSize: 25, color: "#007096" }}> החשבון שלי</Text>
      </View>
      <TouchableOpacity style={styles.buttonOpacity} onPress={signout}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>התנתק</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonOpacity} onPress={navToTakeCart}>
        <View style={[styles.button, { backgroundColor: "#007096" }]}>
          <Text style={styles.buttonText}>חזור למסך קודם</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 30,
    marginTop: 30,
    backgroundColor: "darkorange",
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    textAlignVertical: "center",
    paddingLeft: 30,
  },
  buttonOpacity: { borderRadius: 100 },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "red",
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
});

export default AccountScreen;
