import React from 'react';
import { Modal, View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { ObjetoTreino } from '../TreinoTypes';

interface TreinoSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  treinos: ObjetoTreino[];
  onSelectTreino: (treino: ObjetoTreino) => void;
}

const TreinoSelectionModal: React.FC<TreinoSelectionModalProps> = ({
  isVisible,
  onClose,
  treinos,
  onSelectTreino,
}) => {
const renderTreinoCard = ({ item }: { item: ObjetoTreino }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{item.nome}</Text>
    <FlatList
      data={item.exercicios}
      keyExtractor={(exercicio) => exercicio.id.toString()}
      renderItem={({ item: exercicio }) => (
        <Text style={styles.exercicioText}>- {exercicio.exercicioNome}</Text>
      )}
    />
    <TouchableOpacity
      style={styles.startButton}
      onPress={() => onSelectTreino(item)}
    >
      <Text style={styles.startButtonText}>Iniciar Treino</Text>
    </TouchableOpacity>
  </View>
);

  return (
  <Modal
    animationType="slide"
    transparent={true}
    visible={isVisible}
    onRequestClose={onClose}
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalTitle}>Escolha um Treino</Text>
        <FlatList
          data={treinos}
          keyExtractor={(treino) => treino.id}
          renderItem={renderTreinoCard}
          style={styles.treinoList}
        />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker overlay for focus
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fff', // Match card background from previous iterations
    borderRadius: 16, // Softer, modern corners
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2, // Stronger shadow for depth
    shadowRadius: 6,
    elevation: 4, // For Android
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24, // Slightly larger to match currentTreinoTitle
    fontWeight: '700', // Bolder for emphasis
    marginBottom: 20,
    color: '#303841', // Vibrant blue to match series field
  },
  treinoList: {
    width: '100%',
  },
  card: {
    backgroundColor: '#fff', // Consistent with exercise cards
    borderRadius: 12, // Match card radius from previous iterations
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc', // Subtle border for definition
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1, // Match card shadow from previous iterations
    shadowRadius: 6,
    elevation: 3, // For Android
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600', // Slightly bolder for hierarchy
    marginBottom: 10,
    color: '#333', // Darker for readability
  },
  exercicioText: {
    fontSize: 14,
    color: '#555', // Consistent with previous text styles
    marginLeft: 12,
    marginVertical: 2, // Better spacing for list items
  },
  startButton: {
    backgroundColor: '#be3144', // Match series field’s vibrant blue
    paddingVertical: 12, // Larger touch target
    paddingHorizontal: 16,
    borderRadius: 8, // Softer corners
    marginTop: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600', // Match footerButtonText weight
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#303841', // Match cancelButton from previous iterations
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600', // Match startButtonText
  },
});

export default TreinoSelectionModal;