import { useClerk, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function profile() {
    const { signOut } = useClerk();
    const { user, isLoaded } = useUser();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace("/login");
        } catch (error) {
            console.log(error);
        }
    };

    const [showDPBig, setShowDPBig] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleProfilePicUpdate = async () => {
        try {
            const permissionResult =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert(
                    "Permission Required",
                    "Please allow access to your media library to update profile picture.",
                );

                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
                base64: true,
            });
            setIsUpdating(true);

            const base64Image = result?.assets?.[0].base64;
            const uri = result?.assets?.[0].uri;
            const fileName = uri?.split("/").pop() || "prfile.jpg";
            const match = /\.(\w+)$/.exec(fileName);
            const mimeType = match ? `image/${match[1]}` : "image/jpeg";
            const dataUrl = `data:${mimeType};base64,${base64Image}`;

            await user?.setProfileImage({ file: dataUrl });
        } catch (error) {
            Alert.alert("Error", "Failed to update proofile picture, please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <SafeAreaView className="px-5 relative items-center" style={{height:800}}>
            <View className="items-center">
                <View className="relative justify-center items-center w-24 h-24">
                    <Pressable onPress={() => setShowDPBig(true)}>
                        <Image
                            source={{ uri: user?.imageUrl }}
                            className="w-24 h-24 rounded-full"
                        />
                    </Pressable>
                    <Pressable
                        onPress={() => handleProfilePicUpdate()}
                        className="absolute bottom-0 right-0 bg-zinc-900 p-2 rounded-full"
                    >
                        {isUpdating ? (
                            <ActivityIndicator size={"small"} color={"#f5f5f5"} />
                        ) : (
                            <Ionicons name="camera-outline" size={14} color={"#f5f5f5"} />
                        )}
                    </Pressable>
                </View>

                {showDPBig && (
                    <View className="absolute top-0 z-10">
                        <Image
                            source={{ uri: user?.imageUrl }}
                            className="w-72 h-72 rounded-full"
                        />
                        <Pressable
                            onPress={() => setShowDPBig(false)}
                            className="absolute top-0 right-0 p-5"
                        >
                            <Ionicons name="close" size={20} color={"black"} />
                        </Pressable>
                    </View>
                )}

                <View className="items-center gap-1 pt-5">
                  <Text className="text-2xl font-bold">{`${user?.firstName} ${user?.lastName}`}</Text>
                  <Text className="text-lg font-semibold text-zinc-500">{`${user?.emailAddresses}`}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={()=>handleSignOut()} className="w-full absolute bottom-20 px-5 py-3 rounded-2xl border-2 border-red-600 bg-red-100 justify-center items-center flex-row gap-3">
              <Ionicons name="exit-outline" size={20} color={"#dc2626"}/>
              <Text className="text-xl font-bold text-red-600">
                Logout 
              </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
