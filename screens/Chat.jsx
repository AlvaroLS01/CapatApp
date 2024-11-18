import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot, getFirestore, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase-config';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getFirestore();
    const [keyboardStatus, setKeyboardStatus] = useState(false);
    const [lastMessageTime, setLastMessageTime] = useState(null);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardStatus(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardStatus(false);
        });
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        const messagesRef = collection(firestore, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesArray = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            }));
            setMessages(messagesArray);
        });

        return () => unsubscribe();
    }, []);

    const handleSend = async () => {
        const currentTime = new Date();
        if (newMessage.trim() === '' || !user || newMessage.length > 350) return;

        if (lastMessageTime && (currentTime - lastMessageTime) / 60000 < 1) {
            Alert.alert('Espera', 'Tienes que esperar un poco...');
            return;
        }

        setLastMessageTime(currentTime);
        if (newMessage.trim() === '' || !user) return;

        // Define una lista de palabras malsonantes para filtrar
        const badWords = ['palabra1', 'palabra2', 'palabra3'];

        // Verifica si el mensaje contiene palabras malsonantes
        const containsBadWords = badWords.some(badWord => newMessage.toLowerCase().includes(badWord));

        if (containsBadWords) {
            // Si el mensaje contiene palabras malsonantes, muestra una alerta y no continúes
            Alert.alert('Error', 'Contiene palabras explícitas');
            return;
        }

        // Intenta obtener el nombre y apellido del usuario desde Firestore
        const userRef = doc(db, "usuarios", user.email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const { nombre, apellido } = userSnap.data();
            await addDoc(collection(firestore, 'messages'), {
                text: newMessage,
                createdAt: new Date(),
                userId: user.email,
                userName: `${nombre} ${apellido}`, // Guarda el nombre y apellido
            });
            setNewMessage('');
        } else {
            console.log("No se encontraron datos del usuario.");
        }
    };

    return (
        <ImageBackground source={require('../assets/wallpaper/fondo.jpg')} style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
            >
                <FlatList
                    data={messages}
                    renderItem={({ item }) => (
                        <View style={[
                            styles.card,
                            item.userId === user.email ? styles.sentMessage : styles.receivedMessage
                        ]}>
                            <Text style={styles.senderText}>{item.userName}</Text>
                            <Text style={styles.messageText}>{item.text}</Text>
                        </View>
                    )}
                    keyExtractor={item => item.id}
                    inverted
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Escribe un mensaje..."
                        placeholderTextColor="#a0a0a0"
                        maxLength={140} // Límite de 140 caracteres
                    />
                    <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                        <Text style={styles.sendButtonText}>Enviar</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        marginHorizontal: 10,
        marginTop: 10,
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    sentMessage: {
        backgroundColor: 'rgba(220, 248, 198, 0.8)',
        alignSelf: 'flex-end',
    },
    receivedMessage: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        marginBottom: 4,
    },
    senderText: {
        fontSize: 12,
        color: '#606770',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 8,
        paddingBottom: Platform.OS === 'ios' ? 0 : 8,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    input: {
        flex: 1,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    sendButton: {
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#000',
        borderRadius: 4,
    },
    sendButtonText: {
        color: '#fff',
    },
});
