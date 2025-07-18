//Arquivo destinado a lidar com ações de autenticação:
// (login, logout, registro, refreshtokens, isloggedin)

//import { api } from '../../api/ApiRequisicoes';
import axios, { AxiosRequestConfig } from 'axios';
import { Alert } from 'react-native';
import { TokenStorage } from './TokenStorage';
import { loginInterface, registerInterface } from './InterfaceTypes';
import { apiInstance, authInstance, defaultInstance } from '../middleware/Interceptor';
import { AsyncService } from '../data/AsyncService';


/*const api = axios.create({
  baseURL: 'http://10.0.2.2:3000/auth', // Substitua pelo endereço do backend
});*/


export const AuthService = {

    //criar um POST para solicitar outro envio de email de confirmação, validando sessão pelo accesstoken

    async VerifyAccessToken(): Promise<any> {
        try {
            // A requisição é feita. Se for bem-sucedida, o interceptor de resposta já salvou os tokens.
            // Se houver um erro HTTP (400, 401, etc.), o interceptor já cuidou do Alert.alert.
            const token = await TokenStorage.getToken("myAccessToken");
            const config: AxiosRequestConfig = {};
            if (token) {
                config.headers = {
                    Authorization: `Bearer ${token}`
                };
            }
            const response = await authInstance.post('/verify-token', null, config);
            // Se a requisição chegou até aqui, significa que foi bem-sucedida (status 2xx).
            // O interceptor já tratou o salvamento do token e o log de "Autenticado com sucesso!".
            // Você pode retornar os dados da resposta, que podem incluir o accessToken, um ID de usuário, etc.
            return response;
        } catch (error: any) {
            //console.log(error);
            // Este bloco 'catch' só será ativado se o interceptor de resposta rejeitar a Promise
            // ou se houver um erro antes mesmo da requisição ser enviada (ex: erro de rede).
            // O interceptor já exibe os alerts para erros HTTP.
            // Aqui, você pode fazer um tratamento adicional, como:
            // - Lançar um erro customizado para o componente chamar (se não quiser depender do Alert do interceptor)
            // - Lidar com erros de rede que o interceptor de resposta não pegaria (ex: se o servidor estiver offline)
            if (axios.isAxiosError(error) && !error.response) { // erros sem response(rede/timeout)
                console.error("Erro de rede ou conexão com o servidor: ", error.message);
                return error.response
                // Alert.alert('Problema de Conexão', 'Não foi possível conectar ao servidor. Verifique sua internet.');
            }
            // Re-throw o erro para que o componente que chamou a função possa lidar com ele, se necessário.
            throw error;
        }
    },

    async Cadastro(dados: registerInterface): Promise<any> {
        try {
            // A requisição é feita. Se for bem-sucedida, o interceptor de resposta já salvou os tokens.
            // Se houver um erro HTTP (400, 401, etc.), o interceptor já cuidou do Alert.alert.
            const response = await authInstance.post('/cadastro', {
                user: dados.user,
                email: dados.email,
                senha: dados.senha,
                confirmarSenha: dados.confirmarSenha,
            });
            
            // Se a requisição chegou até aqui, significa que foi bem-sucedida (status 2xx).
            // O interceptor já tratou o salvamento do token e o log de "Autenticado com sucesso!".
            // Você pode retornar os dados da resposta, que podem incluir o accessToken, um ID de usuário, etc.
            return response.data;
        } catch (error: any) {
            // Este bloco 'catch' só será ativado se o interceptor de resposta rejeitar a Promise
            // ou se houver um erro antes mesmo da requisição ser enviada (ex: erro de rede).
            // O interceptor já exibe os alerts para erros HTTP.
            // Aqui, você pode fazer um tratamento adicional, como:
            // - Lançar um erro customizado para o componente chamar (se não quiser depender do Alert do interceptor)
            // - Lidar com erros de rede que o interceptor de resposta não pegaria (ex: se o servidor estiver offline)
            if (axios.isAxiosError(error) && !error.response) { // erros sem response(rede/timeout)
                console.error("Erro de rede ou conexão com o servidor: ", error.message);
                return error.message
                // Alert.alert('Problema de Conexão', 'Não foi possível conectar ao servidor. Verifique sua internet.');
            }
            // Re-throw o erro para que o componente que chamou a função possa lidar com ele, se necessário.
            throw error;
        }
    },

    //refatorado
    /*async Cadastro(dados: registerInterface) {

        try{
            const response = await authInstance.post('/cadastro', {
                user: dados.user,
                email: dados.email,
                senha: dados.senha,
                confirmarSenha: dados.confirmarSenha,
            });
            //console.log(response.data);
            if (response.data.success) {
                console.log("Usuário registrado!", response.data);
                
                return true
            }
            //await criarUsuario('João', 'joao@example.com');
            //const data = await getUsuarios();
            //console.log(data.data);
            //setUsuarios(data);
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                const status = error.response.status;
                const mensagem = error.response?.data?.erro ?? 'Erro desconhecido.';

                if (status === 400) {
                    console.warn('Dados inválidos: ', mensagem);
                    return false
                } else {
                    console.warn('Erro inesperado. Tente novamente.');
                    return false
                }
            } else {
            console.error('Erro de rede ou desconhecido.', error.message);
            return false
            }
        }

    },*/

    async Login(dados: loginInterface): Promise<any> {
        try {
            // A requisição é feita. Se for bem-sucedida, o interceptor de resposta já salvou os tokens.
            // Se houver um erro HTTP (400, 401, etc.), o interceptor já cuidou do Alert.alert.
            const response = await authInstance.post('/login', {
                email: dados.email,
                password: dados.password,
            });
            
            // Se a requisição chegou até aqui, significa que foi bem-sucedida (status 2xx).
            // O interceptor já tratou o salvamento do token e o log de "Autenticado com sucesso!".
            // Você pode retornar os dados da resposta, que podem incluir o accessToken, um ID de usuário, etc.
            return response.data;
        } catch (error: any) {
            // Este bloco 'catch' só será ativado se o interceptor de resposta rejeitar a Promise
            // ou se houver um erro antes mesmo da requisição ser enviada (ex: erro de rede).
            // O interceptor já exibe os alerts para erros HTTP.
            // Aqui, você pode fazer um tratamento adicional, como:
            // - Lançar um erro customizado para o componente chamar (se não quiser depender do Alert do interceptor)
            // - Lidar com erros de rede que o interceptor de resposta não pegaria (ex: se o servidor estiver offline)
            if (axios.isAxiosError(error) && !error.response) { // erros sem response(rede/timeout)
                console.error("Erro de rede ou conexão com o servidor: ", error.message);
                // Alert.alert('Problema de Conexão', 'Não foi possível conectar ao servidor. Verifique sua internet.');
            }
            // Re-throw o erro para que o componente que chamou a função possa lidar com ele, se necessário.
            throw error;
        }
    },

    //refatorado
    /*async Login(dados: loginInterface) {
        const teste = dados;
        //console.log(dados);
        try {
        const response = await authInstance.post('/login', {
            email: dados.email,
            password: dados.password,
        })
        //console.log(response);
        return response.data
        if (response.status === 200) {
            console.log('Autenticado com sucesso!');
            return true
        }
        } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            const status = error.response.status;
            const mensagem = error.response?.data?.erro ?? 'Erro desconhecido';

            if (status === 400) {
                console.warn('Erro de validação: ', mensagem);
                Alert.alert(mensagem);
            } else if (status === 401) {
                Alert.alert('Credenciais inválidas.');
            } else {
                Alert.alert('Erro inesperado. Tente novamente,');
            }
        } else {
            console.error('Erro de rede ou desconhecido.', error.message)
        }
        }
    },*/

    async ReenvioEmailConfirmacao() {
        try {
            const token = await TokenStorage.getToken("myAccessToken");
            //console.log(token);
            //const response = await authInstance.post('/reenvio-email-confirmacao', null);
            const response = await defaultInstance.post('/auth/reenvio-email-confirmacao', null, { 
                // O segundo argumento é null porque você não está enviando um corpo de requisição
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            //console.log(response);
            //await AsyncService.InsertStatusEmail(true);
            return true;
        } catch (error) {
            console.log(error);
            return false
        }
    },

    async Logout() {
        //envia requisição de logout para o backend(pendente)
        try {

            const token = await TokenStorage.getToken("myAccessToken");
            //console.log(token);
            const response = await defaultInstance.post('/auth/logout', null, { 
                // O segundo argumento é null porque você não está enviando um corpo de requisição
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            await TokenStorage.clearTokens();
            await AsyncService.ClearData();
            //console.log(response);
            return response
        } catch (error) {
            console.log(error);
            return false
        }
        
        //busca o refreshtoken do dispositivo antes de fazer a requisição
        //const token = await TokenStorage.getTokens();
        //await api.post('/logout', { refreshToken: token.refresh_token });
        
        //limpa os dados sensiveis no keychain do dispositivo
        //await TokenStorage.clearTokens();
    },

    async RefreshTokens() {
        //busca o refresh token atual do dispositivo
        const refreshToken = await TokenStorage.getToken("myRefreshToken");
        //console.log(refreshToken);
        //const refreshToken = await TokenStorage.getRefreshToken(); // obsoleto
        //valida se ele existe
        if(!refreshToken) {
            //retorna erro caso não exista
            console.error("Não há um refresh token disponível. Redirecionando para o login...");
            return false;
        }

        try {
            const statusEmail = await AsyncService.getStatusEmail();
            //faz a requisição a api de renovação de token
            console.log("enviando requisição...")
            const response = await authInstance.post('/refresh-token', { refreshToken, statusEmail });
            console.log(response);
            //se a requisição chegar até aqui, foi bem sucedida
            return true;

        } catch (error: any) {
            // Este bloco 'catch' só será ativado se:
            // 1. O interceptor de resposta rejeitar a Promise (ex: 401 invalidando o refresh token e limpando tudo).
            // 2. Houver um erro de rede antes da requisição ser enviada (não tem error.response).

            if (axios.isAxiosError(error) && !error.response) {
                console.error("Erro de rede ou conexão com o servidor ao tentar renovar o token:", error.message);
                // Alert.alert('Problema de Conexão', 'Não foi possível conectar ao servidor. Verifique sua internet.');
            } else {
                // Erro já tratado pelo interceptor (ex: 401 Refresh Token inválido/expirado)
                console.warn("Falha na renovação do token via API. Mais detalhes no interceptor.", error);
            }
            // Retorna false, indicando que o refresh falhou e o usuário provavelmente precisa fazer login novamente.
            return false;
        }
    },

}
