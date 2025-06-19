import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

type LastBooking = {
  from: string;
  to: string;
  dateTime: string;
  jetName: string;
  price: number;
};

export default function HomeTab() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [modalVisible, setModalVisible] = useState(false);
  const [balance, setBalance] = useState<number>(100000);
  const [lastBooking, setLastBooking] = useState<LastBooking | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('lastBooking').then((data) => {
      if (data) setLastBooking(JSON.parse(data));
    });
  }, []);

  const presets = [10000, 25000, 50000, 100000, 250000, 500000];
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Kreditkarte');

  const handleAufladen = () => {
    const amt = selectedAmount ?? (parseInt(customAmount, 10) || 0);
    if (amt <= 0) {
      Alert.alert('Ungültiger Betrag', 'Bitte wähle einen Betrag aus oder gib einen gültigen Betrag ein.');
      return;
    }
    setBalance((prev) => prev + amt);
    setModalVisible(false);
    Alert.alert('Erfolg', `Dein Guthaben wurde um ${amt.toLocaleString()} € aufgeladen.`);
  };

  const styles = createStyles(isDark);

  return (
      <ScrollView contentContainerStyle={styles.container}>
        {lastBooking && (
            <View style={styles.bookingSummary}>
              <Text style={styles.bookingTitle}>Letzte Buchung</Text>
              <Text style={styles.bookingText}>Von: {lastBooking.from}</Text>
              <Text style={styles.bookingText}>Nach: {lastBooking.to}</Text>
              <Text style={styles.bookingText}>Datum/Zeit: {lastBooking.dateTime}</Text>
              <Text style={styles.bookingText}>Jet: {lastBooking.jetName}</Text>
              <Text style={styles.bookingText}>Preis: {lastBooking.price.toLocaleString()} €</Text>
            </View>
        )}

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>ZET Jets ONE Karte</Text>
            <Text style={styles.cardSubtitle}>Mitgliedschaft</Text>
            <Text style={styles.balance}>{balance.toLocaleString()} €</Text>
            <Text style={styles.label}>Karteninhaber</Text>
            <Text style={styles.value}>Max Mustermann</Text>
            <Text style={styles.expiryLabel}>Gültig bis</Text>
            <Text style={styles.expiryValue}>12/2025</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Guthaben aufladen</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push('Kategorie')}>
          <Text style={styles.buttonText}>Jetzt Jet buchen</Text>
        </TouchableOpacity>

        <Modal transparent visible={modalVisible} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Guthaben aufladen</Text>

              <Text style={styles.sectionTitle}>Betrag wählen</Text>
              <View style={styles.presetsGrid}>
                {presets.map((amt) => (
                    <TouchableOpacity
                        key={amt}
                        style={[styles.presetButton, selectedAmount === amt && styles.presetSelected]}
                        onPress={() => {
                          setSelectedAmount(amt);
                          setCustomAmount('');
                        }}
                    >
                      <Text style={styles.presetText}>{amt.toLocaleString()} €</Text>
                    </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Oder eigenen Betrag eingeben</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Betrag in €"
                  placeholderTextColor={isDark ? '#888' : '#AAA'}
                  keyboardType="numeric"
                  value={customAmount}
                  onChangeText={(t) => {
                    setCustomAmount(t);
                    setSelectedAmount(null);
                  }}
              />

              <Text style={styles.sectionTitle}>Zahlungsmethode</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={paymentMethod}
                    onValueChange={(v) => setPaymentMethod(v)}
                    mode="dropdown"
                    dropdownIconColor={isDark ? '#FFF' : '#000'}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                >
                  <Picker.Item label="Kreditkarte" value="Kreditkarte" />
                  <Picker.Item label="Banküberweisung" value="Banküberweisung" />
                </Picker>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleAufladen}>
                <Text style={styles.buttonText}>Aufladen</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>Schließen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
  );
}

function createStyles(isDark: boolean) {
  const bg = isDark ? '#121212' : '#F5F5F5';
  const cardBg = isDark ? '#1E1E1E' : '#FFF';
  const text = isDark ? '#E0E0E0' : '#333';
  const border = isDark ? '#333' : '#DDD';
  const accent = '#BFA662';

  return StyleSheet.create({
    container: { padding: 16, backgroundColor: bg },
    bookingSummary: {
      backgroundColor: cardBg,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      borderColor: accent,
      borderWidth: 1,
    },
    bookingTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: accent },
    bookingText: { color: text, marginBottom: 4 },
    cardContainer: { marginBottom: 24 },
    card: { backgroundColor: cardBg, borderRadius: 12, padding: 16, elevation: 3 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: text },
    cardSubtitle: { fontSize: 14, color: text },
    balance: { fontSize: 28, fontWeight: 'bold', color: accent, marginVertical: 12 },
    label: { fontSize: 12, color: text },
    value: { fontSize: 14, fontWeight: '600', color: text },
    expiryLabel: { position: 'absolute', right: 16, bottom: 16, fontSize: 12, color: text },
    expiryValue: { position: 'absolute', right: 16, bottom: 4, fontSize: 14, fontWeight: '600', color: text },
    button: { backgroundColor: accent, padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 16 },
    buttonText: { color: '#FFF', fontWeight: '600' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '90%', backgroundColor: cardBg, borderRadius: 12, padding: 16 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: text },
    sectionTitle: { fontSize: 14, fontWeight: '600', marginTop: 12, color: text },
    presetsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    presetButton: {
      width: '30%',
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: border,
      marginBottom: 8,
      alignItems: 'center',
    },
    presetSelected: { borderColor: accent },
    presetText: { color: text },
    input: {
      backgroundColor: cardBg,
      color: text,
      borderRadius: 8,
      padding: 12,
      marginTop: 8,
      borderWidth: 1,
      borderColor: border,
    },
    pickerWrapper: {
      backgroundColor: cardBg,
      borderRadius: 8,
      marginTop: 8,
      borderWidth: 1,
      borderColor: border,
    },
    picker: {
      backgroundColor: cardBg,
      color: text,
    },
    pickerItem: {
      color: text,
      backgroundColor: cardBg,
    },
    closeText: { color: accent, fontWeight: '600', textAlign: 'center', marginTop: 12 },
  });
}
