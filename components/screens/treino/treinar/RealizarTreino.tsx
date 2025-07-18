import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import TreinoSelectionModal from './RealizarTreinoModal';
import { useTreino } from '../../treino/TreinoContext';
import { ExercicioComDetalhes, TreinoEmAndamento, ObjetoTreino, TipoDeExercicioComDetalhes, CardioComDetalhes } from '../TreinoTypes';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../../../navigation/NavigationTypes';
import { MaskedTextInput } from 'react-native-advanced-input-mask';
import { apiInstance } from '../../../middleware/Interceptor';


const TreinoAndamento: React.FC = () => {

    const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();

  const {
    treino,
  } = useTreino();



  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectTreino = (treinoSelecionado: ObjetoTreino) => {
    iniciarNovoTreino(treinoSelecionado);
    setModalVisible(false);
  };

  

  // Lista de IDs de exercícios que são considerados cardio
  const listaCardio = [
      88, 89, 260, 370, 558, 578, 608, 611, 613, 689, 740, 789, 820, 845,
  ];

  const [treinoEmAndamento, setTreinoEmAndamento] = useState<TreinoEmAndamento | null>(null);

  useEffect(() => {
    if (treino.length === 0) {
        console.log("Não existe treinos!")
      return;
    }
    
    if (treinoEmAndamento) {
      const foundTreino = treino.find(t => t.id === treinoEmAndamento?.id);

      if (foundTreino) {
        console.log("Treino encontrado: ", foundTreino);
        iniciarNovoTreino(foundTreino);
      }
    }

  }, [treino]);




  const iniciarNovoTreino = (treinoSelecionado: ObjetoTreino) => {
    const exerciciosComDetalhes: TipoDeExercicioComDetalhes[] = treinoSelecionado.exercicios.map(ex => {
      const anterior = treinoEmAndamento?.exercicios.find(e => e.id === ex.id);

      // Agora a verificação para inicializar com duração ou detalhes de força usa a listaCardio
      if (listaCardio.includes(ex.id)) {
        return {
          ...ex,
          duracao: (anterior as CardioComDetalhes)?.duracao ?? '30', // Mantém a duração se já existia, senão define um padrão
        } as CardioComDetalhes;
      } else {
        return {
          ...ex,
          carga: (anterior as ExercicioComDetalhes)?.carga ?? '10',
          repeticoes: (anterior as ExercicioComDetalhes)?.repeticoes ?? '8',
          seriesCompletas: (anterior as ExercicioComDetalhes)?.seriesCompletas ?? Array(3).fill(false),
        } as ExercicioComDetalhes;
      }
    });

    setTreinoEmAndamento({
      ...treinoSelecionado,
      exercicios: exerciciosComDetalhes,
    });
  };

  const cancelarTreino = () => {
    setTreinoEmAndamento(null);
    console.log('Treino cancelado!');
  };

  const finalizarTreino = async () => {
    console.log('Treino Finalizado!');
    if (treinoEmAndamento) {
      const dadosParaSalvar = treinoEmAndamento.exercicios.map(ex => {
        // A verificação para salvar dados também usa a listaCardio
        if (listaCardio.includes(ex.id)) {
          return {
            exercicioId: ex.id,
            exercicioNome: ex.exercicioNome,
            duracao: Number((ex as CardioComDetalhes).duracao), // Certifica-se que é CardioComDetalhes
            tipo: 'cardio'
          };
        } else {
          return {
            exercicioId: ex.id,
            exercicioNome: ex.exercicioNome,
            carga: Number((ex as ExercicioComDetalhes).carga),
            repeticoes: Number((ex as ExercicioComDetalhes).repeticoes),
            seriesCompletas: (ex as ExercicioComDetalhes).seriesCompletas.filter(Boolean).length,
            totalSeriesDisponiveis: (ex as ExercicioComDetalhes).seriesCompletas.length,
            tipo: 'forca'
          };
        }
      });
      //const teste = await AsyncService.GetData();
      //const dadosTreino = JSON.stringify(dadosParaSalvar, null, 2);
      const treinoRealizado = {
        treinoId: treinoEmAndamento.id,
        treinoNome: treinoEmAndamento.nome,
        //dadosUsuario: teste,
        exercicios: dadosParaSalvar
      }

      const response = await apiInstance.post('/calorias', {treinoRealizado: treinoRealizado});
      //const response = await apiInstance.post('/treino', treinoRealizado);
      //console.log(response);
      if (response.data.success) {
        setTreinoEmAndamento(null);
      }
    }
    
  };

  const updateExercicioDetalhes = (
    treinoId: string,
    exercicioId: number,
    field: 'carga' | 'repeticoes' | 'duracao',
    value: string
  ) => {
    if (treinoEmAndamento && treinoEmAndamento.id === treinoId) {
      setTreinoEmAndamento(prevTreino => {
        if (!prevTreino) return null;

        const updatedExercicios = prevTreino.exercicios.map(ex => {
          if (ex.id === exercicioId) {
            // Agora a atualização é baseada no field e na listaCardio
            if (listaCardio.includes(ex.id)) {
                return { ...ex, [field]: value } as CardioComDetalhes;
            } else {
                return { ...ex, [field]: value } as ExercicioComDetalhes;
            }
          }
          return ex;
        });
        return { ...prevTreino, exercicios: updatedExercicios };
      });
    }
  };

  const toggleSerieCheckbox = (treinoId: string, exercicioId: number, serieIndex: number) => {
    if (treinoEmAndamento && treinoEmAndamento.id === treinoId) {
      setTreinoEmAndamento(prevTreino => {
        if (!prevTreino) return null;
        const updatedExercicios = prevTreino.exercicios.map(ex => {
          if (ex.id === exercicioId && !listaCardio.includes(ex.id)) { // Verifica se NÃO é cardio
            const newSeriesCompletas = [...(ex as ExercicioComDetalhes).seriesCompletas];
            newSeriesCompletas[serieIndex] = !newSeriesCompletas[serieIndex];
            return { ...ex, seriesCompletas: newSeriesCompletas } as ExercicioComDetalhes;
          }
          return ex;
        });
        return { ...prevTreino, exercicios: updatedExercicios };
      });
    }
  };

  const addSerie = (treinoId: string, exercicioId: number) => {
    if (treinoEmAndamento && treinoEmAndamento.id === treinoId) {
      setTreinoEmAndamento(prevTreino => {
        if (!prevTreino) return null;
        const updatedExercicios = prevTreino.exercicios.map(ex => {
          if (ex.id === exercicioId && !listaCardio.includes(ex.id) && (ex as ExercicioComDetalhes).seriesCompletas.length < 20) {
            return { ...ex, seriesCompletas: [...(ex as ExercicioComDetalhes).seriesCompletas, false] } as ExercicioComDetalhes;
          }
          return ex;
        });
        return { ...prevTreino, exercicios: updatedExercicios };
      });
    }
  };

  const removeSerie = (treinoId: string, exercicioId: number) => {
    if (treinoEmAndamento && treinoEmAndamento.id === treinoId) {
      setTreinoEmAndamento(prevTreino => {
        if (!prevTreino) return null;
        const updatedExercicios = prevTreino.exercicios.map(ex => {
          if (ex.id === exercicioId && !listaCardio.includes(ex.id) && (ex as ExercicioComDetalhes).seriesCompletas.length > 1) {
            const newSeriesCompletas = [...(ex as ExercicioComDetalhes).seriesCompletas];
            newSeriesCompletas.pop();
            return { ...ex, seriesCompletas: newSeriesCompletas } as ExercicioComDetalhes;
          }
          return ex;
        });
        return { ...prevTreino, exercicios: updatedExercicios };
      });
    }
  };

  const handleFinishTreino = () => {
    Alert.alert(
      "Finalizar Treino",
      "Tem certeza que deseja finalizar este treino?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Finalizar",
          onPress: finalizarTreino,
        }
      ]
    );
  };

  const handleCancelTreino = () => {
    Alert.alert(
      "Cancelar Treino",
      "Tem certeza que deseja cancelar este treino? Os dados não serão salvos.",
      [
        {
          text: "Não",
          style: "cancel"
        },
        {
          text: "Sim, Cancelar",
          onPress: cancelarTreino,
          style: 'destructive'
        }
      ]
    );
  };

  const alterarRepeticoes = (id: number, delta: number) => {
    // Busca o exercício e verifica se é de força antes de tentar alterar as repetições
    const exercicio = treinoEmAndamento!.exercicios.find(e => e.id === id);
    if (!exercicio || listaCardio.includes(exercicio.id)) return; // Não faz nada se for cardio

    const atual = parseInt((exercicio as ExercicioComDetalhes).repeticoes || '0') || 0;
    const novasReps = Math.max(1, Math.min(20, atual + delta));

    updateExercicioDetalhes(treinoEmAndamento!.id, id, 'repeticoes', String(novasReps));
  };


  const renderExercicioInput = (exercicio: TipoDeExercicioComDetalhes) => (
  <View key={exercicio.id} style={styles.card}>
    <Text style={styles.exerciseName}>{exercicio.exercicioNome}</Text>
    {listaCardio.includes(exercicio.id) ? (
      <>
        <View style={styles.row}>
          <Text style={styles.label}>Duração (min):</Text>
          <TextInput
            style={[styles.input, { width: 'auto', flex: 1 }]}
            placeholder="Duração (min)"
            keyboardType="numeric"
            value={(exercicio as CardioComDetalhes).duracao}
            onChangeText={(text) => updateExercicioDetalhes(treinoEmAndamento!.id, exercicio.id, 'duracao', text)}
          />
        </View>
      </>
    ) : (
      <>
        <View style={styles.row}>
          <Text style={styles.label}>Carga (kg):</Text>
          <MaskedTextInput
            style={styles.input}
            placeholder="Carga"
            autoSkip={true}
            autocomplete={true}
            //validationRegex='^[0-9]+$'
            allowedKeys='0123456789'
            mask="[099] kg"
            keyboardType="numeric"
            value={(exercicio as ExercicioComDetalhes).carga}
            onChangeText={(text) => updateExercicioDetalhes(treinoEmAndamento!.id, exercicio.id, 'carga', text.replace(" kg", ""))}
          />
          
        </View>
        {(exercicio as ExercicioComDetalhes).carga === "" || (exercicio as ExercicioComDetalhes).carga === "0" ? (<Text style={{color: "red"}}>Insira uma carga válida!</Text>):null}
        <View style={styles.row}>
          <Text style={styles.label}>Rep:</Text>
          <TouchableOpacity onPress={() => alterarRepeticoes(exercicio.id, -1)} style={styles.adjustButton}>
            <Text style={styles.adjustText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.valueText}>{(exercicio as ExercicioComDetalhes).repeticoes || 8}</Text>
          <TouchableOpacity onPress={() => alterarRepeticoes(exercicio.id, 1)} style={styles.adjustButton}>
            <Text style={styles.adjustText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rowSeries}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{flexDirection: 'column', alignItems:'flex-start', alignSelf:'flex-start'}}>
            <Text style={styles.seriesLabel}>Séries:</Text>
            </View>
            
            <View style={styles.seriesRow}>
              {(exercicio as ExercicioComDetalhes).seriesCompletas.map((checked, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => toggleSerieCheckbox(treinoEmAndamento!.id, exercicio.id, index)}
                  style={[styles.seriesDot, checked && styles.seriesDotActive]}
                />
              ))}
            </View>
          </View>
          <View style={{flexDirection: 'column', alignItems:'flex-start', alignSelf:'flex-start'}}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={() => removeSerie(treinoEmAndamento!.id, exercicio.id)} style={styles.seriesAdjustButton}>
                <Text style={styles.seriesAdjustText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => addSerie(treinoEmAndamento!.id, exercicio.id)} style={styles.seriesAdjustButton}>
                <Text style={styles.seriesAdjustText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        </View>
      </>
    )}
  </View>
);

