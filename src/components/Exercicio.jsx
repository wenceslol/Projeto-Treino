import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

//await AsyncStorage.clear();
function Exercicio() {

    const [exercises, setExercises] = useState([]);
    const [series, setSeries] = useState([]);
    const [loads, setNewLoads] = useState([]);
    const [newExercise, setNewExercise] = useState([]);

    const [exercicios, setExercicios] = useState([]);

    useEffect(() => {
        handleBuscarDados();
    }, []);

    useEffect(() => {
        handleMigraObj();
    }, [exercises, series, loads]);


    const handleMigraObj = async () =>{
        const newexercicios = exercises.map((nome, i) =>({
            nome,
            series: series[i],
            carga: loads[i],
        }));
        setExercicios(newexercicios);
        console.log("Migração realizada");
    };

    function handleTeste(){
        console.log(exercicios[1].nome);
    }

    const handleBuscarDados = async () => {
        try {
            const loadExercises = await AsyncStorage.getItem("@exercises");
            const loadSeries = await AsyncStorage.getItem("@series");
            const loadLoads = await AsyncStorage.getItem("@loads");
            console.log("Dados carregados com sucesso!");

            if (loadExercises !== null && loadSeries !== null && loadLoads !== null){
                const parsedExercises = JSON.parse(loadExercises);
                const parsedSeries = JSON.parse(loadSeries);
                const parsedLoads = JSON.parse(loadLoads);
                setExercises(parsedExercises);
                setSeries(parsedSeries);
                setNewLoads(parsedLoads);
            }

        } catch (e) {
            console.error("Erro ao carregar dados", e);
        }
    };

    const handleSalvarDados = async (exs, srs, lds) => {
        try {
            await AsyncStorage.setItem("@exercises", JSON.stringify(exs));
            await AsyncStorage.setItem("@series", JSON.stringify(srs));
            await AsyncStorage.setItem("@loads", JSON.stringify(lds));
            console.log("Dados salvos");
        } catch (e) {
            console.error("Erro ao salvar dados", e);
        }
    };

    const handleSalvarSeries = async (srs) => {
        try {
            await AsyncStorage.setItem("@series", JSON.stringify(srs));
            console.log("Dados salvos");
        } catch (e) {
            console.error("Erro ao salvar dados", e);
        }
    };

    const handleSalvarCargas = async (event, index) => {
        try {
            const newLoads = [...loads]
            newLoads[index] = Number(event.target.value);
            await AsyncStorage.setItem("@loads", JSON.stringify(newLoads));
            console.log("Dados salvos");
        } catch (e) {
            console.error("Erro ao salvar dados", e);
        }
    };

    function handleInputChange(event){
        //Quando o usuário interage com o input, ele busca o conteúdo inserido
        setNewExercise(event.target.value);
    }

    function handleLoadChange(event, index){
        //Quando o usuário interage com o input, ele busca o conteúdo inserido
        const newLoads = [...loads]
        let novoValor = event.target.value.replace(/[^0-9]/g, "");
        newLoads[index] = Number(novoValor);
        setNewLoads(newLoads);
    }

    function addExercise(){
        const newExercise = document.getElementById("exerciseInput").value;

        const saveExercises = [...exercises, newExercise];
        //carga e série padrão
        const saveSeries = [...series, 3];
        const saveLoads = [...loads, 10];

        setExercises(saveExercises);
        setSeries(saveSeries);
        setNewLoads(saveLoads);

        setNewExercise("");

        handleSalvarDados(saveExercises, saveSeries, saveLoads);
    }



    function deleteExercise(index){
        
        const saveExercises = exercises.filter((_, i) => i !== index);
        const saveSeries = series.filter((_, i) => i !== index);
        const saveLoads = loads.filter((_, i) => i !== index);

        setExercises(saveExercises);
        setSeries(saveSeries);
        setNewLoads(saveLoads);
        handleSalvarDados(saveExercises, saveSeries, saveLoads);
        //setSeries(series.filter((_, i) => i !== index));
        //o parametro "_" no lugar de "element" significa que o parametro "element", será ignorado
        //setExercises(exercises.filter((_, i) => i !== index));
        //setNewLoads(loads.filter((_, i) => i !== index));
    }

    function handleAddSerie(index){
        
        if(series[index] <= 19){
            const newSerie = [...series];
            newSerie[index] += 1;
            setSeries(newSerie);
            handleSalvarSeries(newSerie);
        }
        
    }

    function handleRemoveSerie(index){
        
        if(series[index] >=2){
            const newSerie = [...series];
            newSerie[index] -= 1;
            setSeries(newSerie);
            handleSalvarSeries(newSerie);
        }
        
    }

    function moveExerciseUp(index){
        
    }

    function moveExerciseDown(index){
        
    }

    return(
        <div className="exercise-list">

            <button onClick={handleTeste}>teste</button><br/>
            <input type="text"
                   className="input-exercise"
                   placeholder="Insira o nome do exercício"
                   id="exerciseInput"
                   value={newExercise}
                   onChange={handleInputChange}></input>

            <input type="button" 
                   className="exercise-card-button"
                   value="Adicionar Exercício"
                   onClick={addExercise}
                   ></input>



            {exercises.map((exercise, index) =>
                    <div key={index} className="exercise-card">
                        <div className="exercise-title-div">
                            <h2 className="exercise-title">{exercise}</h2>
                            <input type="button" 
                               className="exercise-title-button"
                               value="Remover" 
                               onClick={() => deleteExercise(index)}></input>
                        </div>
                        

                        <div className="exercise-load-div">
                            <label>Carga: </label>
                            <input type="text" 
                                   className="input-carga"
                                   placeholder="Insira a carga"
                                   onBlur={(event) => handleSalvarCargas(event, index)}
                                   value={loads[index]}
                                   onChange={(event) => handleLoadChange(event, index)}></input>
                            <label>Kgs</label>
                            <br></br>
                        </div>

                        <div className="exercise-series-div">
                            <input type="button" 
                                   className="exercise-card-button"                                   value="Adicionar série"
                                   onClick={() => handleAddSerie(index)}></input>
                            <input type="button" 
                                   className="exercise-card-button"
                                   value="Remover série"
                                   onClick={() => handleRemoveSerie(index)}></input>

                        </div>

                        <div className="exercise-series-div">
                            <label>Séries:</label>

                            {Array.from({length: series[index]}).map((serie, index) =>(
                                    <input key={index+1} type="checkbox"></input>
                                    
                            ))}
                        </div>
                        
                        
                        {/*
                        <details>
                            <summary>Alterar Cargas</summary>
                                {No .map abaixo, o index do filho é passado como childIndex, para preservar o index do pai}
                                {Array.from({length: series[index]}).map((_, childIndex) =>(
                                    <div key={childIndex}>
                                        
                                        <label>Série {childIndex+1}:</label>
                                        <input type="text"
                                               id={childIndex}
                                               value={loads[index]}
                                               onfocusout={handleLoadChange}></input>
                                        <label>Kgs</label>
                                        <br></br>
                                    </div>
                                
                                ))}
                        </details>
                        */}

                    </div>
                )}

        </div>
    );
}

export default Exercicio