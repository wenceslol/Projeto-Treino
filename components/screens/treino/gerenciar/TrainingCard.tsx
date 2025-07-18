// TrainingCard.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { ExercicioNoTreino } from '../TreinoTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from '../../../navigation/TreinoStack';
import { useNavigation } from '@react-navigation/native';
import { useTreino } from '../TreinoContext';
import { useState } from 'react';
import { ObjetoTreino } from '../TreinoTypes';
import { Alert } from 'react-native';
import { apiInstance } from '../../../middleware/Interceptor';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

interface TrainingCardProps {
  treinoId: string,
  treinoNome: string;
  exercicios: ExercicioNoTreino[];
}

type Navigation = NativeStackNavigationProp<WorkoutStackParamList>;

const TrainingCard = ({ treinoId, treinoNome, exercicios }: TrainingCardProps) => {

    const navigation = useNavigation<Navigation>();
    const contextTreino = useTreino();
    
    const RemoverExercicios = async (treinoId: string, id: number) => {
        console.log("Removendo exercício...");
        console.log("ID do Treino:", treinoId);
        console.log("ID do Exercício a Remover:", id);
        try {
            //Removido await para restar responsividade
            apiInstance.delete(`/treinos/${treinoId}/exercicios/${id}`);

            contextTreino.setTreino(prevTreinos => {
              return prevTreinos.map(treinoItem => {
              // Encontra o treino alvo pelo ID
              if (treinoItem.id === treinoId) {
                  // Retorna uma nova versão do treino com o exercício removido
                  console.log(`Removendo exercício ${id} do treino ${treinoItem.nome}`);

                  
                  return {
                  ...treinoItem, // Copia todas as outras propriedades do treino
                  exercicios: treinoItem.exercicios.filter(ex => ex.id !== id), // Filtra para REMOVER o exercício com o itemId
                  };
              }
              return treinoItem; // Retorna os outros treinos inalterados
              });
            });
        console.log("Lógica de remoção concluída.");
        } catch (error) {
          console.log("Não foi possível remover o treino:", error)
        }

        
    }

    // Função para remover um treino completo
  const removerTreino = async (treinoIdParaRemover: string) => {
    // Filtra a lista de treinos, mantendo apenas aqueles cujo ID não corresponde
    try {
      const response = await apiInstance.post('/apagar-treino', {treinoId: treinoIdParaRemover});
      console.log(response.data)
      contextTreino.setTreino(prevTreinos => prevTreinos.filter(treino => treino.id !== treinoIdParaRemover));
    } catch (error) {
      console.log("Não foi possível apagar o treino do banco de dados", error)
    }
  };



    function EditarExercicios(treinoId: string, treinoNome: string){
        console.log("Editando o treino:", treinoNome);
        console.log("ID:", treinoId);
        navigation.navigate("Exercicios", {treinoId, treinoNome});
    }


    const [editedTreinoName, setEditedTreinoName] = useState<string>('');
    const [editingTreinoId, setEditingTreinoId] = useState<string | null>(null);
    // Função principal para editar o nome do treino
  const editarNomeTreino = async (treinoId: string, novoNome: string) => {
    try {
        const response = await apiInstance.patch('/editar-nome-treino', {treinoId: treinoId, treinoNome: novoNome})
        console.log(response);

        contextTreino.setTreino(prevTreinos =>
          prevTreinos.map(treino => {
            if (treino.id === treinoId) {

              

              return { ...treino, nome: novoNome }; // Atualiza o nome do treino
            }
            return treino;
          })
        );
        setEditingTreinoId(null); // Sai do modo de edição
        setEditedTreinoName(''); // Limpa o campo de edição
    } catch (error) {
      console.log("Erro desconhecido:", error);
    }
    
  };

  // Funções auxiliares para o modo de edição (se você quiser um TextInput)
  const handleEditPress = (treino: ObjetoTreino) => {
    setEditingTreinoId(treino.id);
    setEditedTreinoName(treino.nome);
  };

  const handleSaveEdit = (treinoId: string) => {
    if (editedTreinoName.trim() !== '') {
      editarNomeTreino(treinoId, editedTreinoName.trim());
    } else {
      Alert.alert("Erro", "O nome do treino não pode ser vazio.");
    }
  };

return (
  <View style={styles.card}>
    {editingTreinoId === treinoId ? (
      <View style={styles.editContainer}>
        <TextInput
          style={styles.editInput}
          value={editedTreinoName}
          onChangeText={setEditedTreinoName}
          autoFocus
          onSubmitEditing={() => handleSaveEdit(treinoId)}
          placeholder="Nome do treino"
          placeholderTextColor="#ccc"
        />
        <View style={styles.editButtons}>
          <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveEdit(treinoId)}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setEditingTreinoId(null)}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <View style={styles.cardHeader}>
        <Text style={styles.cardText}>{treinoNome}</Text>
        <TouchableOpacity style={{paddingHorizontal:10}} onPress={() => handleEditPress({ id: treinoId, nome: treinoNome, exercicios })}>
          <Icon name="pencil" size={25} color="black"></Icon>

        </TouchableOpacity>
        <TouchableOpacity onPress={() => removerTreino(treinoId)}>
          <Icon name="delete" size={25} color="black"></Icon>

        </TouchableOpacity>
      </View>
    )}

    <FlatList
      data={exercicios}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.exerciseItem}>
          <View style={{ flex: 1 }}>
            <Text
              style={styles.exerciseText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.exercicioNome}
            </Text>
          </View>
          <TouchableOpacity onPress={() => RemoverExercicios(treinoId, item.id)}>
            <Text style={styles.removeText}>Remover</Text>
          </TouchableOpacity>
        </View>
      )}
    />

    <TouchableOpacity style={styles.navButton} onPress={() => EditarExercicios(treinoId, treinoNome)}>
      <Text style={styles.navButtonText}>+ Adicionar Exercícios</Text>
    </TouchableOpacity>
  </View>
);
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
    marginRight: 10,
  },
  actionText: {
    fontSize: 18,
    color: 'black',
    marginLeft: 10,
  },
  editContainer: {
    marginBottom: 10,
  },
  editInput: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    padding: 8,
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#be3144',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#999',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#666',
    paddingVertical: 8,
    gap: 10,
  },
  exerciseText: {
    color: 'blareck',
    fontSize: 16,
  },
  removeText: {
    color: '#e15759',
    fontWeight: 'bold',
  },
  navButton: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: '#be3144',
    borderRadius: 8,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TrainingCard;