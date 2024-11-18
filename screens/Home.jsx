import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase-config';

const screenWidth = Dimensions.get('window').width;

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [leyendas, setLeyendas] = useState([]);
  const [curiosidades, setCuriosidades] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const carouselItems = [
    { source: require('../assets/carrusell/carrusell1.jpg') },
    { source: require('../assets/carrusell/carrusell2.jpg') },
    { source: require('../assets/carrusell/carrusell3.jpg') },
    { source: require('../assets/carrusell/carrusell4.jpg') },
    { source: require('../assets/carrusell/carrusell5.png') },
    { source: require('../assets/carrusell/carrusell6.jpg') },
    { source: require('../assets/carrusell/carrusell7.jpeg') }
  ];

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?q=Sevilla&appid=6ea1d90e24785d711ff9bf031d3d4488&units=metric&lang=es');
        setWeather(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchLeyendas = async () => {
      const querySnapshot = await getDocs(collection(firestore, "leyendas"));
      const leyendasArray = [];
      querySnapshot.forEach((doc) => {
        leyendasArray.push(doc.data().leyenda);
      });
      setLeyendas(leyendasArray);
    };

    const fetchCuriosidades = async () => {
      const querySnapshot = await getDocs(collection(firestore, "curiosidades"));
      const curiosidadesArray = [];
      querySnapshot.forEach((doc) => {
        curiosidadesArray.push(doc.data().curiosidad);
      });
      setCuriosidades(curiosidadesArray);
    };

    fetchWeather();
    fetchLeyendas();
    fetchCuriosidades();

    const imageChangeInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 10000); // Cambia cada 10 segundos

    return () => clearInterval(imageChangeInterval);
  }, []);

  const mostrarLeyendaAleatoria = () => {
    const aleatorio = Math.floor(Math.random() * leyendas.length);
    Alert.alert("Leyenda", leyendas[aleatorio] || "No hay leyendas disponibles");
  };

  const mostrarCuriosidadAleatoria = () => {
    const aleatorio = Math.floor(Math.random() * curiosidades.length);
    Alert.alert("Dato Curioso", curiosidades[aleatorio] || "No hay datos curiosos disponibles");
  };

  const getBackgroundImage = (main) => {
    switch (main) {
      case 'Clear':
        return require('../assets/weather/sunny.jpg');
      case 'Clouds':
        return require('../assets/weather/cloud.jpg');
      case 'Rain':
        return require('../assets/weather/rain.gif');
      default:
        return require('../assets/weather/sunny.jpg');
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <ImageBackground source={require('../assets/wallpaper/fondo.jpg')} style={styles.imageBackground}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.mainContainer}>
          <View style={styles.card}>
            <ImageBackground
              source={weather ? getBackgroundImage(weather.weather[0].main) : require('../assets/weather/sunny.jpg')}
              style={styles.backgroundImage}
            >
              <Text style={styles.tempText}>{Math.round(weather?.main.temp)}ºC</Text>
              <Text style={styles.timeText}>{getCurrentTime()}</Text>
              <View style={styles.textContent}>
                {weather && (
                  <>
                    <Text style={[styles.subTitle, { alignSelf: 'center' }]}>Tiempo previsto en:</Text>
                    <Text style={[styles.title, { alignSelf: 'center' }]}>{weather.name}</Text>
                    <Text style={[styles.text, { alignSelf: 'center' }]}>Apreciamos {weather.weather[0].description}</Text>
                  </>
                )}
              </View>
            </ImageBackground>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={mostrarLeyendaAleatoria}>
              <Text style={styles.buttonText}>Cuéntame una leyenda</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={mostrarCuriosidadAleatoria}>
              <Text style={styles.buttonText}>Dato curioso</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Gracias por elegir CapatApp. Estamos comprometidos a brindarle la mejor experiencia posible. Si encuentra algún fallo o tiene sugerencias, estamos aquí para ayudar. ¡Que tenga una feliz Semana Santa!</Text>
          
          <Text style={styles.title}>Imágenes Históricas</Text>
          <View style={styles.carouselContainer}>
            <Image source={carouselItems[currentImageIndex].source} style={styles.carouselImage} />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  container: {
    paddingBottom: 20,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  card: {
    margin: 20,
    width: screenWidth - 40,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.3,
    borderColor: '#00000040',
    borderWidth: 1,
  },
  backgroundImage: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  tempText: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontWeight: 'bold',
    fontSize: 25,
    color: 'white',
  },
  timeText: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontWeight: 'bold',
    fontSize: 25,
    color: 'white',
  },
  textContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 5,
    padding: 10,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  text: {
    fontSize: 14,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    width: screenWidth - 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  carouselImage: {
    width: screenWidth - 60,
    height: 200,
    borderRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    padding: 20,
    fontStyle: "italic", // Usa fontStyle para itálica
    marginVertical: 5,
    textAlign: "center",
  }
});
