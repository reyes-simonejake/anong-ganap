import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, spacing } from '@/constants';
import type { Plan, PlanActivity } from '@/types/plan.types';

interface InvitationPreviewProps {
  plan: Plan;
  activities: PlanActivity[];
  message: string;
  email: string;
  isCreating: boolean;
  isSending: boolean;
  errorMessage: string;
  successMessage: string;
  onEmailChange: (value: string) => void;
  onCreatePreview: () => void;
  onSend: () => void;
}

function formatDate(value?: string | null): string {
  if (!value) return 'Date to be confirmed';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? 'Date to be confirmed' : date.toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function InvitationPreview({ plan, activities, message, email, isCreating, isSending, errorMessage, successMessage, onEmailChange, onCreatePreview, onSend }: InvitationPreviewProps): JSX.Element {
  const isBusy = isCreating || isSending;

  return (
    <View style={styles.section}>
      <Text style={styles.eyebrow}>Share the ganap</Text>
      <Text style={styles.title}>Invite someone along</Text>
      <Text style={styles.subtitle}>Preview the invite, then send it straight to their inbox.</Text>

      {!message ? (
        <View style={styles.emptyBox}>
          <Text style={styles.bodyText}>Generate a friendly invitation from this plan.</Text>
          <Pressable disabled={isBusy} onPress={onCreatePreview} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed, isBusy && styles.disabled]}>
            {isCreating ? <ActivityIndicator color={colors.textInverse} /> : <Text style={styles.primaryText}>Create invitation preview</Text>}
          </Pressable>
        </View>
      ) : (
        <View style={styles.inviteCard}>
          <Text style={styles.cardTitle}>{plan.title}</Text>
          <Text style={styles.cardMeta}>{formatDate(plan.event_date)} · {plan.location}</Text>
          <Text style={styles.cardActivities}>{activities.slice(0, 3).map((activity) => activity.activity_name).join(' · ') || 'Your planned activities'}</Text>
          <Text style={styles.inviteMessage}>{message}</Text>
          <Text style={styles.label}>Recipient email</Text>
          <TextInput autoCapitalize="none" editable={!isBusy} keyboardType="email-address" onChangeText={onEmailChange} placeholder="friend@example.com" placeholderTextColor={colors.textMuted} style={styles.input} value={email} />
          <Pressable disabled={isBusy} onPress={onSend} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed, isBusy && styles.disabled]}>
            {isSending ? <ActivityIndicator color={colors.textInverse} /> : <Text style={styles.primaryText}>Send via email</Text>}
          </Pressable>
        </View>
      )}

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: spacing.md, borderWidth: 1, gap: spacing.md, padding: spacing.lg },
  eyebrow: { color: colors.primaryDark, fontSize: 13, fontWeight: '800' },
  title: { color: colors.text, fontSize: 21, fontWeight: '800' },
  subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  emptyBox: { backgroundColor: colors.surfaceMuted, borderRadius: spacing.sm, gap: spacing.md, padding: spacing.md },
  bodyText: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  inviteCard: { backgroundColor: colors.surfaceMuted, borderColor: colors.primaryLight, borderRadius: spacing.sm, borderWidth: 1, gap: spacing.md, padding: spacing.lg },
  cardTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  cardMeta: { color: colors.primaryDark, fontSize: 14, fontWeight: '700' },
  cardActivities: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
  inviteMessage: { color: colors.text, fontSize: 15, lineHeight: 23 },
  label: { color: colors.text, fontSize: 13, fontWeight: '800' },
  input: { backgroundColor: colors.surface, borderColor: colors.borderStrong, borderRadius: spacing.sm, borderWidth: 1, color: colors.text, fontSize: 15, padding: spacing.md },
  primaryButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: spacing.sm, minHeight: spacing.xxxl, justifyContent: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  primaryText: { color: colors.textInverse, fontSize: 15, fontWeight: '800' },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.7 },
  errorText: { color: colors.error, fontSize: 14, lineHeight: 20 },
  successText: { color: colors.success, fontSize: 14, fontWeight: '700', lineHeight: 20 },
});
