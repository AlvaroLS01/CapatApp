import React, { useState } from "react";
import {
  Image,
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase-config'; // Asegúrate de que esta ruta es correcta

// Importación de la imagen local
import icon from '../assets/profileUser.png'; // Ajusta la ruta según la estructura de tu proyecto

const uri = "https://fotografias.lasexta.com/clipping/cmsimages01/2023/06/06/CE42797A-10B4-4B14-AE61-0E8D4208A5DB/semana-santa-festividades-catolicas-mas-sagradas-cristianos_96.jpg";

const app = initializeApp(firebaseConfig); // Inicializa Firebase
const auth = getAuth(app);

export default function Autenticacion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleCreateAccount = () => {
        navigation.navigate('DatosUsuario'); // Navegar a la pantalla principal después de la creación de la cuenta

  }

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Inicio de sesión exitoso
        console.log('Signed in!');
        const user = userCredential.user;
        navigation.navigate('MainScreen'); // Navegar a la pantalla principal después del inicio de sesión
      })
      .catch(error => {
        console.error(error);
        let errorMessage = '';
        switch (error.code) {
          case 'auth/invalid-credential':
            errorMessage = 'Contraseña incorrecta o correo no registrado (pulsa en "Crear Cuenta" para registrarte). Por favor, intenta nuevamente.';
            break;
          default:
            errorMessage = 'Ha ocurrido un error al intentar iniciar sesión. Por favor, intenta nuevamente.';
        }
        Alert.alert("Error al iniciar sesión", errorMessage);
      });
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={[styles.image, StyleSheet.absoluteFill]} />
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <BlurView intensity={90}>
          <View style={styles.login}>
            <Image
              source={icon} // Utiliza la imagen importada aquí
              style={styles.profilePicture}
            />
            <View>
            <Text style={styles.welcomeText}>¡Bienvenid@!</Text>
              <Text style={{fontSize:17, fontWeight:'400', color: 'white'}}>E-mail</Text>
              <TextInput onChangeText={(text) => setEmail(text)} style={styles.input} placeholder="E-mail" keyboardType="email-address"/>
            </View>
            <View>
              <Text style={{fontSize:17, fontWeight:'400', color: 'white'}}>Password</Text>
              <TextInput onChangeText={(text) => setPassword(text)} style={styles.input} placeholder="Password" secureTextEntry={true} />
            </View>
            <TouchableOpacity onPress={handleSignIn} style={styles.buttoninicio}>
                <Text style={{color: 'white', fontSize: 17, fontWeight:'400'}}>Iniciar Sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCreateAccount} style={styles.buttoncrear}>
                <Text style={{color: 'white', fontSize: 17, fontWeight:'400'}}>Crear Cuenta</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  login: {
    width: 350,
    height: 500,
    borderColor: "#FFF",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderColor: "#FFF",
    borderWidth: 1,
    marginVertical: 10,
  },
  input: {
    width: 250,
    height: 40,
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#ffffff90",
    marginBottom: 20,
  },
    buttoninicio: {
        width: 250,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#000CFEB90",
        justifyContent: "center",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
        borderColor: "#FFF",
        borderWidth: 1,
    },
    buttoncrear: {
        width: 250,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#6792F090",
        justifyContent: "center",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
        borderColor: "#FFF",
        borderWidth: 1,
    },
    welcomeText: {
      fontSize: 40, // Puedes ajustar el tamaño según tus necesidades
      fontStyle: 'italic', // Esto hace que el texto sea en cursiva
      color: 'white', // Ajusta el color según prefieras
      textAlign: 'center', // Esto centrará el texto
      marginBottom: 25, // Espacio debajo del texto para separarlo de los elementos que siguen
    },
    
});
