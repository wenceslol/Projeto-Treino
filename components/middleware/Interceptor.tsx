import axios from "axios";
import { TokenStorage } from "../auth/TokenStorage";
import { Alert } from "react-native";
import { AuthService } from "../auth/AuthService";
import { AsyncService } from "../data/AsyncService";
import env from '../../env'


//Referenciando URL do backend do .env
export const API_BASE_URL = env.BASE_URL;
console.log(API_BASE_URL)

export const apiInstance = axios.create({
    baseURL: `${API_BASE_URL}/api`, // base url inclui /api
    timeout: 5000,
});

export const authInstance = axios.create({
    baseURL: `${API_BASE_URL}/auth`,
    timeout: 5000,
});

export const defaultInstance = axios.create({
  baseURL: API_BASE_URL, // Substitua pelo endereço do backend
  timeout: 5000,
});



defaultInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        console.log(`Requisição recusada com erro ${error.status}:`, error.message);
    }
)

// interceptor de requisição para apiinstance (adiciona access token)
apiInstance.interceptors.request.use(async (config) => {
    console.log("Enviando requisição...")
    const token = await TokenStorage.getToken("myAccessToken");
    //console.log(token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// interceptor de resposta para apiinstance (lida com 401 e renova token)
apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // Se for um erro 401 e não for a requisição de refresh token (se você tiver uma)
        if (error.response?.status === 401 && !error.config._retry) {
            originalRequest._retry = true; // marca que a requisição já foi "retentada"

            try {
                console.warn("Token expirado ou inválido. Tentando renovar tokens...");
                await AuthService.RefreshTokens();

                const newAccessToken = await TokenStorage.getToken("myAccessToken");

                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newAccessToken}`,
                };

                return apiInstance(originalRequest);
            } catch (refreshError) {
                console.error("Falha ao renovar tokens. Redirecionando para o login...", refreshError);

                //await AuthService.Logout();
                return Promise.reject(refreshError);

            }
            //resposta de dados inválidos
        } else if (error.response?.status === 400) {
            //console.log(error.response)
            Alert.alert("Erro:", error.response.data.message)
            return error.response.data
        }
        return Promise.reject(error);
    }
);

//função auxiliar pra verificar os tokens na resposta
const handleAuthReponseSuccess = (response: any) => {
    if (response.data?.accessToken) {
        TokenStorage.saveToken("myAccessToken", response.data.accessToken);
        if (response.data?.refreshToken) {
            TokenStorage.saveToken("myRefreshToken", response.data.refreshToken);
        }
        console.log("Tokens salvos com sucesso.");
    }
    if (response.data?.email_confirmado) {
        AsyncService.InsertStatusEmail(response.data?.email_confirmado);
        console.log("Email confirmado!")
    }
};

//função de interceptação de request, para o AUTHINSTANCE, para enviar accesstoken de validação de sessão

/*authInstance.interceptors.request.use(async (config) => {
    console.log("teste")
    const token = await TokenStorage.getToken("myAccessToken");
    console.log(token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});*/

authInstance.interceptors.response.use(
    (response) => {
        // Supondo que a resposta de login tenha o token em response.data.accessToken
        if (response.config.url === '/login' || response.config.url === '/cadastro' || response.config.url === '/refresh-token' && response.data?.accessToken) {
            //função que renova tokens
            handleAuthReponseSuccess(response);
        }
        return response;
    },
    (error) => {
        //lógica para erros de login/registro
        if (axios.isAxiosError(error) && error.response){
            const status = error.response.status;
            const mensagem = error.response.data?.erro || error.response.data?.message || 'Erro desconhecido'; // Tenta pegar a mensagem de erro de 'erro' ou 'message'

            if (error.config?.url === "/refresh-token") {
                if (status === 400) {
                    console.warn("Erro na requisição de refresh (400): ", mensagem);
                } else if (status === 401) {
                    //refresh token inválido ou expirado
                    console.warn("Refresh token inválido ou expirado. Redirecionando para login...");
                    //limpar tokens e force logout
                    TokenStorage.clearTokens();
                    AuthService.Logout();
                    //navigation.reset({ index: 0, routes: [{ name: "Login" }] });
                    return status
                    //lógica para forçar logout
                } else {
                    console.error("Erro inesperado no refresh token: ", mensagem, error);
                }
            } else {
                //tratamento genérico para outras rotas(login e cadastro)
                if (status === 400) {
                console.warn("Erro de validação (AuthService): ", mensagem);
                Alert.alert("Erro de validação", mensagem);
                } else if (status === 401) {
                    //Para login/cadastro, 401 geralmente significa credenciais inválidas
                    console.warn("Credenciais inválidas.", mensagem)
                    //Alert.alert("Erro de autenticação", "Credenciais inválidas.");
                    return false
                } else if (status >= 500) {
                    console.error("Erro de servidor (AuthService): ", mensagem);
                } else {
                    console.error("Erro inesperado (AuthService): ", mensagem, error);
                    Alert.alert("Erro", "Ocorreu um erro inesperado. Por favor, tente novamente.");
                }
                return false
            }
        } else {
            //Erros não relacionados ao axios (ex: rede offline)
            console.error("Erro de rede ou desconhecido: ", error);
            //const originalRequest = error.config;
            //console.log("Repetindo requisição...")
            //return authInstance(originalRequest);
            //Alert.alert("Erro de conexão", "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.");
            return "Network Error"
        }
        return Promise.reject(error);
    }
);