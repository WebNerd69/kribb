import { Pressable, Text } from "react-native";
import React, { memo } from "react";
import { Ionicons } from "@expo/vector-icons";

type FilterChipProps = {
  title: string;
  removeFilter: () => void;
};

function FilterChip({ title, removeFilter }: FilterChipProps) {
  if (!title) return null;

  return (
    <Pressable
      onPress={removeFilter}
      className="flex-row items-center gap-2 px-3 py-2 rounded-full border-2 border-blue-400 bg-blue-100"
    >
      <Text className="text-blue-800 font-medium">{title}</Text>

      <Ionicons
        name="close"
        size={16}
        color="#1e40af"
      />
    </Pressable>
  );
}

export default memo(FilterChip);