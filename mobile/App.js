import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function App() {
    const activityTypes = [
        { id: 'date', label: '💑 Date', color: '#ec4899' },
        { id: 'hangout', label: '👥 Hangout', color: '#3b82f6' },
        { id: 'family', label: '👨‍👩‍👧‍👦 Family', color: '#10b981' },
        { id: 'solo', label: '🧘 Solo', color: '#8b5cf6' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Anong Ganap? 🎉</Text>
            <Text style={styles.subtitle}>AI-powered activity planner</Text>
            <Text style={styles.label}>Choose activity type:</Text>

            {activityTypes.map((type) => (
                <TouchableOpacity
                    key={type.id}
                    style={[styles.button, { backgroundColor: type.color }]}
                    onPress={() => alert(`Selected: ${type.label}`)}
                >
                    <Text style={styles.buttonText}>{type.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
        paddingTop: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 32,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    button: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
    },
});
