import AsyncStorage from '@react-native-async-storage/async-storage';
import { userDataInterface } from './DataTypes';


export const AsyncService = {
    //insira as funções dentro desse objeto
    //pendente: enviar/receber dados do banco****************
    
    async ClearData(){
        try {
            await AsyncStorage.clear();
            console.log("ASYNC STORAGE RESETADO");
        } catch (error) {
            console.log(error);
        }
    },

    async GetData(){
        try {
            const data = await AsyncStorage.getItem('dadosUsuario');
            //console.log(data);
            if (data){
                //dados existem, retorna true ou os dados?
                //console.log(JSON.parse(data));
                const parseData = JSON.parse(data);
                return parseData
            } else {
                //não foi encontrado dados do usuário
                console.log("Não encontramos dados...", "Redirecionando para configuração de primeiro acesso.");
                return false
            }
        } catch (e) {
            //erro lendo os valores
            console.log('Não foi possível recuperar os dados?')
            return false
        }
    },

    async CheckData(){
        try {
            const data = await AsyncStorage.getItem('dadosUsuario');
            //console.log(data);
            if (data){
                //dados existem, retorna true ou os dados?
                //console.log(JSON.parse(data));
                return true
            } else {
                //não foi encontrado dados do usuário
                console.log("Não encontramos dados...", "Redirecionando para configuração de primeiro acesso.");
                return false
            }
        } catch (e) {
            //erro lendo os valores
            console.log('Não foi possível verificar os dados?')
            return false
        }
    },

    async InsertData(data: userDataInterface){
        try {
            const parseData = JSON.stringify(data);
            await AsyncStorage.setItem('dadosUsuario', parseData);
        } catch (e) {
            console.log("não foi possivel salvar os dados", e);
        }
    },

    async InsertStatusEmail(status: boolean){
        try {
            const parseData = JSON.stringify(status);
            await AsyncStorage.setItem('statusEmail', parseData);
        } catch (e) {
            console.log("não foi possivel salvar o status de confirmação do email", e);
        }
    },

    async getStatusEmail(): Promise<boolean> {
    try {
        const status = await AsyncStorage.getItem('statusEmail');

        // Se a chave não existir, retorna false por padrão.
        if (status === null) {
            console.log("Nenhum status de e-mail encontrado no armazenamento local.");
            return false;
        }

        // Tenta converter a string para um booleano.
        const parsedStatus = JSON.parse(status);

        // Garante que o valor lido é, de fato, um booleano.
        if (typeof parsedStatus === 'boolean') {
            return parsedStatus;
        } else {
            // Se o valor não for um booleano (um erro de salvamento), retorna false.
            console.warn(`Valor em 'statusEmail' não é um booleano. Valor lido: ${status}`);
            return false;
        }

    } catch (e) {
        // Captura erros de leitura ou de JSON.parse.
        console.error("Não foi possível recuperar o status de confirmação do e-mail:", e);
        // Em caso de erro, assume que o e-mail não foi confirmado por segurança.
        return false;
    }
}

}