import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/constants';
import type { OutfitPerson, OutfitSuggestion as OutfitSuggestionData } from '@/types/phase3.types';

interface OutfitSuggestionProps {
  suggestion: OutfitSuggestionData | null;
  isLoading: boolean;
  errorMessage: string;
  onGenerate: () => void;
}

function OutfitPersonBlock({ label, person }: { label: string; person?: OutfitPerson }): JSX.Element {
  if (!person) {
    return <Text style={styles.emptyCopy}>{label} look is still pending.</Text>;
  }

  const items = [
    ['Top', person.top],
    ['Bottom', person.bottom],
    ['Shoes', person.shoes],
    ['Extras', person.accessories],
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <View style={styles.personBlock}>
      <Text style={styles.personTitle}>{label}</Text>
      {items.map(([name, value]) => (
        <Text key={name} style={styles.itemText}>{name}: {value}</Text>
      ))}
    </View>
  );
}

export function OutfitSuggestion({
  suggestion,
  isLoading,
  errorMessage,
  onGenerate,
}: OutfitSuggestionProps): JSX.Element {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.headingBlock}>
          <Text style={styles.eyebrow}>Phase 3</Text>
          <Text style={styles.title}>Ano ang susuotin?</Text>
          <Text style={styles.subtitle}>Practical na outfit ideas na bagay sa ganap at panahon.</Text>
        </View>
        <Pressable
          disabled={isLoading}
          onPress={onGenerate}
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressed, isLoading && styles.disabled]}
        >
          {isLoading ? <ActivityIndicator color={colors.textInverse} /> : <Text style={styles.actionText}>{suggestion ? 'Refresh' : 'Suggest outfit'}</Text>}
        </Pressable>
      </View>

      {errorMessage ? (
        <View style={styles.messageBox}>
          <Text style={styles.errorTitle}>Hindi pa ready ang outfit</Text>
          <Text style={styles.bodyText}>{errorMessage}</Text>
          <Pressable onPress={onGenerate} style={styles.retryButton}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : null}

      {!isLoading && !errorMessage && !suggestion ? (
        <Text style={styles.emptyCopy}>Tap suggest outfit para makakuha ng coordinated look.</Text>
      ) : null}

      {suggestion ? (
        <View style={styles.suggestionBody}>
          <Text style={styles.theme}>{suggestion.theme || 'Comfortable coordinated look'}</Text>
          <Text style={styles.weatherNote}>{suggestion.weatherNote || 'Check the weather before leaving.'}</Text>
          <View style={styles.peopleRow}>
            <OutfitPersonBlock label="Person A" person={suggestion.personA} />
            <OutfitPersonBlock label="Person B" person={suggestion.personB} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: spacing.md, borderWidth: 1, gap: spacing.md, padding: spacing.lg },
  sectionHeader: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between' },
  headingBlock: { flex: 1, gap: spacing.xs },
  eyebrow: { color: colors.primaryDark, fontSize: 13, fontWeight: '800' },
  title: { color: colors.text, fontSize: 21, fontWeight: '800' },
  subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  actionButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: spacing.sm, minHeight: spacing.xxxl, justifyContent: 'center', paddingHorizontal: spacing.md },
  actionText: { color: colors.textInverse, fontSize: 13, fontWeight: '800', textAlign: 'center' },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.7 },
  messageBox: { backgroundColor: colors.surfaceMuted, borderRadius: spacing.sm, gap: spacing.sm, padding: spacing.md },
  errorTitle: { color: colors.error, fontSize: 15, fontWeight: '800' },
  bodyText: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  retryButton: { alignSelf: 'flex-start', borderColor: colors.error, borderRadius: spacing.sm, borderWidth: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  retryText: { color: colors.error, fontSize: 14, fontWeight: '800' },
  emptyCopy: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  suggestionBody: { gap: spacing.md },
  theme: { color: colors.text, fontSize: 18, fontWeight: '800' },
  weatherNote: { backgroundColor: colors.surfaceMuted, borderRadius: spacing.sm, color: colors.text, fontSize: 14, lineHeight: 20, padding: spacing.md },
  peopleRow: { flexDirection: 'row', gap: spacing.md },
  personBlock: { backgroundColor: colors.surfaceMuted, borderRadius: spacing.sm, flex: 1, gap: spacing.xs, padding: spacing.md },
  personTitle: { color: colors.primaryDark, fontSize: 15, fontWeight: '800', marginBottom: spacing.xs },
  itemText: { color: colors.textSecondary, fontSize: 13, lineHeight: 18 },
});
