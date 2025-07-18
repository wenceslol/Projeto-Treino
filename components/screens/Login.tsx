import React from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp }  from './RootStack';
import { useState } from 'react';
import { AuthHelpers } from '../utils/AuthHelpers';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useRef } from 'react';



function LoginScreen(){
    //recebe os parametros do NavigationProp do arquivo RootStack
    const navigation = useNavigation<NavigationProp>();

    const [email, setemail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [toggleShowPassword, setToggleShowPassword] = useState<boolean>(true);

    const handleLoginButton = async () => {
        const response = await AuthHelpers.handleLogin({email, password});
        if (response) {
            navigation.replace("AuthLoading");
        }
    }

    const passwordInputRef = useRef<TextInput | null>(null);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.mainContainer}>
            <View style={styles.loginBox}>
                <Text style={styles.title}>Login</Text>

                <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    onChangeText={setemail}
                    keyboardType="default"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Email"
                    placeholderTextColor="#ccc"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                />
                </View>

                <View style={styles.inputWrapper}>
                <View style={styles.passwordInputContainer}>
                    <TextInput
                    ref={passwordInputRef}
                    style={[styles.input, { borderWidth: 0, flex: 1 }]}
                    secureTextEntry={toggleShowPassword}
                    onChangeText={setPassword}
                    placeholder="Senha"
                    placeholderTextColor="#ccc"
                    returnKeyType="done"
                    onSubmitEditing={handleLoginButton}
                    />
                    <TouchableOpacity
                    onPress={() => setToggleShowPassword(!toggleShowPassword)}
                    style={{ paddingHorizontal: 10 }}
                    >
                    <Icon name={toggleShowPassword? 'eye-off-outline' : "eye-outline"} size={30} color='#d3d6db'></Icon>
                    
                    </TouchableOpacity>
                </View>
                </View>

                <View style={styles.buttonContainer}>
                <TouchableOpacity style={{...styles.button, backgroundColor: '#be3144'}} onPress={handleLoginButton}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.replace("Registro")}
                >
                    <Text style={styles.buttonText}>Registro</Text>
                </TouchableOpacity>
                </View>
            </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d3d6db",
    padding: 30,
  },
  loginBox: {
    padding: 20,
    backgroundColor: "#303841",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#3a4750",
    width: "100%",
    maxWidth: 400,
  },
  title: {
    color: "#d3d6db",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: "#d3d6db",
    color: "#fff",
    backgroundColor: "#3a4750",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 15,
    borderColor: "#d3d6db",
    backgroundColor: "#3a4750",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#5c6770",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#d3d6db",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;