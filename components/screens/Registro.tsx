import React, { useState } from 'react';
import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthService } from '../auth/AuthService';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp }  from './RootStack';
import { AuthHelpers } from '../utils/AuthHelpers';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useRef } from 'react';

function RegistroScreen(){

    const navigation = useNavigation<NavigationProp>();

    const criarUser = async () => {
        const dadosRegistro = {
            user: user,
            email: email,
            senha: senha,
            confirmarSenha: confirmarSenha,
        }

        const response = await AuthService.Cadastro(dadosRegistro);
        if (response.success === true) {
            await AuthHelpers.handleLogin({email: email, password: senha});
            navigation.replace("AuthLoading");
        }

    }

    const dismissKeyboard = () =>{
        Keyboard.dismiss();
    }

    function validaUser(user: string) {
        const minLength = 3;
        const maxLength = 20;
        //filtro de username sem espaço e sem caracteres especial no início
        const usernameRegex = /^[\p{L}\p{N}]+([._-]?[\p{L}\p{N}]+)*$/u;
        if ( user.length < maxLength && user.length > minLength ) {
            setIsValidUser(usernameRegex.test(user));
        } else {
            setIsValidUser(false);
        }
    }

    function validaEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        //Regex para validar o input
        setIsValidEmail(emailRegex.test(email));
    }

    function validaSenha(senha: string) {
        const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,32}$/;
        //Regex para validar o input
        setIsValidSenha(senhaRegex.test(senha));
    }

    const [user, setUser] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [senha, setSenha] = useState<string>("");
    const [confirmarSenha, setConfirmarSenha] = useState<string>("");

    const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
    const [isValidUser, setIsValidUser] = useState<boolean>(true);
    const [isValidSenha, setIsValidSenha] = useState<boolean>(true);

    const [toggleShowPassword, setToggleShowPassword] = useState<boolean>(true);
    const [toggleShowConfirmPassword, setToggleShowConfirmPassword] = useState<boolean>(true);

    const emailInputRef = useRef<TextInput | null>(null);
    const passwordInputRef = useRef<TextInput | null>(null);
    const confirmPasswordInputRef = useRef<TextInput | null>(null);

return (
  <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nome de usuário:</Text>
        <View style={styles.passwordInputContainer}>
            <TextInput
            style={styles.input}
            placeholder="Digite seu nome de usuário"
            placeholderTextColor="#aaa"
            onChangeText={setUser}
            value={user}
            onBlur={() => validaUser(user)}
            onFocus={() => setIsValidUser(true)}
            returnKeyType="next"
            onSubmitEditing={() => emailInputRef.current?.focus()}
            />
        </View>
        
        {!isValidUser && (
          <Text style={styles.errorText}>
            Insira um nome de usuário válido!{'\n'}
            • Deve conter entre 4 a 20 caracteres{'\n'}
            • Sem espaços ou início com caractere especial
          </Text>
        )}

        <Text style={styles.label}>Email:</Text>
        <View style={styles.passwordInputContainer}>
            <TextInput
            ref={emailInputRef}
            style={styles.input}
            placeholder="Digite seu email"
            placeholderTextColor="#aaa"
            onChangeText={setEmail}
            value={email}
            onBlur={() => validaEmail(email)}
            onFocus={() => setIsValidEmail(true)}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            />
        </View>
        
        {!isValidEmail && <Text style={styles.errorText}>Insira um email válido!</Text>}

        <Text style={styles.label}>Senha:</Text>

        <View style={styles.passwordInputContainer}>
            <TextInput
            ref={passwordInputRef}
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#aaa"
            secureTextEntry={toggleShowPassword}
            onChangeText={setSenha}
            value={senha}
            onBlur={() => validaSenha(senha)}
            onFocus={() => setIsValidSenha(true)}
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
            />
            <TouchableOpacity onPress={() => setToggleShowPassword(!toggleShowPassword)}>
                <Icon name={toggleShowPassword? 'eye-off-outline' : "eye-outline"} size={30} color='#d3d6db'></Icon>
            </TouchableOpacity>
        </View>
        
        {!isValidSenha && (
          <Text style={styles.errorText}>
            A senha deve conter entre 8 a 32 caracteres, incluindo letra, número e caractere especial.
          </Text>
        )}

        <Text style={styles.label}>Confirmar Senha:</Text>
        <View style={styles.passwordInputContainer}>
            <TextInput
                ref={confirmPasswordInputRef}
                style={styles.input}
                placeholder="Confirme sua senha"
                placeholderTextColor="#aaa"
                secureTextEntry={toggleShowConfirmPassword}
                onChangeText={setConfirmarSenha}
                value={confirmarSenha}
                returnKeyType="done"
                onSubmitEditing={criarUser}
            />
            <TouchableOpacity onPress={() => setToggleShowConfirmPassword(!toggleShowConfirmPassword)}>
                <Icon name={toggleShowConfirmPassword? 'eye-off-outline' : "eye-outline"} size={30} color='#d3d6db'></Icon>
            </TouchableOpacity>
        </View>
        
        

        {senha !== confirmarSenha && (
          <Text style={styles.errorText}>As senhas não coincidem.</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={criarUser}>
          <Text style={styles.buttonText}>Criar Usuário</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text style={styles.linkText}>Voltar para Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableWithoutFeedback>
);
};

const styles = StyleSheet.create({
  passwordInputContainer: {
  backgroundColor: '#3a4750',
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 8,
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
},
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#d3d6db',
    paddingHorizontal: 24,
  },
  form: {
    backgroundColor: '#303841',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
  flex: 1,
  fontSize: 16,
  color: '#fff',
},
  errorText: {
    color: '#e15759',
    marginBottom: 12,
    fontSize: 13,
  },
  button: {
    backgroundColor: '#be3144',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#be3144',
    fontWeight: '500',
  },
});

export default RegistroScreen;