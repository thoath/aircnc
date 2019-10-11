import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Image, StyleSheet, AsyncStorage, Alert } from 'react-native';
import logo from '../assets/logo.png'; 
import SpotList from '../components/SpotList';
import socketio from 'socket.io-client';

export default function List() {
    
    const [techs, setTechs] = useState([]); 
    
    useEffect(() => {
        AsyncStorage.getItem('user').then(user => {
            const socket = socketio('http://192.168.0.109:3333', {
                query: {user}
            });

            socket.on('booking_response', booking => {
                Alert.alert(`Sua reserva em ${booking.spot.company} em ${booking.date} foi ${booking.approved ? 'Aprovada!' : 'Rejeitada!'}`)
            })
        })
    }, []);

    useEffect(() => {
        AsyncStorage.getItem('techs').then(storeTechs => {
            const techsArray = storeTechs.split(',').map(tech => tech.trim());

            setTechs(techsArray);
        })
    }, []);

    return(
        <SafeAreaView style={StyleSheet.container}>
            <Image style={styles.logo} source={logo} />

            <ScrollView>
                {techs.map(tech => <SpotList key={tech} tech={tech} />)}
            </ScrollView>
            
        </SafeAreaView>
    ) 
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    logo: {
        height: 32,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 10
    }
});