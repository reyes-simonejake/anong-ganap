import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { colors, spacing } from '@/constants';
import { InvitationPreview } from '@/components/invitation/InvitationPreview';
import { OutfitSuggestion } from '@/components/outfit/OutfitSuggestion';
import { invitationService } from '@/services/invitationService';
import { outfitService } from '@/services/outfitService';
import { planService } from '@/services/planService';
import type {
  CreatePlanPayload,
  CreatePlanResult,
  PlanActivity,
} from '@/types/plan.types';
import type { OutfitSuggestion as OutfitSuggestionData } from '@/types/phase3.types';

interface ActivityTimelineProps {
  activities: PlanActivity[];
  onRetry: () => void;
}

interface ActivityRowProps {
  activity: PlanActivity;
}

const DEFAULT_ACTIVITY_TYPE = 'hangout';

function getParamValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? DEFAULT_ACTIVITY_TYPE;
  }

  return value ?? DEFAULT_ACTIVITY_TYPE;
}

function getPlanTitle(activityType: string): string {
  return `${activityType.charAt(0).toUpperCase()}${activityType.slice(1)} Plan`;
}

function formatCurrency(value?: number): string {
  if (typeof value !== 'number') {
    return 'Budget TBD';
  }

  return `₱${value.toLocaleString('en-PH')}`;
}

function formatTime(value?: string): string {
  if (!value) {
    return 'Flexible';
  }

  const [hourValue, minuteValue] = value.split(':');
  const hour = Number(hourValue);
  const minute = Number(minuteValue ?? '0');

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return value;
  }

  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  return date.toLocaleTimeString('en-PH', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDistance(meters?: number): string {
  if (typeof meters !== 'number') {
    return 'Route pending';
  }

  return meters >= 1000
    ? `${(meters / 1000).toFixed(1)} km`
    : `${Math.round(meters)} m`;
}

function formatDuration(seconds?: number): string {
  if (typeof seconds !== 'number') {
    return 'Travel time pending';
  }

  return `${Math.max(1, Math.round(seconds / 60))} min travel`;
}

function ActivityRow({ activity }: ActivityRowProps) {
  return (
    <View style={styles.activityRow}>
      <View style={styles.timeColumn}>
        <Text style={styles.activityTime}>{formatTime(activity.start_time)}</Text>
        <View style={styles.timelineDot} />
      </View>
      <View style={styles.activityBody}>
        <Text style={styles.activityTitle}>{activity.activity_name}</Text>
        <Text style={styles.activityMeta}>
          {activity.place_name || 'Location to confirm'}
        </Text>
        <Text style={styles.activityDescription}>
          {activity.description || 'Details will show once the backend returns them.'}
        </Text>
        <Text style={styles.activityCost}>
          {formatCurrency(activity.estimated_cost)}
        </Text>
      </View>
    </View>
  );
}

function ActivityTimeline({ activities, onRetry }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Plan saved, activities pending</Text>
        <Text style={styles.emptyCopy}>
          The backend created the plan but did not return activities yet.
        </Text>
        <Pressable onPress={onRetry} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Generate again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.timeline}>
      {activities.map((activity) => (
        <ActivityRow
          key={
            activity.activity_id ??
            activity.id ??
            `${activity.start_time}-${activity.activity_name}`
          }
          activity={activity}
        />
      ))}
    </View>
  );
}

