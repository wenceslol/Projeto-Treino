//Arquivo destinado a lidar com ações de leitura/escrita de dados:
// (get/set dados_usuario e verifydata...)

//import { api } from '../../api/ApiRequisicoes';
import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userDataInterface } from './DataTypes';
import { TokenStorage } from '../auth/TokenStorage';
import { apiInstance } from '../middleware/Interceptor';
import { AsyncService } from './AsyncService';



/*const api = axios.create({
  baseURL: 'http://10.0.2.2:3000/api', // Substitua pelo endereço do backend
});*/

export const DataService = {
    //insira as funções dentro desse objeto
    //pendente: enviar/receber dados do banco****************

    async GetData(){
        try {
            const response = await apiInstance.get('/data');
            //converte o data_nascimento para formato Date
            const teste = new Date(response.data.data.data_nascimento);
            //transforma o formato date em string e formatando para DD/MM/YYYY
            response.data.data.data_nascimento = teste.toLocaleDateString('pt-BR');
            //salva os dados formatados no async storage
            await AsyncService.InsertData(response.data.data);
            console.log("Dados recuperados e inseridos no AsyncStorage!");
            return response.data;
        } catch (error) {
            console.log("Erro ao recuperar dados: ", error);
            return false
        }
    },

    async SendData(userData: userDataInterface){
        try {
            const response = await apiInstance.post('/data', userData);
            return response.data;
        } catch (error) {
            console.log('Erro ao enviar dados', error);
            return false
        }
    },
}