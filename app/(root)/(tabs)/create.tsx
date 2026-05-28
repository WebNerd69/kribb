import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSupabase } from "../../../hooks/useSupabase";

const TYPE = ["appartment", "villa", "house", "studio"] as const;

type PropertyType = (typeof TYPE)[number];

const MIN_PRICE = 1;
const MAX_PRICE = 999_999_999;

interface FORM_STATE {
    title: string;
    description: string;
    bedrooms: number;
    bathrooms: number;
    type: PropertyType;
    price: number;
    latitude: string;
    longitude: string;
    areaSqft: string;
    isFeatured: boolean;
    address: string;
    city: string;
    images: string[]; //supabase public images
    localImages: string[]; //local images
}

const INITIAL_FORM: FORM_STATE = {
    title: "",
    description: "",
    bedrooms: 1,
    bathrooms: 1,
    type: "appartment",
    price: 1,
    latitude: "",
    longitude: "",
    areaSqft: "",
    isFeatured: false,
    address: "",
    city: "",
    images: [], //supabase public images
    localImages: [], //local images
};
export default function create() {
    const router = useRouter();
    const authSupabase = useSupabase();

    const [form, setForm] = useState<FORM_STATE>(INITIAL_FORM);

    const [submitting, setSubmitting] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [detectingLocation, setDetectingLocation] = useState(false);

    const updateForm = (feilds: Partial<FORM_STATE>) => {
        setForm((prev) => ({ ...prev, ...feilds }));
    };

    const handlePickImages = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission?.granted) {
            Alert.alert("Please allow Kribb to access your gallary to add images.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: "images",
            quality: 0.7,
            base64: true,
            selectionLimit: 6,
        });

        if (result.canceled) {
            return;
        }

        setUploadingImages(true);

        const uploadedURLs: string[] = [];
        const previewURLs: string[] = [];

        for (const assets of result.assets) {
            try {
                const filename = `property_${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;

                const base64 = assets.base64;
                const buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

                const { error } = await authSupabase.storage
                    .from("kribb-property-images")
                    .upload(filename, buffer, {
                        contentType: "image/jpeg",
                        upsert: false,
                    });

                if (error) throw error;

                const { data: urlData } = authSupabase.storage
                    .from("kribb-property-images")
                    .getPublicUrl(filename);

                uploadedURLs.push(urlData.publicUrl);
                previewURLs.push(assets.uri);
            } catch (error) {
                console.log(error);
                Alert.alert(
                    "Upload failed:",
                    "One or more images failed to upload please try again.",
                );
            }
        }

        updateForm({
            images: [...form.images, ...uploadedURLs],
            localImages: [...form.localImages, ...previewURLs],
        });

        setUploadingImages(false);
    };

    const handleRemoveImage = (index: number) => {
        updateForm({
            images: form.images.filter((_, i) => i !== index),
            localImages: form.localImages.filter((_, i) => i !== index),
        });
    };

    const handlePickLocation = async () => {};

    const handleSubmitForm = async () => {};

    return (
        <SafeAreaView className="flex-1">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1 gap-4"
            >
                <View>
                    <Text className="text-3xl text-zinc-900 font-bold">Add Property</Text>
                </View>

                <ScrollView
                    className="gap-5 flex-1 "
                    keyboardShouldPersistTaps={"handled"}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="w-full gap-3">
                        <View className="flex-row gap-2 items-center">
                            <Text className="text-xl font-bold text-zinc-900">
                                Photos
                            </Text>
                            <Text className="font-semibold text-zinc-400">(upto 6)</Text>
                        </View>

                        <View className="flex-row gap-4">
                            {form.localImages.map((item, index) => (
                                <View key={index} className="relative justify-center items-center w-28 h-28">
                                    <Image
                                        source={{ uri: item }}
                                        className="w-24 h-24 rounded-3xl"
                                        resizeMode="cover"
                                    />

                                    {index === 0 && (
                                        <View className="absolute top-1 left-1 px-1.5 py-0.5 rounded-xl bg-zinc-900 justify-center items-center">
                                            <Text className="text-[9px] text-[#f5f5f5]">
                                                COVER
                                            </Text>
                                        </View>
                                    )}

                                    <TouchableOpacity
                                        onPress={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 rounded-full"
                                    >
                                        <Ionicons
                                            name="close-outline"
                                            size={16}
                                            color={"#f5f5f5"}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        {form.localImages.length < 6 && (
                            <TouchableOpacity
                                onPress={() => handlePickImages()}
                                disabled={uploadingImages}
                                className="justify-center items-center gap-2 w-24 h-24 rounded-3xl border-2 border-dashed border-zinc-400"
                            >
                                {uploadingImages ? (
                                    <ActivityIndicator size={"small"} />
                                ) : (
                                    <>
                                        <Ionicons
                                            name="camera-outline"
                                            color={"#a1a1aa"}
                                            size={20}
                                        />
                                        <Text className="text-zinc-400 font-medium">
                                            Add
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
