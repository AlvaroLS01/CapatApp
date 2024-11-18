import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';

export default function DetalleHermandad({ route }) {

  const { nombre, photo, imagenpaso, descripcion, nazarenos, duracion, tunica1, tunica2, tunica3, tunica4, ruta1, ruta2, itinerario, iglesia} = route.params;

  const renderTunicaColor = (color) => {
    if (!color) return null;
    return (
      <View style={[styles.tunicaColor, { backgroundColor: color }]} />
    );
  };


  // Analizar las cadenas JSON para convertirlas en objetos de arreglo de coordenadas
  const parsedRuta1 = JSON.parse(ruta1);
  const parsedRuta2 = JSON.parse(ruta2);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.card}>
          <Text style={styles.title}>{nombre}</Text>
          {photo && <Image source={{ uri: photo }} style={styles.photo} />}
        </View>
        {imagenpaso && <Image source={{ uri: imagenpaso }} style={styles.imagenpaso} />}
        <Text style={styles.subtitle}>Info. de la Hermandad:</Text>
        <Text style={styles.descripcion}>{descripcion}</Text>
        <Text style={styles.subtitle}>Punto de Salida: <Text style={styles.normalText}>{iglesia}</Text></Text>
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
              latitudeDelta: 0.007,
              longitudeDelta: 0.007,
            }}
          >
            <Polyline
              coordinates={parsedRuta1}
              strokeColor="rgba(0, 0, 255, 0.5)"
              strokeWidth={6}
            />
            <Polyline
              coordinates={parsedRuta2}
              strokeColor="rgba(255, 0, 0, 0.5)"
              strokeWidth={6}
            />
          </MapView>
        </View>
        <Text style={styles.subtitle}>Itinerario previsto:</Text>
        <Text style={styles.descripcion}>{itinerario}</Text>
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