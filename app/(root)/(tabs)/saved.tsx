import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import { useAuth } from "@clerk/expo";
import { useSupabase } from "../../../hooks/useSupabase";
import { useFocusEffect, useRouter } from "expo-router";
import { Property } from "../../../types";
import { SafeAreaView } from "react-native-safe-area-context";
import PropertyCard from "../../../components/PropertyCard";
import { Ionicons } from "@expo/vector-icons";

interface SavedProperties {
    id: string;
    property_id: string;
    properties: Property;
}

export default function saved() {
    const { userId } = useAuth();
    const authSupabase = useSupabase();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState<SavedProperties[] | null>();

    const fetchSaved = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const { data } = await authSupabase
                .from("saved_properties")
                .select("id , property_id , properties(*)")
                .eq("user_clerk_id", userId)
                .order("created_at", { ascending: false });
            setSaved((data as unknown as SavedProperties[]) ?? []);
            setLoading(false);
        } catch (error) {
            // console.log(error);
            setLoading(false);
        }
    }, [userId]);

    useFocusEffect(
        useCallback(() => {
            fetchSaved();
        }, [userId]),
    );

    return (
        <SafeAreaView style={{ paddingHorizontal: 8 }}>
            <View className="pb-5">
                <Text className="text-3xl font-bold">Saved</Text>
                {!loading && saved ? (
                    <View>
                        <Text className="text-sm text-zinc-500">
                            {`${saved.length} ${saved.length > 1 ? "Properties" : "Property"} Saved`}
                        </Text>
                    </View>
                ) : (
                    <View>
                        <Text className="text-sm text-zinc-500">
                            No Saved Properties Found
                        </Text>
                    </View>
                )}
            </View>

            <View className="w-full ">
                <View className="flex-row gap-5 items-center">
                    {loading ? (
                        <View className="flex-1 justify-center items-center">
                            <ActivityIndicator color={"black"} size={"large"} />
                        </View>
                    ) : (
                        <FlatList
                            data={saved}
                            keyExtractor={(item) => item.id}
                            className="pb-5 w-full"
                            renderItem={({ item }) => (
                                <PropertyCard
                                    onUnsave={() => {
                                        setSaved((prev) =>
                                            prev?.filter((s) => s.id !== item.id),
                                        );
                                    }}
                                    showSave
                                    property={item.properties}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={<View className="flex justify-center items-center gap-1" style={{height:600}}>
                              <Ionicons name="heart-outline" color={"red"} size={40} className="p-5 rounded-full bg-red-200/30"/>
                              <Text className="text-zinc-900 text-xl font-semibold">No Properties Saved</Text>
                              <Text className="text-zinc-500 text-sm font-semibold">Click the heart icon on the listings to save.</Text>
                            </View>}
                        />
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
