import { loginInterface } from "../auth/InterfaceTypes";
import { AuthService } from "../auth/AuthService";
import { TokenStorage } from "../auth/TokenStorage";
import { AsyncService } from "../data/AsyncService";
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from "../screens/RootStack";

//REFATORADO

export const AuthHelpers = {

    async handleLogout(){
        await AuthService.Logout();
    },

    async handleLogin({email, password }: loginInterface) {
        const dadosLogin = {
            email: email,
            password: password,
        }

        //Requisição de login
        const auth = await AuthService.Login(dadosLogin)
        
        if (auth.success) {
            //Valida email
            if (auth.email_confirmado){
            await AsyncService.InsertStatusEmail(auth.email_confirmado);
        }
            //Salva tokens
            await TokenStorage.saveToken("myAccessToken", auth.accessToken);
            await TokenStorage.saveToken("myRefreshToken", auth.refreshToken);
            return true
        } else return false
    }

}
