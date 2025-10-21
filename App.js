import React, { useState, useEffect } from 'react';
import Grafico from './components/Grafico';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Alert,
  Button,
} from 'react-native';

import * as Database from './services/Database';
import Formulario from './components/Formulario';
import ListaRegistros from './components/ListaRegistros';
import * as Sharing from 'expo-sharing';

export default function App() {
  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [registroEmEdicao, setRegistroEmEdicao] = useState(null);

  useEffect(() => {
    const init = async () => {
      const dados = await Database.carregarDados();
      setRegistros(dados);
      setCarregando(false);
      const handleIniciarEdicao = (registro) => {
      setRegistroEmEdicao(registro);
    };
      const handleCancelarEdicao = () => {
      setRegistroEmEdicao(null);
    };
    };
    init();
  }, []);

  useEffect(() => {
    if (!carregando) {
      Database.salvarDados(registros);
    }
  }, [registros, carregando]);

  const handleSave = (vezesEstressou, vezesDescansou) => {
    const estressouNum = parseFloat(String(vezesEstressou).replace(',', '.'));
    const descansouNum = parseFloat(String(vezesDescansou).replace(',', '.'));
    const celularNum = parseFloat(String(horasCelular).replace(',', '.'));
    
    
    if (aguaNum < 0 || exercicioNum < 0 || caloriasNum < 0) {
      return Alert.alert("Erro de Validação", "Nenhum valor pode ser negativo. Por favor, corrija.");
} 
    if (registroEmEdicao) {
      const registrosAtualizados = registros.map(reg =>
        reg.id === registroEmEdicao.id? { ...reg, estresse: estressouNum, descanso: descansouNum, celular:celularNum } : reg
      );
      setRegistros(registrosAtualizados);
     Alert.alert('Sucesso!', 'Seu registro foi salvo!');
    } else {
     const novoRegistro = { id: new Date().getTime(), data: new 
     Date().toLocaleDateString('pt-BR'), estresse: estressouNum, };
      setRegistros([registros, novoRegistro]);
     Alert.alert('Sucesso!', 'Registro salvo!');
    }
     setRegistroEmEdicao(null);
  };

  const handleDelete = (id) => {
    setRegistros(registros.filter(reg => reg.id !== id));
    Alert.alert('Sucesso!', 'O registro foi deletado.');
  };
  

  const handleIniciarEdicao = (registro) => {
    setEditingId(registro.id);
  };

  const handleCancelarEdicao = () => {
    setEditingId(null);
  };

  const exportarDados = async () => {
      const fileUri = Database.fileUri; // Usando a variável exportada se disponível, senão recriar
      if (Platform.OS === 'web') {
          const jsonString = JSON.stringify(registros, null, 2);
          if (registros.length === 0) { return Alert.alert("Aviso", "Nenhum dado para exportar."); }
          const blob = new Blob([jsonString], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = 'dados.json'; a.click();
          URL.revokeObjectURL(url);
      } else {
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          if (!fileInfo.exists) { return Alert.alert("Aviso", "Nenhum dado para exportar."); }
          if (!(await Sharing.isAvailableAsync())) { return Alert.alert("Erro", "Compartilhamento não disponível."); }
          await Sharing.shareAsync(fileUri);
      }
        
  };
const [ordenacao, setOrdenacao] = useState('recentes'); // valor inicial

  if (carregando) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#3498db" /></View>;
  }
let registrosExibidos = [...registros]; // Sempre trabalhe com uma cópia! 


if (ordenacao === 'maior_estresse') {
  registrosExibidos.sort((a, b) => b.estresse - a.estresse);
} else {
  registrosExibidos.sort((a, b) => b.id - a.id);
}

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.titulo}>My Mind </Text>
        <Text style={styles.subtituloApp}>App Componentizado</Text>
        <Grafico registros={registrosExibidos} />

        <Formulario 
          onSave={handleSave} 
          onCancel={handleCancelarEdicao}
          registroEmEdicao={registroEmEdicao}
        />

         <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10, gap: 10 }}>
         <Button title="Mais Recentes" onPress={() => setOrdenacao('recentes')} />
         <Button title="Maior Valor (Estresse)" onPress={() => setOrdenacao('maior_estresse')} />
         </View>

        <ListaRegistros registros={registrosExibidos}  
          registros={registrosExibidos}
          onEdit={handleIniciarEdicao}
          onDelete={handleDelete}
        />

        <View style={styles.card}>
            <Text style={styles.subtitulo}>Exportar "Banco de Dados"</Text>
            <TouchableOpacity style={styles.botaoExportar} onPress={exportarDados}>
                <Text style={styles.botaoTexto}>Exportar arquivo dados.json</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 25 : 0, backgroundColor: '#49cdd1' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#397173' },
  subtituloApp: { textAlign: 'center', fontSize: 16
  , color: '#216163', marginTop: -20, marginBottom: 20, fontStyle: 'italic' },
  card: { backgroundColor: '#b2f5f7', borderRadius: 20, padding: 15, marginHorizontal: 15, marginBottom: 20, elevation: 3 },
  subtitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#15595c' },
  botaoExportar: { backgroundColor: 'white', padding: 15, borderRadius: 20, alignItems: 'center', marginTop: 5 },
  botaoTexto: { color: '#2e8487', fontSize: 16, fontWeight: 'bold' },
});