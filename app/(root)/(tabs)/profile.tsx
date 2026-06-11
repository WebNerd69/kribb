import { useClerk, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { useSupabase } from "../../../hooks/useSupabase";

export default function profile() {
    const { signOut } = useClerk();
    const { user, isLoaded } = useUser();

    const handleSignOut = async () => {
        try {
            setIsLoggingOut(true);
            setIsUserLoading(true);
            await signOut();
            router.replace("/login");
        } catch (error) {
            // console.log(error);
        }
    };

    const [showDPBig, setShowDPBig] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [userDetails, setUserDetails] = useState<any>();
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [userName, setUserName] = useState<string | null>();
    const [userEmail, setUserEmail] = useState<string | null>();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const authSupabase = useSupabase();

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

    const fetchUserDetails = async () => {
        setIsUserLoading(true);
        try {
            const { data: userData, error } = await authSupabase
                .from("users")
                .select("*")
                .eq("clerk_id", user?.id)
                .single();

            setUserDetails(userData);
            if (error) {
                // console.log(error);
                throw error;
            }
        } catch (error) {
            // console.log(error);
        } finally {
            setIsUserLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, [user, isLoaded]);

    useEffect(() => {
        if (!user) {
            return;
        }

        setUserName(`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim());

        setUserEmail(user.primaryEmailAddress?.emailAddress ?? "");
    }, [user]);

    if (isUserLoading || isLoggingOut) {
        return (
            <SafeAreaView className="w-full h-full items-center justify-center">
                <ActivityIndicator size={"large"} color={"black"} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="px-5 relative items-center" style={{ height: 800 }}>
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
                    <Text className="text-2xl font-bold">{userName}</Text>
                    <Text className="text-lg font-semibold text-zinc-500">
                        {userEmail}
                    </Text>
                </View>
            </View>
            <View className=" gap-4 px-3 w-full mt-5">
                <View className="p-4 rounded-2xl border border-zinc-300 w-full relative flex-row justify-between items-center bg-white/50">
                    <View className="w-[30%] items-center gap-1">
                        <Ionicons
                            name="calendar-clear-outline"
                            size={16}
                            className="p-2 rounded-3xl bg-pink-300/15"
                            color={"#ec4899"}
                        />
                        <Text className="text-xs text-zinc-400">member since</Text>
                        <Text className="font-bold text-zinc-900 capitalize">
                            {new Date(userDetails?.created_at).toLocaleDateString(
                                "en-US",
                                {
                                    month: "short",
                                    year: "numeric",
                                },
                            )}
                        </Text>
                    </View>
                    <View className="w-[30%] items-center gap-1">
                        <Ionicons
                            name="shield-outline"
                            size={16}
                            className="p-2 rounded-3xl bg-purple-300/15"
                            color={"#7e22ce"}
                        />
                        <Text className="text-xs text-zinc-400">role</Text>
                        <Text className="font-bold text-zinc-900">
                            {userDetails?.is_admin ? "Admin" : "User"}
                        </Text>
                    </View>
                    <View className="w-[30%] items-center gap-1">
                        <Ionicons
                            name="checkmark-circle-outline"
                            size={16}
                            className="p-2 rounded-3xl bg-emerald-300/20"
                            color={"#10b981"}
                        />
                        <Text className="text-xs text-zinc-400">status</Text>
                        <Text className="font-bold text-zinc-900">Active</Text>
                    </View>
                </View>
                <View className="gap-3 ">
                    <View>
                        <Text className="font-bold text-zinc-500">Account</Text>
                    </View>
                    <View className="bg-white/50 rounded-2xl border border-zinc-300 p-4">
                        <TouchableOpacity
                            onPress={() => router.push("/(root)/account/EditProfile")}
                            className="flex-row justify-between items-center border-b border-zinc-200 pb-3"
                        >
                            <View className="flex-row gap-3 items-center">
                                <Ionicons
                                    name="person-outline"
                                    size={20}
                                    className="p-3 rounded-xl bg-red-300/20 color-red-500"
                                    color={"#ef4444"}
                                />
                                <View>
                                    <Text className="font-bold text-zinc-900">
                                        Edit Profile
                                    </Text>
                                    <Text className="text-sm text-zinc-500">
                                        Update your personal information
                                    </Text>
                                </View>
                            </View>
                            <Ionicons
                                name="chevron-forward-outline"
                                size={20}
                                color={"#dadada"}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push("/(root)/account/ChangePassword")}
                            className="flex-row justify-between items-center pt-3"
                        >
                            <View className="flex-row gap-3 items-center">
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={20}
                                    className="p-3 rounded-xl bg-purple-300/20 color-purple-500"
                                    color={"#a855f7"}
                                />
                                <View>
                                    <Text className="font-bold text-zinc-900">
                                        Change Password
                                    </Text>
                                    <Text className="text-sm text-zinc-500">
                                        Change your account password
                                    </Text>
                                </View>
                            </View>
                            <Ionicons
                                name="chevron-forward-outline"
                                size={20}
                                color={"#dadada"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="gap-3">
                    <View>
                        <Text className="font-bold text-zinc-500">Support</Text>
                    </View>
                    <View className="bg-white/50 rounded-2xl border border-zinc-300 p-4">
                        <TouchableOpacity
                            onPress={() => router.push("/(root)/support/Help")}
                            className="flex-row justify-between items-center pb-3 border-b border-zinc-200"
                        >
                            <View className="flex-row gap-3 items-center">
                                <Ionicons
                                    name="help-circle-outline"
                                    size={20}
                                    className="p-3 rounded-xl bg-amber-300/20 color-amber-500"
                                    color={"#f59e0b"}
                                />
                                <View>
                                    <Text className="font-bold text-zinc-900">
                                        Help Center
                                    </Text>
                                    <Text className="text-sm text-zinc-500">
                                        Get help and find answers
                                    </Text>
                                </View>
                            </View>
                            <Ionicons
                                name="chevron-forward-outline"
                                size={20}
                                color={"#dadada"}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push("/(root)/support/About")}
                            className="flex-row justify-between items-center pt-3"
                        >
                            <View className="flex-row gap-3 items-center">
                                <Ionicons
                                    name="information-circle-outline"
                                    size={20}
                                    className="p-3 rounded-xl bg-blue-300/20 color-blue-500"
                                    color={"#3b82f6"}
                                />
                                <View>
                                    <Text className="font-bold text-zinc-900">About</Text>
                                    <Text className="text-sm text-zinc-500">
                                        App version and information
                                    </Text>
                                </View>
                            </View>
                            <Ionicons
                                name="chevron-forward-outline"
                                size={20}
                                color={"#dadada"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() => handleSignOut()}
                        className="w-full px-5 py-3 rounded-2xl border-2 border-red-600 bg-red-100 justify-center items-center flex-row gap-3"
                    >
                        <Ionicons name="exit-outline" size={20} color={"#dc2626"} />
                        <Text className="text-xl font-bold text-red-600">Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
