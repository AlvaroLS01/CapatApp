import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase-config';

const uri = "https://fotografias.lasexta.com/clipping/cmsimages01/2023/06/06/CE42797A-10B4-4B14-AE61-0E8D4208A5DB/semana-santa-festividades-catolicas-mas-sagradas-cristianos_96.jpg";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();

const DatosUsuario = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [hermandadFavorita, setHermandadFavorita] = useState('');
  const [hermandades, setHermandades] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

    // Referencias a los inputs para manejar el foco
  const passwordInputRef = useRef(null);
  const nombreInputRef = useRef(null);
  const apellidoInputRef = useRef(null);
  const telefonoInputRef = useRef(null);
  const localidadInputRef = useRef(null);

  useEffect(() => {
    const fetchHermandades = async () => {
      const querySnapshot = await getDocs(collection(db, "hermandades"));
      const hermandadesArray = [];
      querySnapshot.forEach((doc) => {
        hermandadesArray.push({ id: doc.id, ...doc.data() });
      });
      setHermandades(hermandadesArray);
    };

    fetchHermandades();
  }, []);

  const handleGuardar = async () => {
    try {
      await setDoc(doc(db, "usuarios", auth.currentUser.email), {
        email,
        nombre,
        apellido,
        telefono,
        localidad,
        hermandadFavorita,
      });
      console.log("Datos del usuario guardados con éxito");
      navigation.navigate("MainScreen"); // Asumiendo que quieras navegar al MainScreen después
    } catch (error) {
      console.error("Error guardando los datos del usuario: ", error);
    }
  };

  const handleCreateAccountAndSave = () => {
    // Verifica si alguno de los campos está vacío
    if (!email.trim() || !password.trim() || !nombre.trim() || !apellido.trim() || !telefono.trim() || !localidad.trim() || !hermandadFavorita.trim()) {
        Alert.alert("Campos requeridos", "Todos los campos son obligatorios.");
        return; // Detiene la ejecución si alguno está vacío
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Cuenta creada exitosamente
        console.log("Account created!", userCredential);
        handleGuardar(); // Guarda los datos después de crear la cuenta
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Error al crear la cuenta", error.message);
      });
};


  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={[styles.image, StyleSheet.absoluteFill]} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BlurView intensity={90} style={styles.blurView}>
          <ScrollView contentContainerStyle={styles.innerScrollContent}>
            <Text style={styles.title}>¡Completa tu perfil!</Text>

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              placeholder="E-mail"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current.focus()} // Mueve el foco al siguiente input
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              ref={passwordInputRef}
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry={true}
              returnKeyType="next"
              onSubmitEditing={() => nombreInputRef.current.focus()} // Mueve el foco al siguiente input
            />

            {/* Repite este patrón para los demás TextInput */}

            <Text style={styles.label}>Nombre</Text>
            <TextInput
              ref={nombreInputRef}
              style={styles.input}
              onChangeText={setNombre}
              value={nombre}
              placeholder="Introduce tu nombre"
              returnKeyType="next"
              onSubmitEditing={() => apellidoInputRef.current.focus()}
            />

            <Text style={styles.label}>Apellidos</Text>
            <TextInput
              ref={apellidoInputRef}
              style={styles.input}
              onChangeText={setApellido}
              value={apellido}
              placeholder="Introduce tus apellidos"
              returnKeyType="next"
              onSubmitEditing={() => telefonoInputRef.current.focus()}
            />

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              ref={telefonoInputRef}
              style={styles.input}
              onChangeText={setTelefono}
              value={telefono}
              placeholder="Introduce tu teléfono"
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => localidadInputRef.current.focus()}
            />

            <Text style={styles.label}>Localidad</Text>
            <TextInput
              ref={localidadInputRef}
              style={styles.input}
              onChangeText={setLocalidad}
              value={localidad}
              placeholder="Introduce tu localidad"
              returnKeyType="done" // Este es el último input, así que usamos "done"
            />

            <Text style={styles.label}>Hermandad Favorita</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setModalVisible(true)}
            >
              <Text>
                {hermandadFavorita
                  ? hermandades.find((h) => h.id === hermandadFavorita)?.nombre
                  : "Selecciona una hermandad"}
              </Text>
            </TouchableOpacity>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(!modalVisible)}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <FlatList
                    data={hermandades}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.hermandadItem}
                        onPress={() => {
                          setHermandadFavorita(item.id);
                          setModalVisible(!modalVisible);
                        }}
                      >
                        <Image
                          source={{ uri: item.photo }}
                          style={styles.hermandadImage}
                        />
                        <Text style={styles.hermandadTexto}>{item.nombre}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            </Modal>

            <TouchableOpacity
              onPress={handleCreateAccountAndSave}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          </ScrollView>
        </BlurView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  scrollContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  blurView: {
    width: 350,
    height: 600, // Ajuste según sea necesario
    alignItems: "center",
    borderRadius: 20,
    borderColor: "#ffffff",
    borderWidth: 1.5,
    overflow: "hidden", // Asegura que el blur se aplique dentro de los bordes
    padding: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  label: {
    alignSelf: "flex-start",
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#ffffff90",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: "100%",
    backgroundColor: "#6792F090",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  hermandadItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 2,
  },
  hermandadImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  hermandadTexto: {
    fontSize: 18,
  },
  innerScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DatosUsuario;
