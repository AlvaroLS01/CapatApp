import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase-config"; // Ajusta esta ruta según sea necesario

export default function Hermandades({ navigation }) {
  const [hermandades, setHermandades] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Todas", value: "Todas" },
    { label: "Domingo de Ramos", value: "Domingo de Ramos" },
    { label: "Lunes Santo", value: "Lunes Santo" },
    { label: "Martes Santo", value: "Martes Santo" },
    { label: "Miércoles Santo", value: "Miércoles Santo" },
    { label: "Jueves Santo", value: "Jueves Santo" },
    { label: "Madrugá", value: "Madrugá" },
    { label: "Viernes Santo", value: "Viernes Santo" },
    { label: "Sábado Santo", value: "Sábado Santo" },
    { label: "Domingo de Resurrección", value: "Domingo de Resurrección" },
  ]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "hermandades"),
      (querySnapshot) => {
        const hermandadesArray = [];
        querySnapshot.forEach((documentSnapshot) => {
          hermandadesArray.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setHermandades(hermandadesArray);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/wallpaper/fondo.jpg")}
      style={styles.container}
    >
      <View style={styles.container}>
        <DropDownPicker
          open={open}
          value={diaSeleccionado}
          items={items}
          setOpen={setOpen}
          setValue={setDiaSeleccionado}
          setItems={setItems}
          zIndex={3000}
          zIndexInverse={1000}
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownBox}
        />
        <FlatList
          data={hermandades.filter(
            (hermandad) =>
              !diaSeleccionado ||
              diaSeleccionado === "Todas" ||
              hermandad.dia === diaSeleccionado
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("DetalleHermandad", {
                  nombre: item.nombre,
                  photo: item.photo,
                  imagenpaso: item.imagenpaso,
                  descripcion: item.descripcion,
                  nazarenos: item.nazarenos, 
                  duracion: item.duracion,
                  tunica1: item.tunica1,
                  tunica2: item.tunica2,
                  tunica3: item.tunica3,
                  tunica4: item.tunica4,
                  ruta1: item.ruta1,
                  ruta2: item.ruta2,
                  itinerario: item.itinerario,
                  iglesia: item.iglesia,
                })
              }
            >
              <View style={styles.card}>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.nombre}</Text>
                  <Text>{item.iglesia}</Text>
                  <Text>{item.dia}</Text>
                </View>
                {item.photo && (
                  <Image source={{ uri: item.photo }} style={styles.image} />
                )}
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
        />
      </View>
    </ImageBackground>
  );
}

// Estilos para Hermandades aquí...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  dropdownContainer: {
    height: 30, // Ajuste para hacer el picker más delgado
    marginHorizontal: 10,
    marginBottom: 20,
  },
  dropdown: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownBox: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: -20, // Ajuste para recortar el espacio en blanco por arriba
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginLeft: 10,
  },
  container: {
    flex: 1,
    paddingTop: 10,
    width: "100%", // Asegura que el ImageBackground cubra toda la pantalla
    height: "100%", // Asegura que el ImageBackground cubra toda la pantalla
  },
});
