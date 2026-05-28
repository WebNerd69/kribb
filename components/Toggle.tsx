import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Toggle({
    title,
    description,
    value,
    onChange,
}: {
    title: string;
    description?: string;
    value: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <TouchableOpacity
            onPress={() => onChange(!value)}
            className={`w-full px-3 py-3 flex-row justify-between items-center border ${value?"border-blue-400 bg-blue-300/15" :" border-zinc-300"} rounded-2xl mt-4 relative`}
        >
            <View className="gap-1 w-[70%]">
                <Text
                    className={`font-bold text-xl ${value ? "text-blue-600" : "text-zinc-900"}`}
                >
                    {title}
                </Text>
                <Text className={`${value ? "text-blue-600/50" : "text-zinc-400"} text-sm `}>
                    {description}
                </Text>
            </View>
            <View >
                {value && <Ionicons name="checkmark" size={20} color={"#f5f5f5"} className={`p-2 rounded-3xl bg-blue-600`} />}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({});
