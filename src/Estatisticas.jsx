import Footer from "./Footer"
import Header from "./Header"
import React, { useState, useEffect } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
import DonutChart from './components/DonutChart.jsx';


function Estatisticas(){

    const [exercises, setExercises] = useState([]);
    const [series, setSeries] = useState([]);
    const [loads, setNewLoads] = useState([]);

    const [gastos, setGastos] = useState([]);

    const [altura, setAltura] = useState(0);
    const [peso, setPeso] = useState(0);
    const [idade, setIdade] = useState(0);
    const [sexo, setSexo] = useState("male");

    const [gastoBasal, setGastoBasal] = useState(0);
    const [gastoTotal, setGastoTotal] = useState(0);

    const [donutName, setDonutName] = useState([]);
    const [donutCal, setDonutCal] = useState([]);

    const x_min = 10;
    const x_max = 200;
    const min_met = 3;
    const max_met = 6;
    //var sexo = "male"


    useEffect(() => {
        handleBuscarDados();
    }, []);

    useEffect(() => {
        handleDonutGraph();
    }, [gastoBasal, gastos, exercises]);

    useEffect(() => {
        handleCalcularGasto();
    }, [exercises, peso, series, loads]);

    useEffect(() => {
        handleGastoTotal();
    }, [gastos]);

    useEffect(() => {
        handleGastoBasal();
    }, [peso, altura, idade, sexo]);

    const handleCalcularGasto = async() => {
        //mapeia a nova array para realizar o cálculo
        const newgastos = [...gastos];
        exercises.map((exercise, index) =>{
            //calcula o MET do exercício
            var calcMet = min_met + (loads[index] - x_min) * (max_met-min_met) / (x_max-x_min);
            //calcula o gasto individual do exercício
            var gastoExercicio = calcMet * peso * series[index] / 30;
            newgastos[index] = Number(gastoExercicio.toFixed(0));
            setGastos(newgastos);
        });
        //calcula o Metabolic Equivalent of Task
        //var calcMet = min_met + (loads[index] - x_min) * (max_met-min_met) / (x_max-x_min);
        //calcula a média gasta no exercício específico
        //var gastoExercicio = calcMet * peso * series[index] / 30;
        //remove as casas decimais e retorna o valor
        //return gastoExercicio.toFixed(0);
    }

    const handleDonutGraph = async () => {
        setDonutName(["Gasto calórico basal", ...exercises]);
        setDonutCal([Number(gastoBasal), ...gastos]);
    }

    const handleGastoTotal = async() => {
        //reduce itera sobre a array somando todos os valores para excs
        const excs = gastos.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
        //soma os exercícios indivuduais com o gasto basal
        const total = Number(excs) + Number(gastoBasal);
        setGastoTotal(total);
    }

    const handleBuscarDados = async () => {
        try {
            const loadExercises = await AsyncStorage.getItem("@exercises");
            const loadSeries = await AsyncStorage.getItem("@series");
            const loadLoads = await AsyncStorage.getItem("@loads");
            const loadAltura = await AsyncStorage.getItem("@altura");
            const loadPeso = await AsyncStorage.getItem("@peso");
            const loadIdade = await AsyncStorage.getItem("@idade");
            const loadSexo = await AsyncStorage.getItem("@sexo");
        
            if (loadExercises !== null && loadSeries !== null && loadLoads !== null){
                const parsedExercises = JSON.parse(loadExercises);
                const parsedSeries = JSON.parse(loadSeries);
                const parsedLoads = JSON.parse(loadLoads);
                const parsedAltura = JSON.parse(loadAltura);
                const parsedPeso = JSON.parse(loadPeso);
                const parsedIdade = JSON.parse(loadIdade);
                const parsedSexo = JSON.parse(loadSexo);
                setExercises(parsedExercises);
                setSeries(parsedSeries);
                setNewLoads(parsedLoads);
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


    function handleInputChange(event){
        //desconstrói o elemento event.target e atribui os valores correspondentes a name e value
        const {name, value} = event.target;

        //constroi os setters utilizando chaves/atributos (altura/setAltura)
        const setters = {
            altura: setAltura,
            peso: setPeso,
            idade: setIdade,
        };

        //atribui a função correspondente a variável setter, no caso setters[name] = setters[altura] = setAltura
        const setter = setters[name];

        //valida se (setter) é uma função válida antes de executá-la em seguida
        if (setter) setter(value);
    }

    const handleGastoBasal = async () => {
        //var sexo = document.getElementById("mySelect");

        if (sexo === "male"){
            var gasto = (13.75*peso)+(5*altura)-(6.76*idade)+66.5;
            setGastoBasal(gasto.toFixed(0));
            //return gasto.toFixed(0);
        }
        else if (sexo === "female"){
            var gasto = (9.56*peso)+(1.85*altura)-(4.68*idade)+665;
            setGastoBasal(gasto.toFixed(0));
            //return gasto.toFixed(0);
        }

    }




    function handleSexoChange(event){
        console.log(event.target.value);
        setSexo(event.target.value);
    }

    return(
        <>
        <Header></Header>
        <h1>Estatisticas</h1>

        <h2>Seu gasto calórico total hoje é de: {gastoTotal}Kcal</h2>

        <h2>Você gastou {gastoTotal-gastoBasal}Kcal em exercícios!</h2>
        <h3>Clique em um item para filtrá-lo</h3>
        <DonutChart gastos={donutCal} labels={donutName}></DonutChart>

        
        <Footer></Footer>
        </>
        
    )
}
export default Estatisticas