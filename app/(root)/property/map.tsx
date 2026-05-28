import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import WebView from "react-native-webview";

export default function map() {
    const { latitude, longitude, title, address } = useLocalSearchParams<{
        latitude: string;
        longitude: string;
        title: string;
        address: string;
    }>();

    const lat = parseFloat(latitude);
    const long = parseFloat(longitude);

    const router = useRouter();

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
        long - 0.001
    }%2C${lat - 0.001}%2C${long + 0.001}%2C${
        lat + 0.001
    }&layer=mapnik&marker=${lat}%2C${long}`;

    return (
        <View className="gap-4">
            <View className="flex-row justify-between items-center absolute top-14 w-full h-14 z-50 px-5">
                <Pressable
                    onPress={() => router.back()}
                    className="flex-row gap-3 items-center px-3 py-2 h-full rounded-full bg-white"
                    style={{
                        elevation: 3,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowRadius: 4,
                    }}
                >
                    <Ionicons name="arrow-back" size={20} />
                    <Text className="w-32 font-bold">
                        {address.length > 30 ? `${address.slice(0, 30)}...` : address}
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() =>
                        Linking.openURL(`https://www.google.com/maps?q=${lat},${long}`)
                    }
                    className="flex-row gap-3 items-center px-5 py-2 h-full rounded-full border-2 border-blue-600 bg-blue-100"
                    style={{
                        elevation: 3,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowRadius: 4,
                    }}
                >
                    <Ionicons
                        name="navigate-outline"
                        size={20}
                        color={"rgba(0,80,255)"}
                    />
                    <Text className="font-bold text-blue-600">Google maps</Text>
                </Pressable>
            </View>
            <View className="w-full h-full">
                <WebView
                    source={{ uri: mapUrl }}
                    style={{ flex: 1 }}
                    scrollEnabled={false}
                    pointerEvents="none"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({});
