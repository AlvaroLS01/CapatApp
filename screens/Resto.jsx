import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, Dimensions, Modal, TouchableOpacity } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase-config';
import axios from 'axios';

// Obtener el ancho de la pantalla del dispositivo
const screenWidth = Dimensions.get('window').width;

export default function Noticias() {
  const [weather, setWeather] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?q=Sevilla&appid=6ea1d90e24785d711ff9bf031d3d4488&units=metric&lang=es');
        setWeather(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWeather();

    const unsubscribe = onSnapshot(collection(firestore, "tweets"), (querySnapshot) => {
      const tweetsArray = [];
      querySnapshot.forEach((doc) => {
        tweetsArray.push({
          ...doc.data(),
          key: doc.id,
        });
      });
      setTweets(tweetsArray);
    });

    return () => unsubscribe();
  }, []);

  const getBackgroundImage = (main) => {
    switch(main) {
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

  const handleImageTouch = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  return (
    <ImageBackground source={require('../assets/wallpaper/fondo.jpg')} style={{ flex: 1 }}>
    <View style={{ flex: 1 }}>
      {/* Weather Card */}
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
                <Text style={[styles.text, { alignSelf: 'center' }]}>apreciamos {weather.weather[0].description}</Text>
              </>
            )}
          </View>
        </ImageBackground>
      </View>

      {/* Tweets List */}
      <FlatList
        data={tweets}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleImageTouch(item.link)}>
            <View style={styles.tweetCard}>
              <ImageBackground source={{ uri: item.link }} style={styles.tweetImage} resizeMode='contain'/>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.key}
      />

      {/* Image Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ImageBackground source={{ uri: selectedImage }} style={styles.fullSizeImage} resizeMode='contain'/>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 20,
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
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  textContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 5,
    padding: 10,
    position: 'relative',
  },
  subTitle: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  text: {
    fontSize: 14,
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
  tweetCard: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    borderColor: '#00000015',
    borderWidth: 1,
  },
  tweetImage: {
    width: screenWidth - 40, // Ajuste al ancho de la pantalla menos los márgenes
    height: undefined, // La altura se ajustará automáticamente para mantener la proporción
    aspectRatio: 16 / 9, // Mantenemos una relación de aspecto para las imágenes
    alignSelf: 'center', // Centramos la imagen en la tarjeta
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
    padding: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: '#00000025',
    borderWidth: 1.5,
  },
  fullSizeImage: {
    width: 400, // Ajusta estas dimensiones según necesites
    height: 400, // Ajusta estas dimensiones según necesites
    marginBottom: 15,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#000000",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});
