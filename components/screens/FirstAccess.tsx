import React, { useCallback, useRef, useState } from 'react';
import { View, Text, Button, TextInput, TouchableWithoutFeedback, Keyboard, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp }  from './RootStack';
import { Button as NavButton} from "@react-navigation/elements"
import DatePicker from 'react-native-date-picker';
import { MaskedTextInput } from 'react-native-advanced-input-mask';
import { DataService } from '../data/DataService';
import { AsyncService } from '../data/AsyncService';

const dismissKeyboard = () =>{
    Keyboard.dismiss();
}

function FirstAccessScreen(){

    const [step, setStep] = useState(1);

    const [nome, setNome] = useState<string>("");

    const handleStep = async () => {
        const newStep = (step === 5 ? step : step+1);
        //console.log(step)
        if (step === 5) {
            //Lógica para submeter
            const userData = {
                nome: nome,
                sexo: sexo,
                data_nascimento: date.toLocaleDateString('pt-BR'),
                altura: Number(alturaTeste.replace(/[m.]/g, "")),
                peso: Number(pesoTeste.replace("kg", "")),
            }
            console.log(userData);
            await AsyncService.InsertData(userData);
            const response = await DataService.SendData(userData);
            navigation.navigate("AuthLoading");
            
        }
        setStep(newStep);
    }

    function handleStepMinus(){
        const newStep = (step === 1 ? step : step-1);
        console.log(newStep);
        setStep(newStep);
    }


    const [sexo, setSexo] = useState<'M' | 'F'>('M');
    const toggleSexo = () => {
        setSexo(prev => (prev === 'M' ? 'F' : 'M'));
    };

    const [date, setDate] = useState(new Date());

    const [pesoTeste, setPesoTeste] = useState<any>("")

    const onChangePesoTeste = useCallback((formatted: string, extracted: string) => {
        setPesoTeste(formatted);
    }, []);

    const [alturaTeste, setAlturaTeste] = useState<any>("")

    const onChangeAlturaTeste = useCallback((formatted: string, extracted: string) => {

        setAlturaTeste(formatted);
    }, []);

    //recebe os parametros do NavigationProp do arquivo RootStack
    const navigation = useNavigation<NavigationProp>();
    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "grey"}}>
                

                {step === 1 && (
                    <>
                        <Text>Insira seu nome</Text>
                        <TextInput
                            value={nome}
                            onChangeText={setNome}
                            maxLength={50}
                            //onFocus={()=>handleFocus(idade, textInputRef3)}
                            keyboardType='default'
                            placeholder='Nome'
                            selection={{start: nome.length, end: -1}}
                        ></TextInput>
                    </>
                )}
                {step === 2 && (
                    <>
                        <Text>Selecione seu sexo</Text>
                        <View style={{ flexDirection: 'row'}}>
                            <Text style={{color: sexo === 'M' ? 'blue' : ""}}>Masculino</Text>
                            <Switch
                                trackColor={{false: '#767577', true: '#767577'}}
                                thumbColor={'#f4f3f4'}
                                onValueChange={toggleSexo}
                                value={sexo === 'F'}
                            ></Switch>
                            <Text style={{color: sexo === 'F' ? 'pink' : ""}}>Feminino</Text>
                        </View>
                    </>
                )}
                {step === 3 && (
                    <>
                        <Text>Insira sua Altura</Text>

                        <MaskedTextInput
                            style={{backgroundColor: "black"}}
                            autoSkip={true}
                            autocomplete={true}
                            mask="[9].[00] m"
                            placeholder='Altura'
                            keyboardType='number-pad'
                            value={alturaTeste}
                            onChangeText={onChangeAlturaTeste}
                        ></MaskedTextInput>
                    </>
                )}
                {step === 4 && (
                    <>
                        <Text>Insira seu peso(kg)</Text>

                        <MaskedTextInput
                            style={{backgroundColor: "black"}}
                            autoSkip={true}
                            autocomplete={true}
                            mask="[900].[00] kg"
                            placeholder='Peso'
                            keyboardType='number-pad'
                            value={pesoTeste}
                            onChangeText={onChangePesoTeste}
                        ></MaskedTextInput>
                    </>
                )}
                {step === 5 && (
                    <>
                        <Text>Data de nascimento:</Text>
                        <View>
                            <DatePicker 
                                minimumDate={new Date("1900-01-01")}
                                maximumDate={new Date()}
                                mode="date" 
                                locale='pt-br' 
                                date={date} 
                                onDateChange={setDate}
                            ></DatePicker>
                        </View>
                        
                    </>
                )}
                <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
                    {step >= 2 && // condicional para remover o "voltar" do primeiro input
                    <View style={{paddingRight: 10}}>
                        <Button title="Voltar"
                            onPress={handleStepMinus}
                        ></Button>
                    </View>}
                    {step === 5 && //condicional para renderizar o submeter
                        <Button title="Submeter"
                            onPress={handleStep}
                        ></Button> ||
                        <Button title="Avançar"
                            onPress={handleStep}
                    ></Button>
                    }
                    
                </View>
            </View>
        </TouchableWithoutFeedback>
        
    );
};

export default FirstAccessScreen;