import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Button
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import exerciciosJson from '../../../../assets/data/exercicios.json'
import { Alert } from 'react-native';
import { Modal, ScrollView, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from '../../../navigation/TreinoStack';
import { useTreino } from '../TreinoContext';
import { RouteProp } from '@react-navigation/native';
import { apiInstance } from '../../../middleware/Interceptor';
import env from '../../../../env'

// Definição da interface para o objeto Exercício
interface Exercicio {
  name: string;
  force?: string;
  level?: string;
  mechanic?: string;
  equipment?: string;
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  instructions?: string[];
  category: string;
  images?: string[];
  id: number;
}

type ExercicioListScreenProps = NativeStackScreenProps<WorkoutStackParamList, 'Exercicios'>;
type ExerciciosScreenRouteProp = RouteProp<WorkoutStackParamList, 'Exercicios'>;

function TreinoScreen() {

  //Referenciando URL de imagens do arquivo .env
  const BASE_IMAGE_URL = env.IMAGES_URL;

  const route = useRoute<ExerciciosScreenRouteProp>();
  const { treinoId, treinoNome } = route.params;

  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedPrimaryMuscle, setSelectedPrimaryMuscle] = useState<string>('Todas');

  const [isImageViewerVisible, setIsImageViewerVisible] = useState<boolean>(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentExerciseName, setCurrentExerciseName] = useState<string>('');
  const [currentId, setCurrentId] = useState<number>(1);
  const contextTreino = useTreino();

  const objetoTreinoEncontrado = contextTreino.treino.find(
    (treinoNaLista) => treinoNaLista.id === treinoId
  );

  let isExercicioAlreadyAdded = false;
  if (objetoTreinoEncontrado) {
    isExercicioAlreadyAdded = objetoTreinoEncontrado.exercicios.some(
      (exercicioDentroDoTreino) => exercicioDentroDoTreino.id === currentId
    );
  }


  useEffect(() => {
    const fetchExercicios = async () => {
      try {
        setExercicios(exerciciosJson as Exercicio[]);
      } catch (error) {
        console.error('Erro ao carregar exercícios:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExercicios();
  }, []);

const addRemoveExercicio = async (id: number, nome: string) => {
  const treinoAtual = contextTreino.treino.find(t => t.id === treinoId);
  const exercicioJaExiste = treinoAtual?.exercicios.some(ex => ex.id === id);

  try {
    if (exercicioJaExiste) {
      // Remoção
      setIsImageViewerVisible(false);
      await apiInstance.delete(`/treinos/${treinoId}/exercicios/${id}`);
    } else {
      // Adição
      setIsImageViewerVisible(false);
      await apiInstance.post(`/treinos/${treinoId}/exercicios`, {
        exercicioId: id,
        nome,
      });
    }

    // Atualiza o estado local só depois do sucesso da operação
    contextTreino.setTreino(prevTreinos => {
      return prevTreinos.map(treinoItem => {
        if (treinoItem.id === treinoId) {
          if (exercicioJaExiste) {
            return {
              ...treinoItem,
              exercicios: treinoItem.exercicios.filter(ex => ex.id !== id),
            };
          } else {
            return {
              ...treinoItem,
              exercicios: [...treinoItem.exercicios, { id, exercicioNome: nome }],
            };
          }
        }
        return treinoItem;
      });
    });

  } catch (error) {
    console.error("Erro ao adicionar/remover exercício:", error);
  } finally {
    //setIsImageViewerVisible(false);
  }
};

  const categories = ['Todas', ...Array.from(new Set(exercicios.map((ex) => ex.category)))];
  const primaryMuscles = ['Todas', ...Array.from(new Set(exercicios.flatMap((ex) => ex.primaryMuscles || [])))];

  const filteredExercicios = exercicios.filter((exercicio) => {
    const matchesSearchTerm = exercicio.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todas' || exercicio.category === selectedCategory;
    const matchesPrimaryMuscle =
      selectedPrimaryMuscle === 'Todas' || 
      (exercicio.primaryMuscles && exercicio.primaryMuscles.includes(selectedPrimaryMuscle));
    return matchesSearchTerm && matchesCategory && matchesPrimaryMuscle;
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando exercícios...</Text>
      </View>
    );
  }

  const handleCardPress = (exercise: Exercicio) => {
    console.log(exercise.images);
    if (exercise.images && exercise.images.length > 0) {
      setCurrentImages(exercise.images);
      setCurrentExerciseName(exercise.name);
      setCurrentId(exercise.id);
      setIsImageViewerVisible(true);
    } else {
      Alert.alert(`Não há imagens disponíveis para ${exercise.name}.`);
    }
  };

  const renderExercicioCard = ({ item }: { item: Exercicio }) => (
    <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.touchableOpacity}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardCategory}>Complexidade: {item.level}</Text>
        <Text style={styles.cardCategory}>Categoria: {item.category}</Text>
        <Text style={styles.cardCategory}>Biomecânica: {item.mechanic}</Text>
        <Text style={styles.cardDescription}>Musculo Primário: {item.primaryMuscles}</Text>
        {item.images && item.images.length > 0 && (
          <Text style={styles.cardImageHint}>Clique para ver as imagens</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Editando: {treinoNome}</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar exercício..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholderTextColor={"black"}
      />
      <View>
        <Text style={{color: "black"}}>Selecione a categoria:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategoryButton,
                ]}
                onPress={() => setSelectedCategory(category)}>
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.selectedCategoryButtonText,
                  ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <Text style={{color: "black"}}>Selecione o músculo primário:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryContainer}>
            {primaryMuscles.map((muscle) => (
              <TouchableOpacity
                key={muscle}
                style={[
                  styles.categoryButton,
                  selectedPrimaryMuscle === muscle && styles.selectedCategoryButton,
                ]}
                onPress={() => setSelectedPrimaryMuscle(muscle)}>
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedPrimaryMuscle === muscle && styles.selectedCategoryButtonText,
                  ]}>
                  {muscle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      
      {filteredExercicios.length === 0 ? (
        <Text style={styles.noResultsText}>Nenhum exercício encontrado.</Text>
      ) : (
        <FlatList
          data={filteredExercicios}
          renderItem={renderExercicioCard}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
        />
      )}
      <Modal
        visible={isImageViewerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsImageViewerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{currentExerciseName}</Text>
            <ScrollView horizontal pagingEnabled style={styles.imageScrollView}>
              {currentImages.map((imagePath, index) => (
                <Image
                  key={index}
                  source={{ uri: BASE_IMAGE_URL + imagePath }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => addRemoveExercicio(currentId, currentExerciseName)}
              style={[styles.closeButton, isExercicioAlreadyAdded && styles.disabledButton]}>
              <Text style={styles.closeButtonText}>{isExercicioAlreadyAdded ? "Remover exercício" : "Adicionar exercício"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsImageViewerVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  cardImageHint: {
    fontSize: 12,
    color: '#be3144',
    marginTop: 10,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  imageScrollView: {
    width: '100%',
    height: 250,
    marginBottom: 15,
  },
  modalImage: {
    width: 300,
    height: 250,
    marginHorizontal: 5,
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#be3144',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#d3d6db',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  searchInput: {
    height: 40,
    color: "black",
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  categoryContainer: {
    flexDirection: 'row',
    //flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 15,
    minHeight: 40,
    maxHeight: 60,
  },
  categoryButton: {
  //paddingVertical: 3,
  paddingHorizontal: 15,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#be3144',
  margin: 5,
  backgroundColor: '#e9f5ff',
  alignItems: 'center',       // <- importante
  justifyContent: 'center',   // <- importante
  },
  selectedCategoryButton: {
    backgroundColor: '#be3144',
    borderColor: '#be3144',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#303841',
    fontWeight: '600',
  },
  selectedCategoryButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  touchableOpacity: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    //backgroundColor: '#fff',
    //borderRadius: 10,
    //padding: 15,
    //marginBottom: 10,
    //shadowColor: '#000',
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.1,
    //shadowRadius: 4,
    //elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  cardCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default TreinoScreen;