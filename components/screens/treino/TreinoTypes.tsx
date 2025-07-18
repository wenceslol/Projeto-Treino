export interface ExercicioNoTreino {
  id: number;
  exercicioNome: string;
}

export interface CardioNoTreino extends ExercicioNoTreino {
  duracao: string;
}

// Tipo de união para representar um exercício no treino que pode ser um ExercicioNoTreino padrão OU um CardioNoTreino
export type TipoDeExercicioNoTreino = ExercicioNoTreino | CardioNoTreino;

export interface ObjetoTreino {
  id: string;
  nome: string;
  // AQUI É A PRIMEIRA CORREÇÃO:
  // A propriedade 'exercicios' de ObjetoTreino deve aceitar ambos os tipos de exercício "básicos".
  exercicios: TipoDeExercicioNoTreino[];
}

export interface ExercicioComDetalhes extends ExercicioNoTreino {
  carga: string;
  repeticoes: string;
  seriesCompletas: boolean[]; // Array de booleanos para os checkboxes de série
}

export interface CardioComDetalhes extends CardioNoTreino {
  // Não é necessário adicionar nenhum parâmetro, mas é necessário para a lógica
  // Isso mantém a duracao que vem de CardioNoTreino
}

// Tipo de união para representar um exercício com detalhes que pode ser um ExercicioComDetalhes padrão OU um CardioComDetalhes
export type TipoDeExercicioComDetalhes = ExercicioComDetalhes | CardioComDetalhes;

export interface TreinoEmAndamento extends ObjetoTreino {
  // AQUI É A SEGUNDA E MAIS IMPORTANTE CORREÇÃO:
  // A propriedade 'exercicios' de TreinoEmAndamento deve aceitar ambos os tipos de exercício "com detalhes".
  exercicios: TipoDeExercicioComDetalhes[];
}