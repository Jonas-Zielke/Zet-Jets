import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface Jet {
    id: string;
    name: string;
    model: string;
    price: number;
    range: string;
}

export default function Results() {
    const router = useRouter();
    const { from, to, dateTime } = useLocalSearchParams<{
        from: string;
        to: string;
        dateTime: string;
    }>();

    const jets: Jet[] = [
        { id: '1', name: 'Phenom 300', model: 'Light Jet', price: 4800, range: '3 650 km' },
        { id: '2', name: 'Citation XLS+', model: 'Midsize Jet', price: 7500, range: '5 200 km' },
        { id: '3', name: 'Gulfstream G650', model: 'Ultra-Long Range', price: 19500, range: '12 964 km' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ergebnisse</Text>
            <Text style={styles.subtitle}>
                {from} → {to} am {dateTime}
            </Text>

            <FlatList
                data={jets}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingBottom: 24 }}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.jetName}>{item.name}</Text>
                        <Text style={styles.model}>{item.model}</Text>
                        <Text style={styles.range}>Reichweite: {item.range}</Text>
                        <Text style={styles.price}>
                            Ab {item.price.toLocaleString()} €
                        </Text>
                        <TouchableOpacity
                            style={styles.bookButton}
                            onPress={() =>
                                router.push({
                                    pathname: 'BookingOverview',
                                    params: {
                                        from,
                                        to,
                                        dateTime,
                                        jetName: item.name,
                                        price: item.price.toString(),
                                    },
                                })
                            }
                        >
                            <Text style={styles.bookText}>Buchen</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backText}>Zurück</Text>
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
    },
    subtitle: {
        fontSize: 14,
        color: '#E0E0E0',
        marginVertical: 8,
    },
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#BFA662',
        elevation: 2,
    },
    jetName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    model: {
        fontSize: 14,
        color: '#E0E0E0',
        marginVertical: 2,
    },
    range: {
        fontSize: 14,
        color: '#E0E0E0',
        marginVertical: 2,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#BFA662',
        marginVertical: 8,
    },
    bookButton: {
        backgroundColor: '#BFA662',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    bookText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    backButton: {
        marginTop: 12,
        alignItems: 'center',
    },
    backText: {
        color: '#E0E0E0',
    },
});
