import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TreinoScreen from '../screens/treino/gerenciar/TreinoScreen';
import ExercicioScreen from '../screens/treino/gerenciar/ExercicioScreen';

// --- Tipagem das Rotas da Stack ---

export type WorkoutStackParamList = {
  Treinos: undefined; // A tela AddTrainingScreen não espera parâmetros iniciais
  Exercicios: { treinoId: string, treinoNome: string}; // ExercicioListScreen espera o ID e o Nome do Treino
};

// Crie uma instância do Stack Navigator
export const Stack = createNativeStackNavigator<WorkoutStackParamList>();



const TreinoStackScreen: React.FC = () => {
  return (
        <Stack.Navigator initialRouteName="Treinos">
            <Stack.Screen
                name="Treinos"
                component={TreinoScreen}
                options={{ title: 'Meus Treinos' }} // Título do cabeçalho da tela
            />
            <Stack.Screen
                name="Exercicios"
                component={ExercicioScreen}
                options={{ title: 'Exercícios do Treino' }} // Título do cabeçalho da tela
            />
        </Stack.Navigator>
    
  );
};

export default TreinoStackScreen;