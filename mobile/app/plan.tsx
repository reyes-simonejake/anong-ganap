import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

export default function PlanScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');

  const handleGeneratePlan = () => {
    // TODO: Implement plan generation
    console.log('Generating plan:', { type, budget, location });
  };

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold mb-6 capitalize">{type} Plan</Text>

      <Text className="text-gray-700 mb-2">Budget (₱)</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="e.g., 1000"
        keyboardType="numeric"
        value={budget}
        onChangeText={setBudget}
      />

      <Text className="text-gray-700 mb-2">Location</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="e.g., Makati"
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity 
        className="bg-indigo-600 p-4 rounded-lg mt-4"
        onPress={handleGeneratePlan}
      >
        <Text className="text-white text-center font-semibold text-lg">
          Generate Plan
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
