import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import RegistrationScreen from "./src/screens/RegistrationScreen";
import LoginScreen from "./src/screens/LoginScreen";
import ImageScreen from "./src/screens/ImageScreen";
import TakeCartScreen from "./src/screens/TakeCartScreen";
import SuccessScreen from "./src/screens/SuccessScreen";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { setNavigator } from "./src/navigationRef";
import initialScreen from "./src/screens/initialScreen";
import AccountScreen from "./src/screens/AccountScreen";
import CameraScreen from "./src/screens/CameraScreen";
import OtpScreen from "./src/screens/Otp";

const switchNavigator = createSwitchNavigator({
  initial: initialScreen,
  Account: AccountScreen,
  loginFlow: createStackNavigator({
    Register: RegistrationScreen,
    Login: LoginScreen,
  }),
  TakeCart: TakeCartScreen,
  Success: SuccessScreen,
  Camera: CameraScreen,
  Image: ImageScreen,
  Otp: OtpScreen,
});

const App = createAppContainer(switchNavigator);
export default () => {
  return (
    <AuthProvider>
      <App
        ref={(navigator) => {
          setNavigator(navigator);
        }}
      />
    </AuthProvider>
  );
};
