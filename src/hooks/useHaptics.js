import * as Haptics from 'expo-haptics';

const safeRun = async (callback) => {
  try {
    await callback();
  } catch (error) {
    // Some environments (e.g. simulators/web) do not support haptics.
  }
};

export const useHaptics = () => {
  const triggerSuccess = () =>
    safeRun(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));

  const triggerWarning = () =>
    safeRun(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));

  const triggerLight = () => safeRun(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));

  const triggerMedium = () =>
    safeRun(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));

  return {
    triggerSuccess,
    triggerWarning,
    triggerLight,
    triggerMedium,
  };
};
