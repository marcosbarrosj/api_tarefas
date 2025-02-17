import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert, FlatList} from "react-native";

import * as SQLite from 'expo-sqlite';




const ListaTarefas = () => {

    const [tarefa, setTarefa] = useState('');
    const [lista, setLista] = useState([]);

    const [db, setDb] = useState(null);//armazenar uma intancia banco de dados

      useEffect(() => {
         (async () =>{
            //abre banco de dados
            const database = await SQLite.openDatabaseAsync('tarefas.db')
            setDb(database);
            criarTabela(database)
         })
      },[]);      

      //funçao para criar 
      const criarTabela = async (database)=> {
        try {
            await database.execAsync(`
                          CREATE TABLE IF NOT EXISTS tarefas(
                          id INTEREGER PRIMARY KEY AUTOINCREMENT,
                          descricao TEXT NOT NULL                )
                
                `);
                console.log(`tabela criada ou já existe`);
                
            
        } catch (error) {
            console.error('Erro ao criar a tabela', error);   
        };
      };





    // npm install @react-native-async-storage/async-storage

    const salvarTarefas = async (tarefas) =>{
        try {
            await AsyncStorage.setItem('tarefas', JSON.stringify(tarefas));// CONVERTE STRING EM LISTA
            
        } catch (error) {
            console.error('erros ao salvar', error)
        }

    }

    const carregarTarefas = async () =>{
        try {
            const tarefasSalvas = await AsyncStorage.getItem('tarefas')
            if (tarefasSalvas) {
                setLista(JSON.parse(tarefasSalvas)); //CONVERTE JSON DE VOLTA PARA  ARRAY
            }
            
        } catch (error) {
            console.error('erros ao carregar', error)
        }

    }

    const adicionarTarefa = async () =>{
       
            if (tarefa.trim() === '') {
                Alert.alert('erro','Digite uma Tarefa nova')
                return;
            }

            const result = await db.runAsync(
              `INSERT INTO tarefas (descricao) VALUE (?)`,
              tarefa);

              const novaTarefa = {
                      id: result.lastInsertRowId,
                      descricao: tarefa
              };

              setLista( previaLista => [...previaLista, novaTarefa])

            try {
            
        } catch (error) {
            console.error('erros ao carregar', error)
        }

    }

    const removerTarefa = async (index) =>{

        const novaLista = lista.filter((_,i)=> i !== index);
        setLista(novaLista);
        salvarTarefas(novaLista);
    }



    return(
        <View style={styles.container}>

            <StatusBar style="auto"/>

        <Text style={styles.titulo}>Lista de Tarefas</Text>
        <TextInput
        style={styles.input} 
        placeholder="Digite a tarefa"
        value={tarefa}
        onChangeText={setTarefa}


        />

        <TouchableOpacity style={styles.botao} onPress={adicionarTarefa}>
            <Text style={styles.botao_texto}>Adicionar</Text>
        </TouchableOpacity>

        <FlatList
        data={lista}
        keyExtractor={(item, index) => index.toString ()}
        renderItem={({ item,index }) => (

            <View style={styles.item}>
                <Text>{item}</Text>
                <TouchableOpacity onPress={() =>removerTarefa(index)}>
                    <Text>❌</Text>
                </TouchableOpacity>
            </View>

              )

        
        }
        />
      </View>
    );

}

export default ListaTarefas


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