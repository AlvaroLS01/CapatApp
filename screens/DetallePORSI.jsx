import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import MapView, { Polyline } from 'react-native-maps'; // Importa MapView y Polyline

export default function DetalleHermandad({ route }) {
  const { nombre, photo, imagenpaso, descripcion, nazarenos, duracion, tunica1, tunica2, tunica3, tunica4 } = route.params;

  // Función para renderizar círculos de color para cada túnica
  const renderTunicaColor = (color) => {
    if (!color) return null;
    return (
      <View style={[styles.tunicaColor, { backgroundColor: color }]} />
    );
  };

  // Define las coordenadas del recorrido
  const coordinates = [
    { latitude: 37.38579267424001, longitude: -5.993162645418806 }, // Punto de inicio
    // Agrega más coordenadas según sea necesario para definir el recorrido
    { latitude: 37.385, longitude: -5.992 }, // Ejemplo de coordenada adicional
    // { latitude: ..., longitude: ... }, // Agrega tantas coordenadas como necesites
    { latitude: 37.386, longitude: -5.991 } // Punto final
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.card}>
          <Text style={styles.title}>{nombre}</Text>
          {photo && <Image source={{ uri: photo }} style={styles.photo} />}
        </View>
        {imagenpaso && <Image source={{ uri: imagenpaso }} style={styles.imagenpaso} />}
        <Text style={styles.subtitle}>Historia:</Text>
        <Text style={styles.descripcion}>{descripcion}</Text>
        <Text style={styles.subtitle}>Nº de nazarenos: <Text style={styles.normalText}>{nazarenos}</Text></Text>
        <Text style={styles.subtitle}>Duración: <Text style={styles.normalText}>{duracion}</Text></Text>
        <View style={styles.tunicasContainer}>
          <Text style={styles.subtitle}>Túnicas:</Text>
          {renderTunicaColor(tunica1)}
          {renderTunicaColor(tunica2)}
          {renderTunicaColor(tunica3)}
          {renderTunicaColor(tunica4)}
        </View>
        <Text style={styles.subtitle}>Recorrido:</Text>
        <View style={styles.mapContainer}>
          <MapView 
            style={styles.map} 
            initialRegion={{
              latitude: 37.38579267424001,
              longitude: -5.993162645418806,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {/* Dibuja la línea del recorrido */}
            <Polyline
              coordinates={coordinates}
              strokeColor="#000" // color de la línea
              strokeWidth={6} // grosor de la línea
            />
          </MapView>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap', // Permite que los elementos se envuelvan según sea necesario
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
    borderColor: '#00000030',
    borderWidth: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginRight: 10,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  imagenpaso: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    marginBottom: 20,
    borderColor: "#000000",
    borderWidth: 1.5,
  },
  descripcion: {
    fontSize: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 23,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10, // Aumenta este valor para más espacio
  },
  normalText: {
    fontWeight: 'normal',
    fontSize: 18,
    marginBottom: 10,
  },
  tunicasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // Ajusta según la necesidad de separación después de las túnicas
  },
  tunicaColor: {
    width: 30,
    height: 30,
    borderRadius: 10,
    marginLeft: 10,
    borderColor: "#00000030",
    borderWidth: 1
  },
  // Estilos para el contenedor del mapa y el mapa mismo
  mapContainer: {
    width: '90%', // Ajusta según tus necesidades
    height: 450, // Ajusta según tus necesidades
    borderRadius: 20,
    overflow: 'hidden', // Asegura que los bordes del mapa se corten correctamente
    borderColor: "#000000",
    borderWidth: 1,
    marginTop: 5, // Espacio arriba del mapa
    marginBottom: 20, // Espacio debajo del mapa
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Hace que el mapa llene completamente el contenedor del mapa
  },
});