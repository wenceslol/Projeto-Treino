import Footer from "./Footer"
import Header from "./Header"
import React, { useState, useEffect } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';


function Profile(){

    const [altura, setAltura] = useState(0);
    const [peso, setPeso] = useState(0);
    const [idade, setIdade] = useState(0);
    const [sexo, setSexo] = useState("male");
    const [status, setStatus] = useState(true);

    const [userdata, setUserData] = useState([]);

    useEffect(() => {
        handleBuscarDados();
    }, []);

    useEffect(() => {
        handleMigraUsr();
    }, [altura, peso, idade]);


    const handleMigraUsr = async () =>{

        const newUser = {
            altura : altura,
            peso : peso,
            idade : idade,
        }
        setUserData(newUser);
        console.log("Migração realizada");
    };

    function testeUser(){
        console.log(userdata);
    }



    const handleBuscarDados = async () => {
        try {
            const loadAltura = await AsyncStorage.getItem("@altura");
            const loadPeso = await AsyncStorage.getItem("@peso");
            const loadIdade = await AsyncStorage.getItem("@idade");
            const loadSexo = await AsyncStorage.getItem("@sexo");
        
            if (loadAltura !== null && loadPeso !== null && loadIdade !== null && loadSexo !== null){
                const parsedAltura = JSON.parse(loadAltura);
                const parsedPeso = JSON.parse(loadPeso);
                const parsedIdade = JSON.parse(loadIdade);
                const parsedSexo = JSON.parse(loadSexo);
                setAltura(parsedAltura);
                setPeso(parsedPeso);
                setIdade(parsedIdade);
                setSexo(parsedSexo);
                console.log("Dados carregados com sucesso!");
            }

        } catch (e) {
            console.error("Erro ao carregar dados", e);
        }
    };

    const handleSalvarDados = async () => {
        try {
            await AsyncStorage.setItem("@altura", JSON.stringify(altura));
            await AsyncStorage.setItem("@peso", JSON.stringify(peso));
            await AsyncStorage.setItem("@idade", JSON.stringify(idade));
            await AsyncStorage.setItem("@sexo", JSON.stringify(sexo));
            console.log("Dados salvos!")

        } catch (e) {
            console.error("Erro ao carregar dados", e);
        }
    };

    function handleInputChange(event){
        //desconstrói o elemento event.target e atribui os valores correspondentes a name e value
        const {name, value} = event.target;

        //constroi os setters utilizando chaves/atributos (altura/setAltura)
        const setters = {
            altura: setAltura,
            peso: setPeso,
            idade: setIdade,
            sexo: setSexo,
        };

        //atribui a função correspondente a variável setter, no caso setters[name] = setters[altura] = setAltura
        const setter = setters[name];
        //valida se (setter) é uma função válida antes de executá-la em seguida
        if (setter) setter(value);
    }

    function handleEditar(){
        console.log(status);
        setStatus(!status);
    }

    //desabilitado, função ja suportada no handleInputChange
    function handleSexoChange(event){
        console.log(event.target.value);
        setSexo(event.target.value);
    }

    return(
        <>
        <Header />
        <h1>Perfil</h1>

        <button onClick={testeUser}>teste</button>

        <label>Altura: </label>
        <input type="text"
               name="altura"
               disabled={status}
               value={altura}
               placeholder="Sua altura em centímetros"
               maxLength={3}
               onChange={(event) => handleInputChange(event)}
               inputMode="numeric"></input>
        <label>cm</label><br/>

        <label>Peso: </label>
        <input type="text"
               name="peso"
               disabled={status}
               value={peso}
               placeholder="Seu peso em kilogramas"
               maxLength={3}
               onChange={(event) => handleInputChange(event)}
               inputMode="numeric"></input>
        <label>kg</label><br/>

        <label>Idade: </label>
        <input type="text"
               name="idade"
               disabled={status}
               value={idade}
               placeholder="Sua idade"
               maxLength={3}
               onChange={(event) => handleInputChange(event)}
               inputMode="numeric"></input>
        <label>kg</label><br/>

        <label>Sexo: </label>
        <select name="sexo" id="mySelect" value={sexo} disabled={status} onChange={handleInputChange}>
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
        </select><br/>

        <button onClick={handleEditar}>Editar</button>
        <button onClick={handleSalvarDados}>Salvar</button>

        <Footer />
        </>
    )
}
export default Profile