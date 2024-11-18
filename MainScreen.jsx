import React from 'react';
import { Image, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/Home.jsx'; // Asegúrate de que la ruta sea correcta
import Hermandades from './screens/Hermandades.jsx';
import Marchas from './screens/Marchas.jsx';
import Chat from './screens/Chat.jsx';
import Perfil from './screens/Perfil.jsx';

const Tab = createBottomTabNavigator();

export default function MainScreen() {
  // No debe haber NavigationContainer aquí
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size }) => {
            let iconName;
            if (route.name === 'Hermandades') {
              iconName = require('./assets/icons/hermandadesicon.png');
            } else if (route.name === 'Marchas') {
              iconName = require('./assets/icons/trompeta.png');
            } else if (route.name === 'Home') {
              iconName = require('./assets/icons/homeicon.png');
            } else if (route.name === 'Chat') {
              iconName = require('./assets/icons/chaticon.png');
            } else if (route.name === 'Perfil') {
              iconName = require('./assets/icons/perfilicon.png');
            }

            return <Image source={iconName} style={{ width: size, height: size }} />;
          },
          tabBarLabel: ({ focused }) => (
            focused ? <Text style={{ fontSize: 10, marginTop: 3 }}>{route.name}</Text> : null
          ),
        })}
      >
        <Tab.Screen name="Hermandades" component={Hermandades} />
        <Tab.Screen name="Marchas" component={Marchas} />
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Chat" component={Chat} />
        <Tab.Screen name="Perfil" component={Perfil} />
      </Tab.Navigator>
  );
}
