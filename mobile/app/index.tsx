import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface ActivityType {
  id: string;
  label: string;
  color: string;
}

const ACTIVITY_TYPES: ActivityType[] = [
  { id: 'date', label: '💑 Date', color: 'bg-pink-500' },
  { id: 'hangout', label: '👥 Hangout', color: 'bg-blue-500' },
  { id: 'family', label: '👨‍👩‍👧‍👦 Family', color: 'bg-green-500' },
  { id: 'solo', label: '🧘 Solo', color: 'bg-purple-500' }
];

export default function HomeScreen() {
  const router = useRouter();

  const handleActivityPress = (activityId: string) => {
    router.push(`/plan?type=${activityId}`);
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-3xl font-bold text-gray-800 mb-2">
        Anong Ganap?
      </Text>
      <Text className="text-gray-600 mb-8">
        AI-powered activity planner
      </Text>

      <Text className="text-lg font-semibold mb-4">Choose activity type:</Text>
      
      {ACTIVITY_TYPES.map((type) => (
        <TouchableOpacity
          key={type.id}
          className={`${type.color} p-4 rounded-lg mb-3`}
          onPress={() => handleActivityPress(type.id)}
        >
          <Text className="text-white text-center text-lg font-semibold">
            {type.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
