import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home';
import TreinoStackScreen from './TreinoStack';
import TreinoAndamento from '../screens/treino/treinar/RealizarTreino';
import { TreinoProvider } from '../screens/treino/TreinoContext';
import ProfileScreen from '../screens/Perfil';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();


const CustomTabBarButton = ({ children, onPress }: any) => (
  <TouchableOpacity
    activeOpacity={0.7}
    style={styles.tabButton}
    onPress={onPress}
    delayPressIn={0} // Remove o delay do toque
  >
    <View style={styles.tabButtonInner}>
      {children}
    </View>
  </TouchableOpacity>
);

const AppTabNavigator: React.FC = () => {
  return (
    <TreinoProvider>

    
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#be3144', // Cor do ícone/texto da aba ativa
        tabBarInactiveTintColor: 'black', // Cor do ícone/texto da aba inativa
        tabBarStyle: { // Estilos para a barra de abas em si
          backgroundColor: '#f0f0f0',
          borderTopWidth: 1,
          borderTopColor: '#ccc',
          height: 60, // Ajuste a altura se necessário
          paddingBottom: 5, // Para deixar um pequeno espaço na parte inferior em dispositivos com notch
        },
        tabBarLabelStyle: { // Estilos para o texto da aba
          fontSize: 14,
        },
        tabBarIconStyle: { // Estilos para o ícone da aba
          marginTop: 5,
        },
        headerShown: false, // Oculta o cabeçalho padrão do Tab Navigator se o Stack já tiver um
        tabBarButton: (props) => (
            <CustomTabBarButton {...props} />
        ),
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início', // Título que aparece abaixo do ícone
          // Em breve, aqui você adicionará o tabBarIcon
          tabBarIcon:({color}) =>(
            <Icon name="home-outline" size={30} color={color}></Icon>
          )
          // tabBarIcon: ({ color, size }) => (
          //   <YourIconLibrary.HomeIcon name="home" color={color} size={size} />
          // ),
          
        }}
      />
      <Tab.Screen
        name="TreinoAndamento"
        component={TreinoAndamento}
        options={{
          title: 'Treino do dia',
          tabBarIcon:({color}) =>(
            <Icon name="dumbbell" size={30} color={color}></Icon>
          )
          // tabBarIcon: ({ color, size }) => (
          //   <YourIconLibrary.SettingsIcon name="settings" color={color} size={size} />
          // ),
        }}
      />
          <Tab.Screen
            name="TreinoStack"
            component={TreinoStackScreen}
            options={{
              title: 'Treinos',
              tabBarIcon:({color}) =>(
                <Icon name="form-select" size={30} color={color}></Icon>
              )
              // tabBarIcon: ({ color, size }) => (
              //   <YourIconLibrary.SettingsIcon name="settings" color={color} size={size} />
              // ),
            }}
          />
          <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          title: 'Perfil', // Título que aparece abaixo do ícone
          // Em breve, aqui você adicionará o tabBarIcon
          tabBarIcon:({color}) =>(
            <Icon name="account-outline" size={30} color={color}></Icon>
          )
          // tabBarIcon: ({ color, size }) => (
          //   <YourIconLibrary.HomeIcon name="home" color={color} size={size} />
          // ),
          
        }}
      />
      

      {/* Adicione outras abas aqui */}
    </Tab.Navigator>
    </TreinoProvider>
  );
};

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonInner: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default AppTabNavigator;