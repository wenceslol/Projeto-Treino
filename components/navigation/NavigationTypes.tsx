import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Login: undefined;
  Registro: undefined;
  MainTabs: undefined; // O nome da sua rota do TabNavigator no RootStack
  FirstAccess: undefined;
};

export type TabParamList = {
  Home: undefined;
  Details: undefined;
  TreinoStack: undefined;
  // Adicione aqui os nomes de todas as suas abas
};

export type DefaultNavigationProp = BottomTabNavigationProp<TabParamList> &
                                    NativeStackNavigationProp<RootStackParamList>;