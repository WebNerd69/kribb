import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    Linking,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Property } from "../../../types";

import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useSavedProperty } from "../../../hooks/useSavedProperty";
import { supabaseClient } from "../../../lib/supabase";
import { formatPrice } from "../../../lib/utils";
import { useUserStore } from "../../../store/userStore";
import { useSupabase } from "../../../hooks/useSupabase";
import ImageViewing from "react-native-image-viewing";

export default function PropertyDetails() {
    const { width } = Dimensions.get("window");

    const { id } = useLocalSearchParams<{ id: string }>();
    const { userId } = useAuth();
    const isAdmin = useUserStore((state) => state.isAdmin);
    const router = useRouter();
    const authSupabase = useSupabase();

    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [expanded, setExpaned] = useState(false);
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [desc, setDesc] = useState<string | null>(null);
    const [longDesc, setLongDesc] = useState(false);

    const { saveLoading, isSaved, toggleSave } = useSavedProperty(id ?? "");

    // functions

    const fetchProperty = async () => {
        try {
            const { data } = await supabaseClient
                .from("properties")
                .select("*")
                .eq("id", id)
                .single();
            setProperty(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };

    useEffect(() => {
        fetchProperty();
    }, [id]);

    const descHandler = () => {
        if (property && property?.description?.length > 150 && !expanded) {
            setLongDesc(true);
            return setDesc(property?.description?.slice(0, 150) + "...");
        } else {
            return setDesc(property?.description ?? null);
        }
    };

    const handleContact = () => {
        const phone = process.env.EXPO_PUBLIC_AGENT_WHATSAPP_NUMBER;
        const message = `${property?.images?.[0]}\n\nHi👋 Im interested in the property:\n${property?.title} in ${property?.address} ${property?.city}\nIs it available?`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        Linking.openURL(url);
    };

    const handleMarkSold = () => {
        Alert.alert("Mark as sold", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Mark Sold",
                onPress: async () => {
                    try {
                        await authSupabase
                            .from("properties")
                            .update({ is_sold: true })
                            .eq("id", id);
                        setProperty((prev) => (prev ? { ...prev, is_sold: true } : prev));
                    } catch (error) {
                        console.log(error);
                    }
                },
            },
        ]);
    };

    const handleDeleteProperty = () => {
        Alert.alert("Delete Property", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await authSupabase.from("properties").delete().eq("id", id);
                        router.replace("/(root)/(tabs)");
                    } catch (error) {
                        console.log(error);
                    }
                },
            },
        ]);
    };

    useEffect(() => {
        descHandler();
    }, [property, expanded]);

    if (!property) {
        return (
            <View className="flex-1 justify-center items-center">
                {loading ? (
                    <ActivityIndicator color={"black"} size={"large"} />
                ) : (
                    <Text className="text-zinc-400 text-xl font-semibold">
                        Property Not Found :/
                    </Text>
                )}
            </View>
        );
    }

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
        property.longitude - 0.003
    }%2C${property.latitude - 0.003}%2C${property.longitude + 0.003}%2C${
        property.latitude + 0.003
    }&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`;

    return (
        <View className="flex-1 p-0">
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="w-full h-[300px] relative">
                    <View className="w-full h-full relative">
                        <FlatList
                            data={property?.images ?? []}
                            keyExtractor={(_, i) => i.toString()}
                            horizontal
                            pagingEnabled
                            style={{ width, height: 300 }}
                            renderItem={({ item }) => (
                                <Pressable onPress={()=>setImageViewerVisible(true)} className={`w-[${width}] h-[300px]`}>
                                    <Image
                                        source={{ uri: item }}
                                        style={{ width, height: 300 }}
                                        className={`${property.is_sold ? "opacity-50" : "opacity-100"}`}
                                    />
                                </Pressable>
                            )}
                            onScroll={onScroll}
                        />
                    </View>
                    <View className="absolute bottom-4 right-4 px-5 py-2 rounded-3xl bg-zinc-950/40">
                        <Text className="text-zinc-100 font-semibold">
                            {`${activeIndex + 1} / ${property.images.length}`}
                        </Text>
                    </View>
                    <SafeAreaView style={{ paddingHorizontal: 16 }} className="absolute ">
                        <View className="flex-row justify-between w-full">
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="w-14 justify-center items-center h-10 bg-bg rounded-full"
                            >
                                <Ionicons name="arrow-back" size={24} color={"#222"} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={saveLoading}
                                onPress={toggleSave}
                                className="w-10 justify-center items-center h-10 bg-bg rounded-full"
                            >
                                {isSaved ? (
                                    <Ionicons
                                        name="heart"
                                        size={24}
                                        color={"rgb(255,0,0)"}
                                    />
                                ) : (
                                    <Ionicons
                                        name="heart-outline"
                                        size={24}
                                        color={"#222"}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>

                <View className="pt-5 px-5 gap-4 pb-10">
                    <View className="flex-row gap-16">
                        <View className="px-3 py-1 rounded-full border-2 border-blue-600/80 bg-blue-100/50 justify-center items-center">
                            <Text className="text-blue-600 capitalize">
                                {property.type}
                            </Text>
                        </View>
                        {property.is_featured && (
                            <View className="px-3 py-1 rounded-full border-2 border-blue-600/80 bg-blue-100/50 justify-center items-center">
                                <Text className="text-blue-600 capitalize">
                                    ⭐ Featured
                                </Text>
                            </View>
                        )}
                        {property.is_sold && (
                            <View className="px-3 py-1 rounded-full border-2 border-red-600/80 bg-red-100/50 justify-center items-center">
                                <Text className="text-red-800 capitalize">Sold</Text>
                            </View>
                        )}
                    </View>

                    <View className="gap-2">
                        <View className="gap-2">
                            <Text className="font-bold text-3xl">{property.title}</Text>
                            <Text className="text-primary font-bold text-xl">
                                {formatPrice(property.price)}
                            </Text>
                        </View>

                        <View className="flex-row gap-4 justify-between items-center pt-5 px-5">
                            <SpecsCard
                                icon="bed-outline"
                                label="Beds"
                                value={`${property.bedrooms}`}
                            />
                            <SpecsCard
                                icon="water-outline"
                                label="Bath"
                                value={`${property.bathrooms}`}
                            />
                            <SpecsCard
                                icon="expand-outline"
                                label="Area"
                                value={`${property.area_sqft} ft²`}
                            />
                            <SpecsCard
                                icon="home-outline"
                                label="Type"
                                value={`${property.type[0].toUpperCase() + property.type.slice(1)}`}
                            />
                        </View>
                    </View>

                    <View className="gap-2 pt-5">
                        <Text className="font-bold text-xl">Description</Text>
                        <Text className="text-zinc-500">
                            {desc}{" "}
                            {longDesc && (
                                <Pressable onPress={() => setExpaned(!expanded)}>
                                    <Text className="text-primary">{`${expanded ? "Read less" : "Read more"}`}</Text>
                                </Pressable>
                            )}
                        </Text>
                    </View>

                    <View className="gap-3 pt-5 ">
                        <Text className="text-xl font-bold">Location</Text>
                        <View className="flex-row items-center">
                            <Ionicons
                                name="location-outline"
                                size={16}
                                className="opacity-55"
                            />
                            <Text className="opacity-55">{property.address}</Text>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            className="w-full h-[250px] rounded-3xl overflow-hidden"
                            onPress={() =>
                                router.push({
                                    pathname: "/(root)/property/map",
                                    params: {
                                        latitude: property.latitude,
                                        longitude: property.longitude,
                                        title: property.title,
                                        address: `${property.address + " , " + property.city}`,
                                    },
                                })
                            }
                        >
                            <WebView
                                source={{ uri: mapUrl }}
                                style={{ flex: 1 }}
                                scrollEnabled={false}
                                pointerEvents="none"
                            />

                            <View className="flex-row px-3 py-1 rounded-full bg-bg absolute bottom-4 right-4 items-center justify-center gap-1">
                                <Ionicons
                                    name="expand-outline"
                                    size={14}
                                    color={"rgba(0,0,0,.45)"}
                                />
                                <Text className="text-sm text-zinc-600">
                                    Tap to expand
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View className="justify-between items-center gap-5 relative pt-5">
                        {/* contact agent */}

                        <TouchableOpacity
                            onPress={() => handleContact()}
                            className="px-5 py-3 rounded-xl border-2 border-emerald-600 bg-emerald-200/15 flex-row justify-center items-center gap-2 w-full"
                        >
                            <Ionicons name="logo-whatsapp" size={24} color={"#059669"} />
                            <Text className="text-xl text-emerald-600">
                                Contact Agent
                            </Text>
                        </TouchableOpacity>

                        {isAdmin && (
                            <View className="flex-row gap-5 justify-between">
                                <TouchableOpacity
                                    onPress={() => handleMarkSold()}
                                    className="px-5 py-3 rounded-xl border-2 border-orange-500 bg-orange-300/15 flex-row justify-center items-center gap-2 w-[47%]"
                                >
                                    <Ionicons
                                        name="checkmark-done-circle-outline"
                                        size={24}
                                        color={"#ef4444"}
                                    />
                                    <Text className="text-xl text-orange-600">
                                        Mark Sold
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => handleDeleteProperty()}
                                    className="px-5 py-3 rounded-xl border-2 border-red-500 bg-red-300/15 flex-row justify-center items-center gap-2 w-[47%]"
                                >
                                    <Ionicons
                                        name="trash-outline"
                                        size={24}
                                        color={"#ef4444"}
                                    />
                                    <Text className="text-xl text-red-600">
                                        Delete Property
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
            {/* Image Viewer */}
            <ImageViewing
                images={property.images.map((uri) => ({ uri }))}
                imageIndex={activeIndex}
                visible={imageViewerVisible}
                onRequestClose={() => setImageViewerVisible(false)}
            />
        </View>
    );
}

const SpecsCard = ({
    icon,
    label,
    value,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
}) => {
    return (
        <View className="gap-1 items-center">
            <Ionicons name={icon} size={24} color={"#0E4D92"} />
            <Text className="text-zinc-900 font-bold">{value}</Text>
            <Text className="text-zinc-300 text-sm">{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({});
