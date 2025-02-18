


import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert, FlatList} from "react-native";

import * as SQLite from 'expo-sqlite';




const ListaTarefass = () => {

    const [tarefa, setTarefa] = useState('');
    const [lista, setLista] = useState([]);

    const [db, setDb] = useState(null);//armazenar uma intancia banco de dados

      useEffect(() => {
         (async () =>{
            //abre banco de dados
            const database = await SQLite.openDatabaseAsync('tarefas.db')
            setDb(database);
            criarTabela(database);
            carregarTarefas(database)
         })
      },[]);      

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

}

export default ListaTarefass


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 16
    },

    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20
    },
    input:{
        width:"100%",
        height:40,
        backgroundColor: '#fff', 
        borderColor: 'black',
        borderWidth:1,
        paddingHorizontal: 10,
        borderRadius:5,
        marginBottom: 20


    },

    botao:{
        backgroundColor: "#e63946",
        padding: 10,
        borderRadius:5,
        alignItems:"center",
        marginBottom: 20


    },
    botao_texto:{
        color: "#fff",
        fontWeight: 'bold',
        fontSize: 16

    },
    item: {
        flexDirection: "row",
        justifyContent:"space-between",
        padding:15,
        backgroundColor: '#fff',
        marginTop:10,
        borderRadius:5,

    }


  });



     // npm install @react-native-async-storage/async-storage

    // const salvarTarefas = async (tarefas) =>{
    //     try {
    //         await AsyncStorage.setItem('tarefas', JSON.stringify(tarefas));// CONVERTE STRING EM LISTA
            
    //     } catch (error) {
    //         console.error('erros ao salvar', error)
    //     }

    // }

    // const carregarTarefas = async () =>{
    //     try {
    //         const tarefasSalvas = await AsyncStorage.getItem('tarefas')
    //         if (tarefasSalvas) {
    //             setLista(JSON.parse(tarefasSalvas)); //CONVERTE JSON DE VOLTA PARA  ARRAY
    //         }
            
    //     } catch (error) {
    //         console.error('erros ao carregar', error)
    //     }

    // }


        // const removerTarefa = async (index) =>{

    //     const novaLista = lista.filter((_,i)=> i !== index);
    //     setLista(novaLista);
    //     salvarTarefas(novaLista);
    // }