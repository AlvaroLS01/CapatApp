// Importaciones necesarias
import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Autenticacion from './screens/Autenticacion'; // Asegúrate de que la ruta sea correcta
import MainScreen from './MainScreen'; // Este será tu componente con el BottomTabNavigator
import Hermandades from './screens/Hermandades'; // Ajusta la ruta según sea necesario
import DetalleHermandad from './screens/DetalleHermandad'; // Ajusta la ruta según sea necesario
import DatosUsuario from './screens/DatosUsuario';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Autenticacion" component={Autenticacion} options={{ headerShown: false }} />
        <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DatosUsuario" component={DatosUsuario} />
        <Stack.Screen name="Hermandades" component={Hermandades} />
        <Stack.Screen name="DetalleHermandad" component={DetalleHermandad} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
