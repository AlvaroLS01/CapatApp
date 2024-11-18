import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import MapView from 'react-native-maps';

export default function Mapa() {
  return (
    <View style={styles.outerContainer}>
      <ImageBackground source={require('../assets/wallpaper/fondo.jpg')} style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView style={styles.map} />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%', // Asegura que el ImageBackground cubra el contenedor externo
    height: '100%', // Asegura que el ImageBackground cubra el contenedor externo
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    width: '88%', // Ajusta según tus necesidades
    height: '88%', // Ajusta según tus necesidades
    borderRadius: 30,
    overflow: 'hidden', // Asegura que los bordes del mapa se corten correctamente
    borderColor: "#00000030",
    borderWidth: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Hace que el mapa llene completamente el contenedor del mapa
  },
});
