import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
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
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Counter from "../../../components/Counter";
import Toggle from "../../../components/Toggle";
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
    price: string;
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
    price: "",
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
                const buffer = Uint8Array.from(atob(base64 ?? ""), (c) =>
                    c.charCodeAt(0),
                );

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

    const handlePickLocation = async () => {
        setDetectingLocation(true);

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permission denied",
                    "location permissions are required to detect coordinates",
                );
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            updateForm({
                latitude: String(location.coords.latitude),
                longitude: String(location.coords.longitude),
            });
        } catch (error) {
            Alert.alert(
                "Couldnot detect coordinates",
                "Please provide coordinates manually or try again later",
            );
            console.log(error);
        } finally {
            setDetectingLocation(false);
        }
    };

    const handleSubmitForm = async () => {
        // form validation
        if (!form.title.trim()) {
            return Alert.alert(
                "Validation",
                "Title cannot be empty ,Please enter a property title",
            );
        }
        if (!form.description.trim()) {
            return Alert.alert(
                "Validation",
                "Description cannot be empty, Please describe the property in detail.",
            );
        }
        if (!form.address.trim()) {
            return Alert.alert(
                "Validation",
                "Address cannot be empty, Please enter accurate property address.",
            );
        }
        if (!form.city.trim()) {
            return Alert.alert(
                "Validation",
                "City cannot be empty, Please enter city name.",
            );
        }
        if (!form.latitude.trim()) {
            return Alert.alert(
                "Validation",
                "Latitude cannot be empty, Please enter valid latitude coordinate.",
            );
        }
        if (!form.longitude.trim()) {
            return Alert.alert(
                "Validation",
                "Longitude cannot be empty, Please enter valid longitude coordinate.",
            );
        }
        if (!form.areaSqft.trim()) {
            return Alert.alert(
                "Validation",
                "Area cannot be empty, Please provide property area in sq ft.",
            );
        }
        if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 1) {
            return Alert.alert(
                "Validation",
                `The price must be greater than ₹${MIN_PRICE}`,
            );
        }
        if (!form.price || isNaN(Number(form.price)) || Number(form.price) > MAX_PRICE) {
            return Alert.alert(
                "Validation",
                `The price must be smaller than ₹${MAX_PRICE.toLocaleString("en-IN")}`,
            );
        }

        if (form.localImages.length === 0) {
            return Alert.alert("Validation", "Please add images of the property.");
        }

        setSubmitting(true);

        const { error } = await authSupabase.from("properties").insert({
            title: form.title.trim(),
            description: form.description.trim(),
            price: Number(form.price),
            address: form.address.trim(),
            city: form.city.trim(),
            area_sqft: Number(form.areaSqft),
            bedrooms: form.bedrooms,
            bathrooms: form.bathrooms,
            latitude: Number(form.latitude),
            longitude: Number(form.longitude),
            type: form.type.trim(),
            is_sold: false,
            is_featured: form.isFeatured,
            images: form.images,
        });

        setSubmitting(false);
        if (error) {
            console.log(error);
            return Alert.alert("Error", "Failed to list propery please try again.");
        }

        setForm(INITIAL_FORM);

        Alert.alert("Success 🎉", "Property listed successfully.", [
            { text: "OK", onPress: () => router.replace("/(root)/(tabs)") },
        ]);
    };

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
                    className="gap-5 flex-1"
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
                                <View
                                    key={index}
                                    className="relative justify-center items-center w-28 h-28"
                                >
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
                    <View className="w-full gap-2 mt-4">
                        <Text className="text-lg font-semibold text-zinc-900">Title</Text>
                        <View className="rounded-2xl border border-zinc-300 w-full">
                            <TextInput
                                onChangeText={(value) => updateForm({ title: value })}
                                value={form.title}
                                placeholder="e.g. 3BHK Flat B.S Road Coochbehar"
                                placeholderTextColor={"#a1a1aa"}
                                className="px-3 py-3 text-lg "
                            />
                        </View>
                    </View>
                    <View className="w-full gap-2 mt-4">
                        <Text className="text-lg font-semibold text-zinc-900">
                            Description
                        </Text>
                        <View className="rounded-2xl border border-zinc-300 w-full">
                            <TextInput
                                onChangeText={(value) =>
                                    updateForm({ description: value })
                                }
                                value={form.description}
                                placeholder="Describe the property..."
                                placeholderTextColor={"#a1a1aa"}
                                className="px-3 py-3 text-lg h-24"
                                multiline={true}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>
                    <View className="w-full gap-2 mt-4">
                        <Text className="text-lg font-semibold text-zinc-900">
                            Price (₹)
                        </Text>
                        <View className="rounded-2xl border border-zinc-300 w-full">
                            <TextInput
                                onChangeText={(value) => updateForm({ price: value })}
                                value={form.price}
                                placeholder="e.g. 1500000"
                                placeholderTextColor={"#a1a1aa"}
                                className="px-3 py-3 text-lg"
                                keyboardType="numeric"
                            />
                        </View>
                        <Text className="text-sm text-zinc-400">
                            Valid range : ₹1 - {MAX_PRICE.toLocaleString("en-IN")}
                        </Text>
                    </View>
                    <View className="w-full gap-2 mt-4">
                        <Text className="text-lg font-semibold text-zinc-900">
                            Property type
                        </Text>
                        <View className="flex-row gap-4 items-center">
                            {TYPE.map((t) => (
                                <TouchableOpacity
                                    onPress={() => updateForm({ type: t })}
                                    key={t}
                                    className={`px-5 py-3 rounded-full border  ${form.type === t ? "bg-blue-600 border-blue-600" : "bg-inherit border-zinc-300"}`}
                                >
                                    <Text
                                        className={`text-lg ${form.type === t ? "text-[#f5f5f5]" : "text-zinc-900"}`}
                                    >
                                        {t[0].toUpperCase() + t.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <View className="w-full mt-4 flex-row justify-between items-center">
                        <Counter
                            title="Bedrooms"
                            value={form.bedrooms}
                            onChange={(v) => updateForm({ bedrooms: v })}
                        />
                        <Counter
                            title="Bathrooms"
                            value={form.bathrooms}
                            onChange={(v) => updateForm({ bathrooms: v })}
                        />
                    </View>
                    <View className="w-full gap-2 mt-4">
                        <Text className="text-lg font-semibold text-zinc-900">
                            Area sq ft
                        </Text>
                        <View className="rounded-2xl border border-zinc-300 w-full">
                            <TextInput
                                onChangeText={(value) => updateForm({ areaSqft: value })}
                                value={form.areaSqft}
                                placeholder="e.g. 1500"
                                placeholderTextColor={"#a1a1aa"}
                                className="px-3 py-3 text-lg"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                    <View className="w-full gap-2 mt-4">
                        <Text className="text-lg font-semibold text-zinc-900">City</Text>
                        <View className="rounded-2xl border border-zinc-300 w-full">
                            <TextInput
                                onChangeText={(value) => updateForm({ city: value })}
                                value={form.city}
                                placeholder="e.g. Coochbehar"
                                placeholderTextColor={"#a1a1aa"}
                                className="px-3 py-3 text-lg "
                            />
                        </View>
                    </View>
                    <View className="w-full gap-2 mt-4">
                        <Text className="text-lg font-semibold text-zinc-900">
                            Address
                        </Text>
                        <View className="rounded-2xl border border-zinc-300 w-full">
                            <TextInput
                                onChangeText={(value) => updateForm({ address: value })}
                                value={form.address}
                                placeholder="Property address"
                                placeholderTextColor={"#a1a1aa"}
                                className="px-3 py-3 text-lg h-24"
                                multiline={true}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>
                    <View className="w-full gap-2 mt-4">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-lg font-semibold text-zinc-900">
                                Coordinates
                            </Text>
                            <TouchableOpacity
                                onPress={() => handlePickLocation()}
                                disabled={detectingLocation}
                                className="px-3 py-1 rounded-full border border-blue-400 bg-blue-400/15 flex-row gap-2 items-center"
                            >
                                <Ionicons name="locate-outline" color={"#2563eb"} />
                                <Text className="text-blue-600">
                                    {detectingLocation
                                        ? "Detecting location..."
                                        : "Detect location"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View className="w-full flex-row justify-between items-center">
                            <View className="rounded-2xl border border-zinc-300 w-[47%]">
                                <TextInput
                                    onChangeText={(value) =>
                                        updateForm({ latitude: value })
                                    }
                                    value={form.latitude}
                                    placeholder="Latitude"
                                    placeholderTextColor={"#a1a1aa"}
                                    className="px-3 py-3 text-lg "
                                    keyboardType="numeric"
                                />
                            </View>
                            <View className="rounded-2xl border border-zinc-300 w-[47%]">
                                <TextInput
                                    onChangeText={(value) =>
                                        updateForm({ longitude: value })
                                    }
                                    value={form.longitude}
                                    placeholder="Longitude"
                                    placeholderTextColor={"#a1a1aa"}
                                    className="px-3 py-3 text-lg "
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                        <Toggle
                            title="Feature Property"
                            description="Featuring this property will cause it to come at the top of the search."
                            value={form.isFeatured}
                            onChange={(v) => updateForm({ isFeatured: v })}
                        />

                        <View className="mt-4 w-full mb-40">
                            <TouchableOpacity
                                onPress={() => handleSubmitForm()}
                                disabled={submitting}
                                style={{
                                    elevation: 3, // Android
                                    shadowColor: "#000", // iOS
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.12,
                                    shadowRadius: 4,
                                }}
                                className="w-full bg-blue-600 h-16 rounded-2xl justify-center items-center"
                            >
                                {submitting ? (
                                    <ActivityIndicator size={"small"} color={"#f5f5f5"} />
                                ) : (
                                    <Text className="text-[#f5f5f5] text-lg font-bold">
                                        List Property
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
