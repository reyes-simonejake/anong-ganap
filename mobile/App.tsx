import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useState } from 'react';
import { colors, spacing } from './constants';
import type { ChatMessage, QuickSuggestion } from './types/chat.types';

const INITIAL_MESSAGE: ChatMessage = {
    id: 1,
    type: 'ai',
    text: 'Hi! I\'m your AI activity planner 🎉\n\nTell me what you\'re planning! For example:\n• "Plan a date in Makati with ₱1000 budget"\n• "Where can we hangout this weekend?"\n• "Family outing ideas near BGC"',
};

const QUICK_SUGGESTIONS: QuickSuggestion[] = [
    '💑 Plan a romantic date',
    '👥 Hangout with friends',
    '👨‍👩‍👧‍👦 Family day out',
    '🧘 Solo adventure',
];

export default function App() {
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        INITIAL_MESSAGE,
    ]);

    const handleSend = () => {
        if (!message.trim()) return;

        const userMessage: ChatMessage = {
            id: chatMessages.length + 1,
            type: 'user',
            text: message,
        };

        setChatMessages([...chatMessages, userMessage]);

        // Simulate AI response (will be replaced with actual API call)
        setTimeout(() => {
            const aiResponse: ChatMessage = {
                id: chatMessages.length + 2,
                type: 'ai',
                text: "Great! I'm analyzing your request...\n\n(Backend API will be connected here to generate your personalized itinerary)",
            };
            setChatMessages((prev) => [...prev, aiResponse]);
        }, 1000);

        setMessage('');
    };

    const handleQuickSuggestion = (suggestion: QuickSuggestion) => {
        setMessage(suggestion);
    };

    const isFirstMessage = chatMessages.length === 1;
    const canSend = message.trim().length > 0;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Anong Ganap? 🎉</Text>
                <Text style={styles.subtitle}>Your AI Activity Planner</Text>
            </View>

            <ScrollView
                style={styles.chatContainer}
                contentContainerStyle={styles.chatContent}
            >
                {chatMessages.map((msg) => (
                    <View
                        key={msg.id}
                        style={[
                            styles.messageBubble,
                            msg.type === 'user'
                                ? styles.userBubble
                                : styles.aiBubble,
                        ]}
                    >
                        <Text
                            style={[
                                styles.messageText,
                                msg.type === 'user'
                                    ? styles.userText
                                    : styles.aiText,
                            ]}
                        >
                            {msg.text}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            {isFirstMessage && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.suggestionsContainer}
                >
                    {QUICK_SUGGESTIONS.map((suggestion, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.suggestionChip}
                            onPress={() => handleQuickSuggestion(suggestion)}
                        >
                            <Text style={styles.suggestionText}>
                                {suggestion}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Ask me anything... Where are we going?"
                    placeholderTextColor={colors.textMuted}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    maxLength={500}
                />
                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        !canSend && styles.sendButtonDisabled,
                    ]}
                    onPress={handleSend}
                    disabled={!canSend}
                >
                    <Text style={styles.sendButtonText}>→</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    header: {
        backgroundColor: colors.primary,
        paddingTop: 60,
        paddingBottom: spacing.xl,
        paddingHorizontal: spacing.xl,
        borderBottomLeftRadius: spacing.xl,
        borderBottomRightRadius: spacing.xl,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textInverse,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: 14,
        color: colors.primaryLight,
    },
    chatContainer: {
        flex: 1,
    },
    chatContent: {
        padding: spacing.lg,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: spacing.lg,
        borderRadius: spacing.lg,
        marginBottom: spacing.md,
    },
    aiBubble: {
        backgroundColor: colors.surface,
        alignSelf: 'flex-start',
        borderBottomLeftRadius: spacing.xs,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    userBubble: {
        backgroundColor: colors.primary,
        alignSelf: 'flex-end',
        borderBottomRightRadius: spacing.xs,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    aiText: {
        color: colors.text,
    },
    userText: {
        color: colors.textInverse,
    },
    suggestionsContainer: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        maxHeight: 60,
    },
    suggestionChip: {
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm + 2,
        borderRadius: 20,
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    suggestionText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: spacing.lg,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        alignItems: 'flex-end',
    },
    input: {
        flex: 1,
        backgroundColor: colors.surfaceMuted,
        borderRadius: spacing.xl,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        fontSize: 15,
        maxHeight: 100,
        marginRight: spacing.md,
        color: colors.text,
    },
    sendButton: {
        backgroundColor: colors.primary,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: colors.borderStrong,
    },
    sendButtonText: {
        color: colors.textInverse,
        fontSize: 24,
        fontWeight: 'bold',
    },
});
