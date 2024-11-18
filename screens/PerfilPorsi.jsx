import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground, Alert, Linking } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [hermandad, setHermandad] = useState(null);

  const auth = getAuth();
  const db = getFirestore();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "usuarios", auth.currentUser.email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUsuario(userSnap.data());
          const hermandadRef = doc(db, "hermandades", userSnap.data().hermandadFavorita);
          const hermandadSnap = await getDoc(hermandadRef);

          if (hermandadSnap.exists()) {
            setHermandad(hermandadSnap.data());
          }
        } else {
          console.log("No se encontraron datos del usuario.");
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Autenticacion');
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

const handlePressImage = async (url) => {
    try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert('Error', `No se puede abrir este enlace: ${url}`);
        }
    } catch (error) {
        Alert.alert('Error', 'Ocurrió un error al intentar abrir el enlace.');
    }
};

  return (
    <ImageBackground source={require('../assets/wallpaper/fondo.jpg')} style={styles.container}>
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Tus datos</Text>
        {usuario && (
          <View style={styles.userInfoContainer}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Nombre:</Text>
              <Text style={styles.info}>{usuario.nombre} {usuario.apellido}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Teléfono:</Text>
              <Text style={styles.info}>{usuario.telefono}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Localidad:</Text>
              <Text style={styles.info}>{usuario.localidad}</Text>
            </View>
            {hermandad && (
              <View style={styles.hermandadContainer}>
                <Text style={styles.infoLabel}>Hermandad Favorita:</Text>
                <Text style={styles.info}>{hermandad.nombre}</Text>
                <Image source={{ uri: hermandad.photo }} style={styles.hermandadImage} />
              </View>
            )}
          </View>
        )}
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Salir</Text>
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.socialMediaContainer}>
      <TouchableOpacity onPress={() => handlePressImage('https://instagram.com')}>
        <Image source={require('../assets/icons/instagram.png')} style={styles.socialIcon} />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => handlePressImage('https://facebook.com')}>
        <Image source={require('../assets/icons/facebook.png')} style={styles.socialIcon} />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => handlePressImage('https://twitter.com/TWCapatApp')}>
        <Image source={require('../assets/icons/twitter.png')} style={styles.socialIcon} />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => handlePressImage('https://www.linkedin.com/in/%C3%A1lvaro-lechuga-s%C3%A1nchez-571033272/')}>
        <Image source={require('../assets/icons/linkedin.png')} style={styles.socialIcon} />
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400, // Ajusta este valor según el diseño que buscas
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
    textAlign: 'center',
  },
  userInfoContainer: {
    marginBottom: 20,
  },
  infoBlock: {
    marginBottom: 10,
  },
  info: {
    fontSize: 20,
  },
  infoLabel: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 4,
  },
  hermandadContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  hermandadImage: {
    width: 160,
    height: 160,
    borderRadius: 100,
    marginTop: 10,
    borderWidth: 3,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    marginHorizontal: 50,
    borderRadius: 5,
    marginTop: 15, // Asegura espacio entre el botón y el resto del contenido
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%', // Asegura que el ImageBackground cubra toda la pantalla
    height: '100%', // Asegura que el ImageBackground cubra toda la pantalla
  },
  socialMediaContainer: {
    flexDirection: 'row', // Organiza las imágenes de redes sociales en una fila
    justifyContent: 'space-around', // Distribuye el espacio uniformemente entre las imágenes
    marginTop: 10,
    marginBottom:20, // Espacio encima del contenedor de las redes sociales
    width: '100%', // Asegura que el contenedor use todo el ancho disponible
  },
  
  socialIcon: {
    width: 50, // Ancho de la imagen
    height: 50, // Altura de la imagen
  },
  
});

export default Perfil;
