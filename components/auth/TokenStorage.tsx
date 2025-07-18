import * as Keychain from 'react-native-keychain';
 
// arquivo destinado as funções de gerenciamento de Tokens no Keychain nativo do dispositivo

//funções declaradas como objeto TokenStorage
export const TokenStorage = {
    
    async saveToken(tokenType: "myAccessToken" | "myRefreshToken", token: string){
        try {
            await Keychain.setGenericPassword(tokenType, token, {service: tokenType});
            //console.log(tokenType, " Salvo!");
        } catch (error) {
            console.log("Erro ao salvar token: ", error);
        }
    },

    async getToken(tokenType: "myAccessToken" | "myRefreshToken") {
        try {
            const credentials = await Keychain.getGenericPassword({ service: tokenType })
            if (credentials) {
                return credentials ? credentials.password : {};
            } else {
                console.log("Nenhum token encontrado");
                return null
            }
            
        } catch (error) {
            console.log("Erro ao recuperar token: ", error);
            return null
        }
    },

    //função deve ser chamada ao fazer logout, para limpar os tokens armazenados no app
    async clearTokens() {
        try {
            await Keychain.resetGenericPassword({ service: 'myAccessToken' });//limpa os tokens
            await Keychain.resetGenericPassword({ service: 'myRefreshToken' });
            //await Keychain.resetGenericPassword({ service: 'projetoTreino_access'});
            //await Keychain.resetGenericPassword({ service: 'projetoTreino_refresh'}); //limpa todos os dados sensiveis armazenados
            console.log("tokens removidos");
        } catch (error) {
            console.error('erro ao limpar tokens', error);
        }
    },

};