export function PlanScreen() {
  const { type } = useLocalSearchParams<{ type?: string | string[] }>();
  const activityType = getParamValue(type);
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [result, setResult] = useState<CreatePlanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [outfitSuggestion, setOutfitSuggestion] = useState<OutfitSuggestionData | null>(null);
  const [outfitError, setOutfitError] = useState('');
  const [isOutfitLoading, setIsOutfitLoading] = useState(false);
  const [invitationMessage, setInvitationMessage] = useState('');
  const [invitationEmail, setInvitationEmail] = useState('');
  const [invitationError, setInvitationError] = useState('');
  const [invitationSuccess, setInvitationSuccess] = useState('');
  const [isInvitationCreating, setIsInvitationCreating] = useState(false);
  const [isInvitationSending, setIsInvitationSending] = useState(false);

  const buildPayload = (): CreatePlanPayload | null => {
    const trimmedLocation = location.trim();
    const numericBudget = Number(budget);

    if (!trimmedLocation) {
      setErrorMessage('Add a location para alam natin saan ang ganap.');
      return null;
    }

    if (!budget.trim() || Number.isNaN(numericBudget) || numericBudget <= 0) {
      setErrorMessage('Add a valid budget greater than zero.');
      return null;
    }

    return {
      location: trimmedLocation,
      budget: numericBudget,
      activityType,
    };
  };

  const handleGeneratePlan = async (): Promise<void> => {
    const payload = buildPayload();

    if (!payload) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setResult(null);
    setOutfitSuggestion(null);
    setOutfitError('');
    setInvitationMessage('');
    setInvitationEmail('');
    setInvitationError('');
    setInvitationSuccess('');

    try {
      const nextResult = await planService.create(payload);
      setResult(nextResult);
    } catch (error) {
      setResult(null);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Hindi muna makagawa ng plan. Subukan ulit.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateOutfit = async (): Promise<void> => {
    if (!result) return;

    setIsOutfitLoading(true);
    setOutfitError('');

    try {
      const suggestion = await outfitService.generate(
        result.plan.plan_id,
        result.plan.location,
        activityType,
      );
      setOutfitSuggestion(suggestion);
    } catch (error) {
      setOutfitSuggestion(null);
      setOutfitError(
        error instanceof Error
          ? error.message
          : 'Hindi muna makakuha ng outfit suggestion. Subukan ulit.',
      );
    } finally {
      setIsOutfitLoading(false);
    }
  };

  const handleReloadPlan = async (): Promise<void> => {
    if (!result) return;

    setIsReloading(true);
    setErrorMessage('');

    try {
      const savedResult = await planService.getById(result.plan.plan_id);
      setResult(savedResult);
      setOutfitSuggestion(null);
      setInvitationMessage('');
      setInvitationSuccess('');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Hindi ma-reopen ang saved plan.',
      );
    } finally {
      setIsReloading(false);
    }
  };

  const handleCreateInvitation = async (): Promise<void> => {
    if (!result) return;

    setIsInvitationCreating(true);
    setInvitationError('');
    setInvitationSuccess('');

    try {
      const message = await invitationService.createPreview(result.plan.plan_id);
      setInvitationMessage(message);
    } catch (error) {
      setInvitationMessage('');
      setInvitationError(
        error instanceof Error
          ? error.message
          : 'Hindi muna makagawa ng invitation preview.',
      );
    } finally {
      setIsInvitationCreating(false);
    }
  };

  const handleSendInvitation = async (): Promise<void> => {
    if (!result) return;

    const trimmedEmail = invitationEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setInvitationError('Maglagay ng valid email address ng aanyayahan.');
      setInvitationSuccess('');
      return;
    }

    setIsInvitationSending(true);
    setInvitationError('');
    setInvitationSuccess('');

    try {
      await invitationService.send(result.plan.plan_id, trimmedEmail, invitationMessage);
      setInvitationSuccess(`Invitation sent to ${trimmedEmail}.`);
    } catch (error) {
      setInvitationError(
        error instanceof Error
          ? error.message
          : 'Hindi muna maipadala ang invitation. Subukan ulit.',
      );
    } finally {
      setIsInvitationSending(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      style={styles.screen}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Anong balak mo?</Text>
        <Text style={styles.title}>{getPlanTitle(activityType)}</Text>
        <Text style={styles.subtitle}>
          Tell us the place, budget, and vibe. We will build the first itinerary
          draft from there.
        </Text>
      </View>

      <Text style={styles.label}>Location</Text>
      <TextInput
        editable={!isLoading}
        onChangeText={setLocation}
        placeholder="Makati, BGC, QC..."
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        value={location}
      />

      <Text style={styles.label}>Budget</Text>
      <TextInput
        editable={!isLoading}
        keyboardType="numeric"
        onChangeText={setBudget}
        placeholder="PHP 1500"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        value={budget}
      />

      <Pressable
        disabled={isLoading}
        onPress={handleGeneratePlan}
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.pressed,
          isLoading && styles.disabledButton,
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.textInverse} />
        ) : (
          <Text style={styles.primaryButtonText}>Generate Plan</Text>
        )}
      </Pressable>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>May aberya sa plan</Text>
          <Text style={styles.errorCopy}>{errorMessage}</Text>
          <Pressable onPress={handleGeneratePlan} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Try again</Text>
          </Pressable>
        </View>
      ) : null}

      {result ? (
        <View style={styles.result}>
          <Text style={styles.resultKicker}>Generated itinerary</Text>
          <Text style={styles.resultTitle}>{result.plan.title}</Text>
          <Text style={styles.resultMeta}>
            {result.plan.location} - {formatCurrency(result.itinerary?.totalEstimatedCost)}
          </Text>
          {result.itinerary?.weather_note ? (
            <Text style={styles.weatherNote}>{result.itinerary.weather_note}</Text>
          ) : null}
          {result.itinerary?.route_context ? (
            <Text style={styles.routeNote}>
              {formatDistance(result.itinerary.route_context.distanceMeters)} ·{' '}
              {formatDuration(result.itinerary.route_context.durationSeconds)} ·{' '}
              {result.itinerary.route_context.provider === 'local-fallback'
                ? 'estimated route'
                : 'route estimate'}
            </Text>
          ) : null}
          {result.itinerary?.validation?.budget ? (
            <Text style={styles.validationNote}>
              Budget check: {formatCurrency(result.itinerary.validation.budget.estimatedCost)} of{' '}
              {formatCurrency(result.itinerary.validation.budget.budget)}
            </Text>
          ) : null}
          <Pressable
            disabled={isReloading}
            onPress={handleReloadPlan}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.pressed,
              isReloading && styles.disabledButton,
            ]}
          >
            {isReloading ? (
              <ActivityIndicator color={colors.error} />
            ) : (
              <Text style={styles.secondaryButtonText}>Reopen saved plan</Text>
            )}
          </Pressable>
          <ActivityTimeline
            activities={result.activities}
            onRetry={handleGeneratePlan}
          />
          <OutfitSuggestion
            errorMessage={outfitError}
            isLoading={isOutfitLoading}
            onGenerate={handleGenerateOutfit}
            suggestion={outfitSuggestion}
          />
          <InvitationPreview
            activities={result.activities}
            email={invitationEmail}
            errorMessage={invitationError}
            isCreating={isInvitationCreating}
            isSending={isInvitationSending}
            message={invitationMessage}
            onCreatePreview={handleCreateInvitation}
            onEmailChange={(value) => {
              setInvitationEmail(value);
              setInvitationError('');
              setInvitationSuccess('');
            }}
            onSend={handleSendInvitation}
            plan={result.plan}
            successMessage={invitationSuccess}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

