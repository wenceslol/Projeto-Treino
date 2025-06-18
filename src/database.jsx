import db from "./db";

export const setupDatabase = async () => {
    const database = await db;

    //tabelas
    database.transaction(tx =>{
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Usuarios (
                usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
                altura INT NOT NULL CHECK (altura > 0),
                peso INT NOT NULL CHECK (peso > 0),
                idade INT NOT NULL CHECK (idade > 0)
            );`
        );

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Treinos (
                treino_id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INT NOT NULL,
                dia_semana TEXT NOT NULL CHECK (dia_semana IN ('Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo')),
                FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id),
                UNIQUE (usuario_id, dia_semana) -- Garante que cada usuário tenha no máximo um treino por dia
            );`
        );

        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS Exercicios (
                exercicio_id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome VARCHAR(100) NOT NULL UNIQUE,
                descricao TEXT,
                ativo INTEGER DEFAULT 1
            );`
        );
        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS Treino_Exercicios (
                treino_exercicio_id INTEGER PRIMARY KEY AUTOINCREMENT,
                treino_id INT NOT NULL,
                exercicio_id INT NOT NULL,
                series INT NOT NULL CHECK (series > 0),
                carga DECIMAL(6,2) NOT NULL CHECK (carga >= 0),
                FOREIGN KEY (treino_id) REFERENCES Treinos(treino_id),
                FOREIGN KEY (exercicio_id) REFERENCES Exercicios(exercicio_id)
            );`
        );

    })
}

export const inserirUsuario = async (userdata) => {
    const database = await db;

    database.transaction(tx =>{
        tx.executeSql(`INSERT INTO Usuarios (altura, peso, idade) VALUES (?, ?, ?)`,
            [userdata.altura, userdata.peso, userdata.idade],
            (tx, result) => {
                const usuarioID = result.insertId;
                console.log(`Usuário inserido com ID: ${usuarioID}`);
            },
            (tx, error) => {
                console.error("Erro ao inserir usuário", error.message);
            }
        );
    });
};

//treino_id vai ser o dia do treino, ou o tipo(ABCDE) 
//exercicios é um objeto contendo todos os valores dos exercícios
export const inserirExercicioTreino = async (treino_id, exercicios) => {
    const database = await db;
    
    database.transaction(tx => {

        tx.executeSql(`INSERT INTO Usuarios (altura, peso, idade) VALUES (?, ?, ?)`,
            []
        );

        exercicios.forEach(ex => {
            tx.executeSql(
                `INSERT INTO Treino_Exercicios (treino_id, exercicio_id, series, carga) VALUES (?, ?, ?, ?)`,
                [treino_id, exercicio_id, ex.series, ex.carga]
            )
        })

    })
}