"use client";

import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet, Text, useColorScheme } from 'react-native';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { ChevronsUpDownIcon, Check } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';

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
]

type AirportComboboxProps = {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
};

function AirportCombobox({ label, value, onChange, placeholder }: AirportComboboxProps) {
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';
    const styles = createStyles(isDark);
    const [open, setOpen] = useState(false);

    return (
        <View style={styles.field}>
            <Label style={styles.label}>{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        onClick={() => setOpen(!open)}
                        style={styles.selectTrigger}
                    >
                        <Text style={styles.selectValue}>
                            {value ? airports.find((a) => a.id === value)?.name : placeholder}
                        </Text>
                        <ChevronsUpDownIcon color={styles.accent} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent style={styles.dropdownContent} align="start">
                    <Command>
                        <CommandInput
                            placeholder={`Suche ${label.toLowerCase()}…`}
                            style={styles.commandInput}
                        />
                        <CommandList>
                            <CommandEmpty>Kein Flughafen gefunden.</CommandEmpty>
                            <CommandGroup>
                                {airports.map((a) => (
                                    <CommandItem
                                        key={a.id}
                                        value={a.id}
                                        onSelect={(current) => {
                                            onChange(current === value ? '' : current);
                                            setOpen(false);
                                        }}
                                        style={styles.dropdownItem}
                                    >
                                        <Text style={styles.dropdownItemText}>{a.name}</Text>
                                        {value === a.id && <Check style={styles.checkIcon} />}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </View>
    );
}

export default function Flugdaten() {
    const router = useRouter();
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';
    const styles = createStyles(isDark);

    const [from, setFrom] = useState<string>('');
    const [to, setTo] = useState<string>('');
    const [date, setDate] = useState<Date>();
    const [time, setTime] = useState<string>('10:30:00');
    const [openCalendar, setOpenCalendar] = useState(false);
    const [message, setMessage] = useState<string|null>(null);

    const showFlight = () => {
        if (!from || !to || !date || !time) {
            setMessage('Alle Felder müssen ausgefüllt sein.');
            return;
        }
        if (from === to) {
            setMessage('Abflug und Ankunft dürfen nicht gleich sein.');
            return;
        }
        setMessage(null);
        const dateStr = date.toLocaleDateString('de-DE');
        router.push({
            pathname: 'Results',
            params: { from, to, dateTime: `${dateStr} ${time}` },
        });
    };

    return (
        <View style={styles.container}>
            <AirportCombobox
                label="Abflughafen"
                value={from}
                onChange={setFrom}
                placeholder="Wähle Abflughafen"
            />

            <AirportCombobox
                label="Zielflughafen"
                value={to}
                onChange={setTo}
                placeholder="Wähle Zielflughafen"
            />

            <View style={[styles.row, styles.field]}>
                {/* Datum */}
                <View style={styles.col}>
                    <Label style={styles.label}>Datum</Label>
                    <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                        <PopoverTrigger asChild>
                            <Button onClick={() => setOpenCalendar(!openCalendar)} style={styles.selectTrigger}>
                                <Text style={styles.selectValue}>
                                    {date ? date.toLocaleDateString('de-DE') : 'Select date'}
                                </Text>
                                <ChevronsUpDownIcon color={styles.accent} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent style={styles.pickerWrapper} align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                captionLayout="dropdown"
                                onSelect={(selected) => {
                                    setDate(selected);
                                    setOpenCalendar(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </View>

                {/* Zeit */}
                <View style={styles.col}>
                    <Label style={styles.label}>Uhrzeit</Label>
                    <Input
                        type="time"
                        step="1"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        style={styles.input}
                    />
                </View>
            </View>

            <View style={styles.field}>
                <Button onClick={showFlight} style={styles.button}>
                    <Text style={styles.buttonText}>Jets suchen</Text>
                </Button>
            </View>

            {message && <Text style={styles.error}>{message}</Text>}
        </View>
    );
}

function createStyles(isDark: boolean) {
    const bg = isDark ? '#121212' : '#F5F5F5';
    const cardBg = isDark ? '#1E1E1E' : '#FFF';
    const textColor = isDark ? '#FFF' : '#333';
    const border = isDark ? '#333' : '#DDD';
    const accent = '#BFA662';

    return StyleSheet.create({
        container: { flex: 1, padding: 16, backgroundColor: bg },
        row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
        col: { flex: 1, marginRight: 8 },
        field: { marginBottom: 16 },
        label: { fontSize: 14, color: textColor, marginBottom: 4 },
        selectTrigger: {
            backgroundColor: cardBg,
            borderWidth: 1,
            borderColor: accent,
            borderRadius: 8,
            paddingVertical: 10,
            paddingHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        selectValue: { color: textColor, flex: 1 },
        dropdownContent: {
            backgroundColor: cardBg,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: accent,
            marginTop: 4,
            maxHeight: 200,
        },
        dropdownItem: { paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center' },
        dropdownItemText: { color: textColor, flex: 1 },
        checkIcon: { marginLeft: 8, color: accent },
        commandInput: { borderBottomWidth: 1, borderColor: border, margin: 8, paddingVertical: 4 },
        pickerWrapper: { backgroundColor: cardBg, borderRadius: 8, marginTop: 8, borderWidth: 1, borderColor: accent },
        input: { backgroundColor: cardBg, color: textColor, borderRadius: 8, padding: 12, marginTop: 4, borderWidth: 1, borderColor: accent },
        button: { backgroundColor: accent, padding: 14, borderRadius: 8, alignItems: 'center' },
        buttonText: { color: '#FFF', fontWeight: '600' },
        error: { color: '#EF4444', textAlign: 'center', marginTop: 16 },
        accent: { color: accent },
    });
}
