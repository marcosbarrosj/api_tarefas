import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, FlatList } from "react-native";
import * as SQLite from 'expo-sqlite';


const ListaTarefas = () => {

    const [tarefa, setTarefa] = useState('');
    const [lista, setLista] = useState([]);
    const [db, setDb] = useState(null); // Armazenar uma instância do banco de dados


    // useEffect para carregar as tarefas salvas ao abrir o app
    useEffect(() => {
        (async () => {
            // Abre o banco de dados
            const databse = await SQLite.openDatabaseAsync('tarefas.db')
            setDb(databse);
            criarTabela(databse);
            carregarTarefas(databse);
        })();
    }, []);


    // Função para Criar a tabela no banco de dados
    const criarTabela = async (databse) => {
        try {
            await databse.execAsync(`
                CREATE TABLE IF NOT EXISTS tarefas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    descricao TEXT NOT NULL
                );
            `);
            console.log('Tabela criada ou já existe!')
        } catch (error) {
            console.error('Erro ao criar a tabela:', error);
        };
    };


    // Função para adicionar uma nova tarefa
    const adicionarTarefa = async () => {
        if(tarefa.trim() === ''){
            Alert.alert('Erro', 'Digite uma tarefa válida!');
            return;
        }

        try {
            const result = await db.runAsync(`INSERT INTO tarefas (descricao) VALUES (?)`, tarefa );
            const novaTarefa = { id: result.lastInsertRowId, descricao: tarefa };
            // atualiza o estado com a nova tarefa
            setLista(prevLista => [...prevLista, novaTarefa])
            // limpa o campo input
            setTarefa('');
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
        }
    }

    // Função para carregar as tarefas do banco de dados
    const carregarTarefas = async (databse) => {
        try {
            const tarefas = await databse.getAllAsync('SELECT * FROM tarefas');
            setLista(tarefas);
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
        }
    }

        // Função para carregar remover uma as tarefas da lista

        const removerTarefa = async (id) =>{
            try {
                await db.runAsync('DELETE FROM tarefas  WHERE   id = ?', id);
                setLista(prevLista => prevLista.filter(tarefa => tarefa.id !== id))     
                
            } catch (error) {
                console.error('Erro ao remover tarefas:', error);

                
            }

        }











 
    // // Função para Salvar tarefas
    // const salvarTarefas = async (tarefas) => {
    //     try {
    //         await AsyncStorage.setItem('tarefas', JSON.stringify(tarefas)) // converte a lista para string JSON
    //     } catch (error) {
    //         console.error('Erros ao salvar:', error)
    //     }
    // };



    // // Função para Carregar as tarefas
    // const carregarTarefas = async () => {
    //     try {
    //         const tarefasSalvas = await AsyncStorage.getItem('tarefas');
    //         if(tarefasSalvas) {
    //             setLista(JSON.parse(tarefasSalvas)); // converte JSON de volta para array
    //         }
    //     } catch (error) {
    //         console.error('Erros ao carregar:', error)
    //     }
    // }



    // // Função para adicionar uma nova tarefa
    // const adicionarTarefa = () => {
    //     if(tarefa.trim() === ''){
    //         Alert.alert('Erro', 'Digite uma tarefa válida!');
    //         return;
    //     }

    //     const novaLista = [...lista, tarefa];
    //     setLista(novaLista);
    //     salvarTarefas(novaLista);
    //     setTarefa('');
    // }



    // // Função para remover uma tarefa da lista
    // const removerTarefa = (index) => {
    //     const novaLista = lista.filter((_, i) => i !== index);
    //     setLista(novaLista); // Atualiza o estado da lista
    //     salvarTarefas(novaLista); // Atualiza o AsyncStorage com a nova lista
    // }



    return(
        <View style={styles.container}>
            <Text style={styles.titulo}>Lista de Tarefas</Text>

            <TextInput 
                style={styles.input}
                placeholder='Digite a tarefa'
                value={tarefa}
                onChangeText={setTarefa}
            />

            <TouchableOpacity style={styles.botao} onPress={adicionarTarefa}>
                <Text style={styles.textoBotao}>Adicionar</Text>
            </TouchableOpacity>

            <FlatList
                data={lista} // lista de tarefas
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>{item.descricao}</Text>
                        <TouchableOpacity onPress={() => removerTarefa(item.id)}>
                            <Text>❌</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <StatusBar style="auto" />
        </View>        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
    },
    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 30,
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    botao: {
        backgroundColor: "#e63946",
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    textoBotao: {
        color: "#ffffff",
        fontWeight: 'bold',
        fontSize: 16,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#fff',
        marginTop: 10,
        borderRadius: 5,
    }
})

export default ListaTarefas;
