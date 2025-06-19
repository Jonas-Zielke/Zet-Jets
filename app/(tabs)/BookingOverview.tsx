import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Params = {
    from: string;
    to: string;
    dateTime: string;
    jetName: string;
    price: string;
};

export default function BookingOverview() {
    const router = useRouter();
    const { from, to, dateTime, jetName, price } = useLocalSearchParams<Params>();

    const handleOk = async () => {
        const booking = {
            from,
            to,
            dateTime,
            jetName,
            price: parseInt(price, 10),
        };
        try {
            await AsyncStorage.setItem('lastBooking', JSON.stringify(booking));
            router.push('/');
        } catch (e) {
            Alert.alert('Fehler', 'Konnte Buchung nicht speichern.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Buchung prüfen</Text>
            <View style={styles.field}>
                <Text style={styles.label}>Von:</Text>
                <Text style={styles.value}>{from}</Text>
            </View>
            <View style={styles.field}>
                <Text style={styles.label}>Nach:</Text>
                <Text style={styles.value}>{to}</Text>
            </View>
            <View style={styles.field}>
                <Text style={styles.label}>Datum/Zeit:</Text>
                <Text style={styles.value}>{dateTime}</Text>
            </View>
            <View style={styles.field}>
                <Text style={styles.label}>Jet:</Text>
                <Text style={styles.value}>{jetName}</Text>
            </View>
            <View style={styles.field}>
                <Text style={styles.label}>Preis:</Text>
                <Text style={styles.price}>
                    {parseInt(price, 10).toLocaleString()} €
                </Text>
            </View>

            <TouchableOpacity style={styles.okButton} onPress={handleOk}>
                <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#121212',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    field: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        color: '#E0E0E0',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    price: {
        fontSize: 18,
        fontWeight: '600',
        color: '#BFA662',
        marginTop: 4,
    },
    okButton: {
        backgroundColor: '#BFA662',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
    },
    okText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
});
