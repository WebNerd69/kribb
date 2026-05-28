import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Counter({
    title,
    value,
    onChange,
}: {
    title: string;
    value: number;
    onChange: (v: number) => void;
}) {
    return (
        <View className="gap-2 w-[47%]">
            <Text className="text-lg font-semibold text-zinc-900">{title}</Text>
            <View className="px-3 border border-zinc-300 rounded-2xl ">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => onChange(Math.max(1, value - 1))} className="pr-6 py-3">
                        <Ionicons name="remove" size={16} color={"#111"} />
                    </TouchableOpacity>

                    <Text className="text-lg text-zinc-900">{value}</Text>

                    <TouchableOpacity onPress={() => onChange(value + 1)} className="pl-6 py-3">
                        <Ionicons name="add" size={16} color={"#111"} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({});
