import axios from 'axios';
import { Alert } from 'react-native';


export const api = axios.create({
  baseURL: 'http://10.0.2.2:3000/api', // Substitua pelo endereço do backend
});

export async function getUsuarios() {
  const response = await api.get('/usuario/cadastro');
  return response.data;
}

interface loginInterface {
  email: string,
  password: string,
}

export async function handleLoginRequest(dados: loginInterface) {
    const teste = dados;
    //console.log(dados);
    try {
      const response = await api.post('/login', {
        email: dados.email,
        password: dados.password,
      })
      console.log(response);
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
    

}

interface registerInterface {
    user: string,
    email: string,
    senha: string,
    confirmarSenha: string,
}

export async function handleCriarUsuario(dados: registerInterface) {

    try{
        await api.post('/usuario/cadastro', {
            user: dados.user,
            email: dados.email,
            senha: dados.senha,
            confirmarSenha: dados.confirmarSenha,
        })
        //await criarUsuario('João', 'joao@example.com');
        //const data = await getUsuarios();
        //console.log(data.data);
        //setUsuarios(data);
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
          const status = error.response.status;
          const mensagem = error.response?.data?.erro ?? 'Erro desconhecido.';

          if (status === 400) {
            console.warn('Erro de validação: ', mensagem);
            Alert.alert(mensagem);
          } else if (status === 401) {
            Alert.alert('Credenciais inválidas.');
          } else {
            Alert.alert('Erro inesperado. Tente novamente.');
          }
        } else {
          console.error('Erro de rede ou desconhecido.', error.message);
        }
    }

};