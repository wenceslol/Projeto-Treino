import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import FirstAccessScreen from './FirstAccess';
import RegistroScreen from './Registro';
import LoginScreen from './Login';
import AuthLoadingScreen from './AuthLoading';
import AppTabNavigator from '../navigation/AppTabNavigator';
import { useNavigation } from '@react-navigation/native';

//Define a tipagem do parâmetro "name" como undefined para não gerar erros de syntaxe em typescript
//Caso não seja tipado vai gerar um erro ao tratar o "name" como string
type RootStackParamList = {
AuthLoading: undefined;
MainTabs: undefined;
Home: undefined;
Details: undefined;
FirstAccess: undefined;
Exercicio: undefined;
Registro: undefined;
Login: undefined;
};

//exporta a tipagem de parametros para as dependencias
export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

//Cria a stack de telas com seus parametros definidos na RootStackParamList
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {

    return (
        <Stack.Navigator screenOptions={{
        headerStyle: { backgroundColor: "tomato" },
        //headerShown: false,
        }}>
            <Stack.Screen   name="AuthLoading" 
                            component={AuthLoadingScreen} 
                            options={{headerShown: false}}/>
            
            <Stack.Screen   name="Login" 
                            component={LoginScreen} 
                            options={{headerShown: false}}/>

            <Stack.Screen   name="Registro" 
                            component={RegistroScreen} 
                            options={{headerShown: false}}/>
            
            <Stack.Screen
                name="MainTabs" // Conjunto de abas
                component={AppTabNavigator}
                options={{ headerShown: false }} // Oculta o cabeçalho para as abas
            />
            <Stack.Screen name="FirstAccess" component={FirstAccessScreen} options={{headerShown: false}}/>
                           
        </Stack.Navigator>
    );
};

export default RootStack;