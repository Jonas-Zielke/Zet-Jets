"use client";

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    useColorScheme,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const airports = [
    { id: 'TEB', name: 'Teterboro (TEB)' },
    { id: 'VNY', name: 'Van Nuys (VNY)' },
    { id: 'PBI', name: 'Palm Beach Intl (PBI)' },
    { id: 'HPN', name: 'Westchester (HPN)' },
    { id: 'IAD', name: 'Washington Dulles (IAD)' },
    { id: 'LAS', name: 'Harry Reid Intl (LAS)' },
    { id: 'LBG', name: 'Paris Le Bourget (LBG)' },
    { id: 'EGGW', name: 'London Luton (LTN)' },
    { id: 'ZRH', name: 'Zurich (ZRH)' },
    { id: 'FRA', name: 'Frankfurt (FRA)' },
    { id: 'MAD', name: 'Madrid Barajas (MAD)' },
    { id: 'MXP', name: 'Milan Malpensa (MXP)' },
    { id: 'EBBR', name: 'Brussels (BRU)' },
    { id: 'KBUR', name: 'Burbank (BUR)' },
    { id: 'KSNA', name: 'John Wayne (SNA)' },
    { id: 'EGKK', name: 'London Gatwick (LGW)' },
    { id: 'KDAL', name: 'Dallas Love Field (DAL)' },
    { id: 'KOPF', name: 'Miami Opa Locka Exec (OPF)' },
    { id: 'KSBD', name: 'Santa Barbara (SBA)' },
    { id: 'LSZM', name: 'Zurich Airfield (ZA)' },
];

export default function Flugdaten() {
    const router = useRouter();
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';
    const styles = createStyles(isDark);

    const [from, setFrom] = useState<string>('');
    const [to, setTo] = useState<string>('');
    const [date, setDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [time, setTime] = useState<Date>(new Date());
    const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);

    const onChangeDate = (_: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) setDate(selectedDate);
    };

    const onChangeTime = (_: any, selectedTime?: Date) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (selectedTime) setTime(selectedTime);
    };

    const showFlight = () => {
        if (!from || !to) {
            setMessage('Abflug und Ankunft müssen gesetzt sein.');
            return;
        }
        if (from === to) {
            setMessage('Abflug und Ankunft dürfen nicht gleich sein.');
            return;
        }
        setMessage(null);
        const dateStr = date.toLocaleDateString('de-DE');
        const timeStr = time.toLocaleTimeString('de-DE', { hour12: false });
        router.push({
            pathname: 'Results',
            params: { from, to, dateTime: `${dateStr} ${timeStr}` },
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Abflughafen</Text>
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={from}
                    onValueChange={(val) => setFrom(val)}
                    style={styles.picker}
                    dropdownIconColor={isDark ? '#FFF' : '#333'}
                >
                    <Picker.Item label="Wähle Abflughafen" value="" />
                    {airports.map((a) => (
                        <Picker.Item key={a.id} label={a.name} value={a.id} />
                    ))}
                </Picker>
            </View>

            <Text style={styles.label}>Zielflughafen</Text>
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={to}
                    onValueChange={(val) => setTo(val)}
                    style={styles.picker}
                    dropdownIconColor={isDark ? '#FFF' : '#333'}
                >
                    <Picker.Item label="Wähle Zielflughafen" value="" />
                    {airports.map((a) => (
                        <Picker.Item key={a.id} label={a.name} value={a.id} />
                    ))}
                </Picker>
            </View>

            <View style={styles.row}>
                <View style={styles.pickerSection}>
                    <Text style={styles.label}>Datum</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={styles.dateButtonText}>
                            {date.toLocaleDateString('de-DE')}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onChangeDate}
                        />
                    )}
                </View>

                <View style={styles.pickerSection}>
                    <Text style={styles.label}>Uhrzeit</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowTimePicker(true)}
                    >
                        <Text style={styles.dateButtonText}>
                            {time.toLocaleTimeString('de-DE', { hour12: false })}
                        </Text>
                    </TouchableOpacity>
                    {showTimePicker && (
                        <DateTimePicker
                            value={time}
                            mode="time"
                            display="default"
                            onChange={onChangeTime}
                        />
                    )}
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={showFlight}>
                <Text style={styles.buttonText}>Jets suchen</Text>
            </TouchableOpacity>
            {message && <Text style={styles.error}>{message}</Text>}
        </View>
    );
}

function createStyles(isDark: boolean) {
    const bg = isDark ? '#121212' : '#F5F5F5';
    const cardBg = isDark ? '#1E1E1E' : '#FFF';
    const textColor = isDark ? '#FFF' : '#333';
    const borderColor = isDark ? '#333' : '#CCC';
    const accent = '#BFA662';

    return StyleSheet.create({
        container: { flex: 1, padding: 16, backgroundColor: bg },
        label: { fontSize: 14, marginBottom: 4, color: textColor },
        pickerWrapper: {
            backgroundColor: cardBg,
            borderWidth: 1,
            borderColor: borderColor,
            borderRadius: 6,
            marginBottom: 16,
        },
        picker: { color: textColor },
        row: { flexDirection: 'row', justifyContent: 'space-between' },
        pickerSection: { flex: 1, marginRight: 8 },
        dateButton: {
            backgroundColor: cardBg,
            padding: 12,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: borderColor,
            marginBottom: 16,
        },
        dateButtonText: { color: textColor },
        button: {
            backgroundColor: accent,
            padding: 14,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 8,
        },
        buttonText: { color: '#FFF', fontWeight: '600' },
        error: { color: '#EF4444', textAlign: 'center', marginTop: 16 },
    });
}
