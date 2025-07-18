import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ExercicioNoTreino, ObjetoTreino, TreinoEmAndamento } from './TreinoTypes'; // ajuste os tipos conforme necessário
import { useEffect } from 'react';
import { apiInstance } from '../../middleware/Interceptor';

type TreinoContextType = {
    treino: ObjetoTreino[];
    //declaração necessária para setTreino funcionar como um useState deveria
    setTreino: React.Dispatch<React.SetStateAction<ObjetoTreino[]>>;
    listaExercicio: ExercicioNoTreino[];
    setListaExercicio: React.Dispatch<React.SetStateAction<ExercicioNoTreino[]>>;
    treinoEmAndamento: TreinoEmAndamento | null;
    setTreinoEmAndamento: React.Dispatch<React.SetStateAction<TreinoEmAndamento | null>>;
};

const TreinoContext = createContext<TreinoContextType | undefined>(undefined);



export const TreinoProvider = ({ children }: { children: ReactNode }) => {

    

  //migrado de treinoscreen
  const [treino, setTreino] = useState<ObjetoTreino[]>([]);

  const [treinoEmAndamento, setTreinoEmAndamento] = useState<TreinoEmAndamento | null>(null);

  const [listaExercicio, setListaExercicio] = useState<ExercicioNoTreino[]>([]);
  const [hasFetchedTreinos, setHasFetchedTreinos] = useState(false); // <--- O NOVO TRIGGER
  
  //busca os treinos e exercícios no banco de dados ao carregar qualquer uma das telas do treinoContext
  useEffect(() => {
      // Só entra se os treinos estiverem vazios E ainda não tentamos buscá-los
      if (treino.length === 0 && !hasFetchedTreinos) {
        console.log("Não existem treinos locais. Buscando do backend...");
  
        const fetchTreinosFromBackend = async () => {
          try {
            // Marca que a busca foi iniciada para evitar loops
            setHasFetchedTreinos(true);
  
            const { data: response } = await apiInstance.get('/treinos'); // <--- Sua requisição GET para buscar treinos
            const fetchedTreinos = response.data; // Supondo que a resposta seja um array de treinos
              console.log(fetchedTreinos);
            if (fetchedTreinos && fetchedTreinos.length > 0) {
              console.log("Treinos encontrados no backend:", fetchedTreinos);
              setTreino(fetchedTreinos); // Atualiza o estado global 'treino' com os treinos encontrados
            } else {
              console.log("Nenhum treino encontrado no backend.");
            }
          } catch (error) {
            console.error("Erro ao buscar treinos do backend:", error);
            // Você pode adicionar um tratamento de erro mais sofisticado aqui (ex: exibir mensagem para o usuário)
          }
        };
  
        fetchTreinosFromBackend(); // Chama a função de busca
      } else if (treino.length > 0 && !hasFetchedTreinos) {
          // Se já existem treinos no estado local (ex: carregados de localStorage)
          // e a busca ainda não foi marcada como feita, podemos marcar.
          // Isso evita que ele tente buscar novamente na próxima renderização se
          // os treinos já estiverem populados de alguma outra fonte inicial.
          setHasFetchedTreinos(true);
      }
  
      // Seu console.log original pode ser mantido se for útil para outros propósitos,
      // mas a lógica principal da busca deve estar dentro do if/else if
      // que verifica 'treino.length === 0 && !hasFetchedTreinos'.
  
    }, [treino, hasFetchedTreinos, setTreino]); // Dependências do useEffect

  return (
    <TreinoContext.Provider
      value={{
        treino,
        setTreino,
        listaExercicio,
        setListaExercicio,
        treinoEmAndamento,
        setTreinoEmAndamento
      }}
    >
      {children}
    </TreinoContext.Provider>
  );
};

export const useTreino = () => {
  const context = useContext(TreinoContext);
  if (!context) {
    throw new Error('useTreino deve ser usado dentro de um TreinoProvider');
  }
  return context;
};