return (
  <View style={styles.container}>
    {treino.length === 0 ? (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Você ainda não tem um treino!</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("TreinoStack")}>
          <Text style={styles.buttonText}>Criar um treino</Text>
        </TouchableOpacity>

      </View>
    ) : treinoEmAndamento ? (
      treinoEmAndamento.exercicios.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Este treino ({treinoEmAndamento.nome}) ainda não tem exercícios.</Text>
          
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("TreinoStack")}>
            <Text style={styles.buttonText}>Editar Treino</Text>
          </TouchableOpacity>
          
        </View>
      ) : (
        <ScrollView style={styles.scrollViewContent}>
          <Text style={styles.currentTreinoTitle}>Treino: {treinoEmAndamento.nome}</Text>
          {treinoEmAndamento.exercicios.map(renderExercicioInput)}
          <View style={styles.footerButtons}>
            <TouchableOpacity style={[styles.footerButton, styles.cancelButton]} onPress={handleCancelTreino}>
              <Text style={styles.footerButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.footerButton, styles.finishButton]} onPress={handleFinishTreino}>
              <Text style={styles.footerButtonText}>Finalizar</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      )
    ) : (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum treino selecionado.</Text>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Escolher Treino</Text>
        </TouchableOpacity>
        
      </View>
    )}
    <TreinoSelectionModal
      isVisible={modalVisible}
      onClose={() => setModalVisible(false)}
      treinos={treino}
      onSelectTreino={handleSelectTreino}
    />
  </View>
);

};

