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
      className="flex-row items-center gap-2 px-5 py-2 rounded-full border border-zinc-800/20 bg-zinc-200/30"
    >
      <Text className="text-zinc-900 font-medium">{title}</Text>

      <Ionicons
        name="close"
        size={16}
        color="#18181b"
      />
    </Pressable>
  );
}

export default memo(FilterChip);