export default PlanScreen;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.surfaceMuted,
    flex: 1,
  },
  content: {
    gap: spacing.md,
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  eyebrow: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: spacing.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    padding: spacing.lg,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.lg,
  },
  primaryButtonText: {
    color: colors.textInverse,
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderColor: colors.error,
    borderRadius: spacing.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  secondaryButtonText: {
    color: colors.error,
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  errorBox: {
    backgroundColor: colors.surface,
    borderColor: colors.error,
    borderRadius: spacing.md,
    borderWidth: 1,
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.lg,
  },
  errorTitle: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '800',
  },
  errorCopy: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 21,
  },
  result: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: spacing.md,
    borderWidth: 1,
    gap: spacing.md,
    marginTop: spacing.xl,
    padding: spacing.lg,
  },
  resultKicker: {
    color: colors.success,
    fontSize: 13,
    fontWeight: '800',
  },
  resultTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  resultMeta: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  weatherNote: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: spacing.sm,
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
    padding: spacing.md,
  },
  routeNote: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
  },
  validationNote: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '700',
  },
  timeline: {
    gap: spacing.lg,
  },
  activityRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timeColumn: {
    alignItems: 'center',
    width: spacing.xxxl,
  },
  activityTime: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  timelineDot: {
    backgroundColor: colors.primary,
    borderRadius: spacing.sm,
    height: spacing.md,
    marginTop: spacing.sm,
    width: spacing.md,
  },
  activityBody: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flex: 1,
    gap: spacing.xs,
    paddingBottom: spacing.lg,
  },
  activityTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  activityMeta: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
  },
  activityDescription: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 21,
  },
  activityCost: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: spacing.md,
    gap: spacing.xs,
    padding: spacing.lg,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  emptyCopy: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 21,
  },
});