const styles = StyleSheet.create({
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
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#d3d6db', // Slightly darker background for contrast with cards
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#555', // Darker for better readability
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollViewContent: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#e8ecef', // Match container background
  },
  currentTreinoTitle: {
    fontSize: 26, // Slightly larger for prominence
    fontWeight: '700', // Bolder for emphasis
    marginBottom: 25,
    textAlign: 'center',
    color: '#303841', // Match the vibrant blue of the series field
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1, // Slightly stronger shadow for depth
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3, // For Android
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  rowSeries: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa', // Subtle background to highlight series
    paddingHorizontal: 0,
  },
  label: {
    fontSize: 14,
    marginRight: 8,
    color: '#333',
  },
  seriesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black', // Vibrant blue for emphasis
    marginRight: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#303841',
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
    width: '32%',
    textAlign: 'center',
  },
  adjustButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#303841',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  adjustText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  valueText: {
    color: "black",
    fontSize: 16,
    minWidth: 40,
    textAlign: 'center',
  },
  seriesRow: {
    flexDirection: 'row',
    flexWrap:'wrap',
    maxWidth: 190,
    gap: 8,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  seriesDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#666',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  seriesDotActive: {
    backgroundColor: '#be3144',
    borderColor: '#303841',
    shadowOpacity: 0.2,
  },
  seriesAdjustButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#303841',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  seriesAdjustText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 14, // Slightly taller for better touch target
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: '#303841', // Slightly darker red for consistency
  },
  finishButton: {
    backgroundColor: '#be3144', // Slightly darker green for consistency
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TreinoAndamento;