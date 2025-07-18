import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Alert, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { PieChart } from 'react-native-gifted-charts';
import { AuthService } from '../auth/AuthService';
import { apiInstance } from '../middleware/Interceptor';
import { DefaultNavigationProp } from '../navigation/NavigationTypes';
import {LocaleConfig} from 'react-native-calendars';
import { pieDataItem } from 'react-native-gifted-charts';
import { StyleSheet } from 'react-native';
import { useTreino } from '../screens/treino/TreinoContext';


LocaleConfig.locales['pt-BR'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul.', 'Ago', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sab.'],
  today: "Hoje"
};
LocaleConfig.defaultLocale = 'pt-BR';

function HomeScreen() {

const [pieData, setPieData] = useState<pieDataItem[]>([]);
const [historico, setHistorico] = useState<any[]>([]);
const [exercicioDoDia, setExercicioDoDia] = useState<null | {
  sessao: string;
  gastoBasal: number;
  gastoTotalCalorias: number;
  exercicios: { exercicioNome: string; gastoCalorico: number }[];
}>(null);

const markedDates = useMemo(() => {
  return historico.reduce((acc, item, index) => {
    const dateObj = new Date(item.sessao);
    const formatted = dateObj.toISOString().split('T')[0]; // yyyy-mm-dd
    acc[formatted] = {
      selected: true,
      selectedColor: '#be3144',
    };
    return acc;
  }, {} as Record<string, any>);
}, [historico]);

const onDayPress = (day: { dateString: string }) => {
  const entradas = historico.filter(item => item.sessao.startsWith(day.dateString));
  
  if (entradas.length === 0) {
    setExercicioDoDia(null);
    setPieData([]);
    return;
  }

  // Junta todos os exercícios de treinos do mesmo dia
  const todosExercicios = entradas.flatMap(e => e.exercicios);

  // Soma os gastos
  const gastoTotalCalorias = entradas.reduce((acc, e) => acc + e.gastoTotalCalorias, 0);
  const gastoBasal = entradas.reduce((acc, e) => e.gastoBasal, 0);
  

  // Gera gráfico
  const cores = [
  '#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f',
  '#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ab',
  '#86bc86', '#6b5b95', '#ffa07a', '#00bfff', '#ff69b4',
  '#8b4513', '#7fffd4', '#ff7f50', '#dc143c', '#20b2aa'
];
  const pieData = todosExercicios.map((ex, index) => ({
    value: ex.gastoCalorico,
    text: `${ex.exercicioNome}: ${ex.gastoCalorico.toFixed(0)} kcal`,
    color: cores[index % cores.length],
  }));

  setPieData(pieData);

  setExercicioDoDia({
    sessao: day.dateString,
    exercicios: todosExercicios,
    gastoBasal,
    gastoTotalCalorias,
  });
};


const fetchData = async () => {
      try {
        //setLoading(true);
        const response = await apiInstance.get('/calorias');
        const historicoData = response.data.data;
        setHistorico(historicoData);
      } catch (err) {
        console.error('Erro ao buscar histórico:', err);
      } finally {
        setLoading(false);
      }
    };

useEffect(() => {
    
    fetchData();
  }, []);

  const navigation = useNavigation<DefaultNavigationProp>();
  //const [pieData, setPieData] = useState<pieDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [refreshing, setRefreshing] = useState(false);



  if (loading) {
  return (
    <View style={styles.centeredContainer}>
      <ActivityIndicator size="large" color="#3a4750" />
      <Text style={styles.messageText}>Carregando...</Text>
    </View>
  );
}


const refreshData = async () => {
  setExercicioDoDia(null);
  setPieData([]);
  await fetchData();
}


return (
  <ScrollView contentContainerStyle={{ flexGrow: 1 }}
              refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => refreshData()}
          colors={['#007bff']}
          tintColor="#007bff"
        />
      }
  >
    <View style={styles.contentContainer}>
      <Text style={styles.screenTitle}>Histórico de treino</Text>

      <Calendar
        style={{}}
        theme={{calendarBackground:"#d3d6db", textSectionTitleColor:"black", arrowColor:'#be3144', todayTextColor:'#be3144'}}
        markedDates={markedDates}
        onDayPress={onDayPress}
      />

      <View style={styles.chartSection}>
        {exercicioDoDia ? (
          <>
            <PieChart
              data={pieData}
              radius={100}
              innerRadius={60}
              textColor="#000"
              backgroundColor='#d3d6db'
              donut
              showValuesAsLabels
              labelsPosition="outward"
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text style={styles.centerLabelText}>
                    Gasto total: {(exercicioDoDia.gastoBasal + exercicioDoDia.gastoTotalCalorias).toFixed(0)} kcal
                  </Text>
                </View>
              )}
            />
          </>
        ) : (
           <Text style={styles.messageText}>Selecione uma data marcada.</Text>
        )}

        {exercicioDoDia && (
          <>
            <Text style={styles.detailText}>
              Gasto do treino: {exercicioDoDia.gastoTotalCalorias.toFixed(0)} kcal
            </Text>
            <Text style={styles.detailText}>
              Gasto basal: {exercicioDoDia.gastoBasal.toFixed(0)} kcal
            </Text>
          </>
        )}
      </View>

      <View style={styles.legendContainer}>
        {pieData.map((item, index) => {
          if (!item.text) return null;

          const [nome, valor] = item.text.split(':');

          return (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>
                {nome}:{' '}
                <Text style={styles.legendValue}>{valor?.trim()}</Text>
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  </ScrollView>
);
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#d3d6db",
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#d3d6db",
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3a4750',
    marginBottom: 20,
  },
  chartSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  centerLabel: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerLabelText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: "center",
    color: '#3a4750',
  },
  detailText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3a4750',
    marginTop: 10,
  },
  legendContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#3a4750',
  },
  legendValue: {
    fontWeight: 'bold',
    color: '#e15759',
  },
  messageText: {
    marginTop: 10,
    color: '#3a4750',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default HomeScreen;

// Tipos usados
interface calculoExercicio {
  exercicioId: number;
  exercicioNome: string;
  tipo: 'forca' | 'cardio';
  gastoCalorico: number;
}

interface calculoExercicioForca extends calculoExercicio {
  tipo: 'forca';
  carga: number;
  repeticoes: number;
  seriesCompletas: number;
  totalSeriesDisponiveis: number;
}

interface calculoExercicioCardio extends calculoExercicio {
  tipo: 'cardio';
  duracao: number;
}

interface DadosUsuario {
  usuario_id: number;
  nome: string;
  sexo: 'M' | 'F';
  altura: string;
  peso: string;
  data_nascimento: string;
}

interface TreinoCompletoHistorico {
  sessao: string;
  dadosUsuario: DadosUsuario;
  gastoBasal: number;
  gastoTotalCalorias: number;
  exercicios: (calculoExercicioCardio | calculoExercicioForca)[];
}
