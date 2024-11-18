import React, { useEffect, useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, Image, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { Audio } from 'expo-av';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '../firebase-config'; // Asegúrate de que esta ruta sea correcta

// Importa tus archivos de audio locales
import Eternidad from '../assets/bandas/Eternidad.mp3';
import ElAmor from '../assets/bandas/El_Amor.mp3';
import Asi_Sea from '../assets/bandas/Asi_Sea.mp3';
import Cristo_Del_Amor from '../assets/bandas/Cristo_Del_Amor.mp3';
import La_Esperanza_De_Maria from '../assets/bandas/La_Esperanza_De_Maria.mp3';
import La_Fe from '../assets/bandas/La_Fe.mp3';
import La_Misericordia_Del_Padre from '../assets/bandas/La_Misericordia_Del_Padre.mp3';
import Medea from '../assets/bandas/Medea.mp3';
import Mi_Amargura from '../assets/bandas/Mi_Amargura.mp3';
import Pasan_Los_Campanilleros from '../assets/bandas/Pasan_Los_Campanilleros.mp3';
import Salud_Para_Los_Enfermos from '../assets/bandas/Salud_Para_Los_Enfermos.mp3';
import Tu_Dulce_Rostro_Cautivo from '../assets/bandas/Tu_Dulce_Rostro_Cautivo.mp3';
import Un_Solo_Dios from '../assets/bandas/Un_Solo_Dios.mp3';
import V_Estacion from '../assets/bandas/V_Estacion.mp3';
import Vida from '../assets/bandas/Vida.mp3';
import Yo_Soy_La_Verdad from '../assets/bandas/Yo_Soy_La_Verdad.mp3';
import A_Esta_Es from '../assets/bandas/A_Esta_Es.mp3';
import A_Los_Pies_De_Sor_Angela from '../assets/bandas/A_Los_Pies_De_Sor_Angela.mp3';
import Alma_De_Dios from '../assets/bandas/Alma_De_Dios.mp3';
import Consolacion_Y_Lagrimas from '../assets/bandas/Consolacion_Y_Lagrimas.mp3';
import La_Lanzada from '../assets/bandas/La_Lanzada.mp3';
import La_Milagrosa from '../assets/bandas/La_Milagrosa.mp3';
import Silencio from '../assets/bandas/Silencio.mp3';
import Virgen_De_La_Paz from '../assets/bandas/Virgen_De_La_Paz.mp3';
import Pescador_De_Hombres from '../assets/bandas/Pescador_De_Hombres.mp3';
import Otra_Vez_Lo_Vi_Pasar from '../assets/bandas/Otra_Vez_Lo_Vi_Pasar.mp3';
import Oracion from '../assets/bandas/Oracion.mp3';
import Nazareno_De_La_Salud from '../assets/bandas/Nazareno_De_La_Salud.mp3';
import El_Desprecio_De_Herodes from '../assets/bandas/El_Desprecio_De_Herodes.mp3';
import Al_Cielo_La_Reina_De_Triana from '../assets/bandas/Al_Cielo_La_Reina_De_Triana.mp3';
import Ahi_Queo from '../assets/bandas/Ahi_Queo.mp3';
import El_Embrujo_De_Triana from '../assets/bandas/El_Embrujo_De_Triana.mp3';
import La_Saeta from '../assets/bandas/La_Saeta.mp3';
import Mi_Madruga from '../assets/bandas/Mi_Madruga.mp3';
import Reina_De_Reyes from '../assets/bandas/Reina_De_Reyes.mp3';
import Silencio_Blanco from '../assets/bandas/Silencio_Blanco.mp3';

// Imágenes para los botones
import playIcon from '../assets/icons/start.png';
import stopIcon from '../assets/icons/stop.png';
import searchIcon from '../assets/icons/search.png'; // Asegúrate de que esta ruta sea correcta


// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Marchas = () => {
  const [bands, setBands] = useState([]);
  const [filteredBands, setFilteredBands] = useState([]);
  const [search, setSearch] = useState('');
  const [isPlaying, setIsPlaying] = useState(null); // Identificador de la banda que se está reproduciendo
  const sound = useRef(new Audio.Sound());

  useEffect(() => {
    const fetchBands = async () => {
      const querySnapshot = await getDocs(collection(db, 'bandas'));
      const bandsArray = querySnapshot.docs.map(doc => {
        let audioFile;
        switch (doc.data().nombre) {
          case 'Eternidad':
            audioFile = Eternidad;
            break;
          case 'El Amor':
            audioFile = ElAmor;
            break;
          case 'Así Sea':
            audioFile = Asi_Sea;
            break;
          case 'Cristo Del Amor':
            audioFile = Cristo_Del_Amor;
            break;
          case 'La Esperanza De María':
            audioFile = La_Esperanza_De_Maria;
            break;
          case 'La Fe':
            audioFile = La_Fe;
            break;
          case 'La Misericordia Del Padre':
            audioFile = La_Misericordia_Del_Padre;
            break;
          case 'Medea':
            audioFile = Medea;
            break;
          case 'Mi Amargura':
            audioFile = Mi_Amargura;
            break;
          case 'Pasan Los Campanilleros':
            audioFile = Pasan_Los_Campanilleros;
            break;
          case 'Salud Para Los Enfermos':
            audioFile = Salud_Para_Los_Enfermos;
            break;
          case 'Tu Dulce Rostro Cautivo':
            audioFile = Tu_Dulce_Rostro_Cautivo;
            break;
          case 'Un Solo Dios':
            audioFile = Un_Solo_Dios;
            break;
          case 'V Estación':
            audioFile = V_Estacion;
            break;
          case 'Vida':
            audioFile = Vida;
            break;
          case 'Yo Soy La Verdad':
            audioFile = Yo_Soy_La_Verdad;
            break;
          case 'A Esta Es':
            audioFile = A_Esta_Es;
            break;
          case 'A Los Pies De Sor Ángela':
            audioFile = A_Los_Pies_De_Sor_Angela;
            break;
          case 'Alma De Dios':
            audioFile = Alma_De_Dios;
            break;
          case 'Consolación Y Lágrimas':
            audioFile = Consolacion_Y_Lagrimas;
            break;
          case 'La Lanzada':
            audioFile = La_Lanzada;
            break;
          case 'La Milagrosa':
            audioFile = La_Milagrosa;
            break;
          case 'Silencio':
            audioFile = Silencio;
            break;
          case 'Virgen De La Paz':
            audioFile = Virgen_De_La_Paz;
            break;
          case 'Pescador De Hombres':
            audioFile = Pescador_De_Hombres;
            break;
          case 'Otra Vez Lo Vi Pasar':
            audioFile = Otra_Vez_Lo_Vi_Pasar;
            break;
          case 'Oración':
            audioFile = Oracion;
            break;
          case 'Nazareno De La Salud':
            audioFile = Nazareno_De_La_Salud;
            break;
          case 'El Desprecio De Herodes':
            audioFile = El_Desprecio_De_Herodes;
            break;
          case 'Al Cielo Reina De Triana':
            audioFile = Al_Cielo_La_Reina_De_Triana;
            break;
          case 'Ahí Quedó':
            audioFile = Ahi_Queo;
            break;
          case 'El Embrujo De Triana':
            audioFile = El_Embrujo_De_Triana;
            break;
          case 'La Saeta':
            audioFile = La_Saeta;
            break;
          case 'Mi Madruga':
            audioFile = Mi_Madruga;
            break;
          case 'Reina De Reyes':
            audioFile = Reina_De_Reyes;
            break;
          case 'Silencio Blanco':
            audioFile = Silencio_Blanco;
            break;

            
          default:
            audioFile = null;
        }
        return { id: doc.id, audioFile, ...doc.data() };
      });
      setBands(bandsArray);
      setFilteredBands(bandsArray);
    };
    fetchBands();
  }, []);

  useEffect(() => {
    const result = bands.filter(band =>
      band.nombre.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredBands(result);
  }, [search, bands]);

  const togglePlaySound = async (audioFile, bandId) => {
    const status = await sound.current.getStatusAsync();
    if (isPlaying === bandId && status.isLoaded && status.isPlaying) {
      await sound.current.stopAsync();
      setIsPlaying(null);
    } else {
      try {
        await sound.current.unloadAsync();
        await sound.current.loadAsync(audioFile);
        await sound.current.playAsync();
        setIsPlaying(bandId);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <ImageBackground source={require("../assets/wallpaper/fondo.jpg")} style={styles.fullScreen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
      >
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Image source={require("../assets/icons/search.png")} style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Buscar marcha..."
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#a0a0a0"
            />
          </View>
          <ScrollView style={styles.scrollView}>
            {filteredBands.map((band) => (
              <Card key={band.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Image source={require("../assets/icons/musica.png")} style={styles.largeIcon} />
                  <Text style={styles.cardTitle}>{band.nombre}</Text>
                  <TouchableOpacity onPress={() => band.audioFile && togglePlaySound(band.audioFile, band.id)} style={styles.iconButton}>
                    <Image source={isPlaying === band.id ? playIcon : stopIcon} style={styles.icon} />
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
  
};

const styles = StyleSheet.create({
  fullScreen: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  searchIcon: {
    width: 30, // Tamaño más grande para el ícono
    height: 30, // Tamaño más grande para el ícono
    marginRight: 10, // Espacio entre el ícono de búsqueda y el campo de texto
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Asegura que el fondo coincida con el contenedor
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginHorizontal: 10,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  icon: {
    width: 24,
    height: 24,
    opacity: 0.5,
  },
  largeIcon: {
    width: 40,
    height: 40,
    opacity: 0.5,
  },
});




export default Marchas;