// AddTrainingScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import TrainingCard from './TrainingCard'; // Importe o componente TrainingCard
import { ObjetoTreino } from '../TreinoTypes';
import { useTreino } from '../TreinoContext';
import { apiInstance } from '../../../middleware/Interceptor';



const TreinoScreen = () => {

  //navigation será realizado pelos cards

  const [treinoNome, setTreinoNome] = useState<string>('');

  const TreinoContext = useTreino();


  const adicionarTreino = async () => {

    const tryposting = async () => {
        try {
          const response = await apiInstance.post('/criar-treino', {nome: treinoNome.trim()});
          //console.log(response.data?.newTreinoId);
          return response.data?.newTreinoId
        } catch (error) {
          console.log("Erro ao criar treino: ", error);
          return false
        }
      }
    

    if(treinoNome.trim().length > 0) {
      const treinoID = await tryposting();
      if (treinoID) {
        const newTreino: ObjetoTreino = {
        //id: String(Date.now()),
        id: treinoID,
        nome: treinoNome.trim(),
        exercicios: [],
      }


      TreinoContext.setTreino(prevTreino => [
        ...prevTreino,
        newTreino,
      ]);
      console.log("Treino criado com sucesso!", newTreino);
      
      setTreinoNome("")
      } else {
        Alert.alert("Já existe um treino com esse nome.");
      }
      
      
    } else {
      Alert.alert("Erro", "Por favor, digite um nome para o treino.");
    }
    
  };


  return (
  <View style={styles.container}>
    <Text style={styles.title}>Adicionar Treino</Text>

    <TextInput
      style={styles.input}
      placeholder="Nome do Treino"
      value={treinoNome}
      onChangeText={setTreinoNome}
      placeholderTextColor="#bbb"
    />

    <TouchableOpacity style={styles.button} onPress={adicionarTreino}>
      <Text style={styles.buttonText}>Adicionar Treino</Text>
    </TouchableOpacity>

    {TreinoContext.treino.length === 0 ? (
      <Text style={styles.noTrainingsText}>Nenhum treino adicionado ainda.</Text>
    ) : (
      <FlatList
        data={TreinoContext.treino}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrainingCard
            treinoId={item.id}
            treinoNome={item.nome}
            exercicios={item.exercicios}
          />
        )}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    )}
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#d3d6db',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#3a4750',
  },
  input: {
    height: 50,
    borderColor: '#3a4750',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: 'black',
  },
  button: {
    backgroundColor: '#be3144',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: '#d3d6db',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    marginTop: 10,
  },
  noTrainingsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
    color: '#3a4750',
  },
});

export default TreinoScreen;