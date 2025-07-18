import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Keyboard, PermissionsAndroid, Modal, TouchableWithoutFeedback } from 'react-native';
import { DataService } from '../data/DataService';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { apiInstance } from '../middleware/Interceptor';
import { TokenStorage } from '../auth/TokenStorage';
import { API_BASE_URL } from '../middleware/Interceptor';
import { AsyncService } from '../data/AsyncService';
import { AuthService } from '../auth/AuthService';
import { useNavigation } from '@react-navigation/native';
import { DefaultNavigationProp } from '../navigation/NavigationTypes';
import RNBlobUtil from 'react-native-blob-util'
import { MaskedTextInput } from 'react-native-advanced-input-mask';
import { useCallback } from 'react';
import { RefreshControl } from 'react-native';


interface UserProfileData {
    usuario_id: number;
    nome: string;
    altura: string;
    peso: string;
    sexo: "M" | "F";
    data_nascimento: string;
    email: string;
    username: string;
    avatar_url: string;
    email_confirmado: boolean;
}

const ProfileScreen = () => {
  // Dados de exemplo (você substituiria pelos dados reais do usuário)
    const navigation = useNavigation<DefaultNavigationProp>();

    const [userDataa, setUserData] = useState<UserProfileData | null>(null);


    

    const [togglePeso, setTogglePeso] = useState<boolean>(false);
    const [peso, setPeso] = useState<any>("");


    const fetchAndSetUserData = async () => {
      try {
        const dados = await DataService.GetData();
        if (dados) { // Verifica se os dados foram realmente retornados
            //monta o URL final do profilepic
            const userProfile = dados.data;
            const baseUrl = API_BASE_URL;
            const fullAvatarUrl = userProfile.avatar_url ? `${baseUrl}${userProfile.avatar_url}` : null;
          
            setEmailConfirmado(userProfile.email_confirmado);
          setPeso(dados.data.peso);
          setUserData({
            ...dados.data,
            avatar_url: fullAvatarUrl
          }); // Armazena os dados no estado
          
        }
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
        setUserData(null); // Garante que os dados estejam limpos em caso de erro
      } 
    };

    useEffect(() => {
    fetchAndSetUserData(); // Chama a função para buscar os dados
  }, []); // Array de dependências vazio: executa apenas na montagem

  const handleEditProfile = () => {
    navigation.replace("FirstAccess");
  };

    const handleReenvio = async () => {
      await AuthService.ReenvioEmailConfirmacao();
      Alert.alert('E-mail de confirmação reenviado');
    };

  const handleSettings = () => {
    Alert.alert("Configurações", "Navegar para a tela de configurações.");
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Confirmar logout?",
    [
      {
        text: "Cancelar",
        onPress: () => console.log("Logout cancelado."),
        style: "cancel"
      },
      {
        text: "Sim, fazer logout",
        onPress: () => {
          AuthService.Logout();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
      }
    ]
    );
  };

  const formatAltura = (altura: string): string => {
    const alturaCm = parseFloat(altura);

    const alturaMetros = alturaCm / 100;

    return alturaMetros.toFixed(2)
  }

  const formatPeso = (peso: string): string => {
    const pesokg = parseFloat(peso);

    return pesokg.toFixed(0)
  }

  const uploadImage = async (imageUri: string) => {

  const filename = imageUri.split('/').pop() ?? `profile_${Date.now()}.jpg`;
  

  try {
    await AuthService.RefreshTokens();
    const token = await TokenStorage.getToken("myAccessToken");
    const response = await RNBlobUtil.fetch('POST', `${API_BASE_URL}/api/profile/avatar`, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    }, [
      {
        name: 'avatar',
        filename: filename,
        type: 'image/jpeg',
        data: RNBlobUtil.wrap(imageUri.replace('file://', '')), // remove "file://"
      },
    ]);

    fetchAndSetUserData();

    const data = JSON.parse(response.data);
    console.log("Upload concluído:", data);
  } catch (error: any) {
    console.error("Erro no upload:", error);
    Alert.alert("Erro", error?.message ?? "Erro inesperado");
  } 
};


  const handleDeletePhoto = async () => {
    try{
      const response = await apiInstance.delete('/profile/avatar');
      fetchAndSetUserData();
      console.log(response)
    } catch (error) {
      console.warn(error);
    }
  }

  const handleEditPhoto = async (modo: string) => {
    console.log("Tentando selecionar imagem");
    try{

        const response = modo === "camera" 
        ? await launchCamera({mediaType: 'photo'}) 
        : await launchImageLibrary({mediaType: 'photo'});

        //const response = await launchImageLibrary({mediaType: 'photo'});
        console.log("Resposta:", response);
    
            if (response.didCancel) {
                console.log("Seleção de imagem cancelada");
            } else if (response.errorMessage) {
                console.error("Erro ao selecionar imagem: ", response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const selectedAsset = response.assets[0];
                console.log(selectedAsset)
                if (selectedAsset.uri) {
                    //chamar função de upload
                    try {
                        console.log("Enviando imagem para o handler...")
                        await uploadImage(selectedAsset.uri);
                    } catch (uploadError) {
                        console.error("Erro ao fazer upload da imagem:", uploadError);
                    }
                }
            }
        

    } catch (error) {
        console.log("Erro ao selecionar imagem:", error);
    }
  }

  const [togglePic, setTogglePic] = useState<boolean>(false);
  const [emailConfirmado, setEmailConfirmado] = useState<boolean>(false);

  const handleEditPeso = async () => {
    if (togglePeso) {
      console.log("Enviando dados...");
      const asyncData = await AsyncService.GetData();
      const newData = {
        ...asyncData,
        peso: Number(peso.replace("kg", ""))
      }
      setTogglePeso(!togglePeso)
      await AsyncService.InsertData(newData)
      await DataService.SendData(newData)

      console.log("Dados enviados com sucesso!");
    } else {
      setTogglePeso(!togglePeso)
    }
    
  }
  

  const onChangePesoTeste = useCallback((formatted: string, extracted: string) => {
          setPeso(formatted);
          console.log(formatted)
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  <ScrollView style={styles.container}
              refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => fetchAndSetUserData()}
                        colors={['#007bff']}
                        tintColor="#007bff"
                      />
                    }
  >
    {userDataa ? (
      <>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setTogglePic(!togglePic)}>
            <Image source={{ uri: userDataa.avatar_url }} style={styles.avatar} />
          </TouchableOpacity>

          <Text style={styles.userName}>{userDataa.nome}</Text>
          <Text style={styles.userEmail}>{userDataa.email}</Text>

          <View style={{flexDirection: "row"}}>
              <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <Text style={styles.editButtonText}>Editar Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.editButton} onPress={() => handleEditPeso()}>
                <Text style={styles.editButtonText}>Alterar Peso</Text>
              </TouchableOpacity>
          </View>
          

          {!emailConfirmado && (
            <TouchableOpacity onPress={handleReenvio}>
              <Text style={styles.resendText}>Reenviar email de confirmação</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Modal para edição de foto */}
        <Modal visible={togglePic} transparent animationType="fade" onRequestClose={() => setTogglePic(false)}>
          <TouchableWithoutFeedback onPress={() => setTogglePic(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Image source={{ uri: userDataa.avatar_url }} style={styles.avatar} />
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.photoOption} onPress={() => handleEditPhoto("camera")}>
                    <Text style={styles.photoOptionText}>📷 Tirar foto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.photoOption} onPress={() => handleEditPhoto("galeria")}>
                    <Text style={styles.photoOptionText}>🖼️ Escolher da galeria</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.photoOption} onPress={handleDeletePhoto}>
                    <Text style={[styles.photoOptionText, { color: "#e15759" }]}>🗑️ Remover foto</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Informações pessoais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Altura:</Text>
            <Text style={styles.infoValue}>{formatAltura(userDataa.altura)} cm</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Peso:</Text>
            {togglePeso 
            ? 
            <MaskedTextInput
                            style={{backgroundColor: "black"}}
                            autoSkip={true}
                            autocomplete={true}
                            mask="[900].[00] kg"
                            placeholder={`${formatPeso(userDataa.peso)} kg`}
                            keyboardType='number-pad'
                            value={peso}
                            onChangeText={onChangePesoTeste}
                            onSubmitEditing={() => handleEditPeso()}
            ></MaskedTextInput>
            : 
            <Text style={styles.infoValue}>{formatPeso(peso)} kg</Text>
            }
            
            
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gênero:</Text>
            <Text style={styles.infoValue}>
              {userDataa.sexo === "M" ? "Masculino" : "Feminino"}
            </Text>
          </View>
        </View>

        {/* Ações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações e Ações</Text>
          <TouchableOpacity style={styles.actionButton} onPress={handleSettings}>
            <Text style={styles.actionButtonText}>Configurações da Conta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Notificações</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Privacidade</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </>
    ) : (
      <Text style={styles.noDataText}>Dados do perfil não disponíveis</Text>
    )}
    <View style={{ height: 80 }} />
  </ScrollView>
</TouchableWithoutFeedback>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d3d6db', // Um fundo claro e suave
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#be3144',
    borderWidth: 3,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#be3144',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    paddingVertical: 20,
  },
  actionButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    marginTop: 15,
    borderBottomWidth: 0, // Remover borda inferior para o último botão
    backgroundColor: '#e157591A', // Fundo levemente vermelho para destaque
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  logoutButtonText: {
    color: '#e15759', // Texto vermelho
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resendText: {
  marginTop: 10,
  color: '#be3144',
  fontSize: 14,
  textDecorationLine: 'underline',
},

modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},

modalContent: {
  backgroundColor: '#fff',
  borderRadius: 20,
  padding: 20,
  alignItems: 'center',
  width: '100%',
  maxWidth: 350,
},

modalButtons: {
  marginTop: 20,
  width: '100%',
},

photoOption: {
  backgroundColor: '#e9f5ff',
  borderRadius: 50,
  paddingVertical: 10,
  paddingHorizontal: 15,
  marginVertical: 5,
  alignItems: 'center',
},

photoOptionText: {
  color: '#3a4750',
  fontWeight: '600',
},
});

export default ProfileScreen;