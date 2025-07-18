import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from './RootStack';
import { AuthService } from '../auth/AuthService';
import { AsyncService } from '../data/AsyncService';
import { TokenStorage } from '../auth/TokenStorage';
import { DataService } from '../data/DataService';
import { Alert } from 'react-native';

const AuthLoadingScreen = () => {

    const navigation = useNavigation<NavigationProp>();


  useEffect(() => {
    const teste = async () => {
      const teste = await AsyncService.GetData();
      console.log(teste);
    }
    teste();
  }, []);

useEffect(() => {

  const MAX_RETRIES = 5;
  const RETRY_DELAY = 3000; // 2 segundos
  let retryCount = 0;

  const authFlow = async () => {
    try {
      // 1. Verificação de autenticação
      const isAuthenticated = await handleAuthentication();
      
      if (isAuthenticated) {
        // 2. Verificação de dados locais
        const hasLocalData = await handleLocalData();
        console.log("Existe dados?", hasLocalData)
        // 3. Navegação baseada no estado
        navigateBasedOnState(hasLocalData);
      }
    } catch (error) {
      console.error("Erro no fluxo de autenticação:", error);
      navigation.replace('Login');
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Funções auxiliares para separar a lógica
  const handleAuthentication = async (): Promise<boolean> => {
    const token = await TokenStorage.getToken("myAccessToken");
    
    if (!token) {
      console.log("Nenhum token encontrado.");
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      return false;
    }

    console.log("Verificando token de acesso...");
    const isAccessTokenValid = await AuthService.VerifyAccessToken();
    console.log(isAccessTokenValid);
    if (isAccessTokenValid === "Network Error") {
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        console.warn(`Network Error - Tentativa ${retryCount}/${MAX_RETRIES}. Tentando novamente em ${RETRY_DELAY/1000}s...`);
        await delay(RETRY_DELAY);
        return handleAuthentication();
      }
      console.error("Número maximo de tentativas alcançado");
      Alert.alert("Erro de conexão", "Não foi possível conectar ao servidor. Verifique sua internet.");
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      return false
    }
    if (isAccessTokenValid) {
      console.log("Token de acesso válido.");
      return true;
    }

    console.warn("Token inválido. Tentando renovar...");
    return await handleTokenRefresh();
  };

  const handleTokenRefresh = async (): Promise<boolean> => {
    try {
      const isRefreshed = await AuthService.RefreshTokens();
      
      if (isRefreshed) {
        console.log("Tokens renovados com sucesso.");
        return true;
      }
      
      console.error("Falha ao renovar tokens.");
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      return false;
    } catch (error) {
      console.error("Erro ao renovar tokens:", error);
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      return false;
    }
  };

  const handleLocalData = async (): Promise<boolean> => {
    console.log("Verificando arquivos locais...");
    const hasLocalData = await AsyncService.CheckData();
    
    if (hasLocalData) {
      console.log("Dados locais encontrados.");
      return true;
    }

    console.log("Dados locais não encontrados. Buscando do banco...");
    return await recoverRemoteData();
  };

  const recoverRemoteData = async (): Promise<boolean> => {
    try {
      const dataRecovered = await DataService.GetData();
      
      if (dataRecovered) {
        console.log("Dados recuperados com sucesso.");
        return true;
      }
      
      console.warn("Falha ao recuperar dados do banco.");
      return false;
    } catch (error) {
      console.error("Erro ao recuperar dados:", error);
      return false;
    }
  };

  const navigateBasedOnState = (hasLocalData: boolean) => {
    navigation.reset({
      index: 0,
      routes: [{ name: hasLocalData ? "MainTabs" : "FirstAccess" }],
    });
  };

  // Executa o fluxo
  authFlow();
}, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size={50} />
    </View>
  );
};

export default AuthLoadingScreen;