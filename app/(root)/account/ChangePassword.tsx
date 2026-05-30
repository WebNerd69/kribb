import { useClerk, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePassword() {
    const { user } = useUser();
    const {signOut} = useClerk()

    const [password, setPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const router = useRouter();

    if (!user) return router.back();

    const handlePasswordChange = async () => {
        setLoading(true);
        if (password === "" || newPassword === "")
            return Alert.alert(
                "Validation error",
                "Please write current and new passsword.",
            );
        try {
            await user?.updatePassword({
                currentPassword: password,
                newPassword: newPassword,
            });

            Alert.alert("Success", "Your password is updated successfully.", [
                {
                    text: "Ok",
                    onPress: () => router.back(),
                },
            ]);
        } catch (error) {
            console.log(JSON.stringify(error));
            if (JSON.stringify(error).includes("Incorrect password")) {
                Alert.alert("Incorrect password", "Please write the password correctly.");
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <SafeAreaView className="relative p-5 justify-between flex h-[800px]">
            {loading && (
                <View className="h-[800px] w-full absolute justify-center items-center">
                    <View className="items-center justify-center">
                        <ActivityIndicator
                            size={"large"}
                            color={"#111"}
                            className="w-16"
                        />
                    </View>
                </View>
            )}
            <View className={`${loading ? "opacity-50" : "opacity-100"}`}>
                <Text className="font-bold text-3xl mb-7">Change Password</Text>
                <View>
                    <View className="gap-2">
                        <View>
                            <Text className="font-bold">Current Password</Text>
                        </View>
                        <View className="px-5 border border-zinc-300 rounded-2xl mb-4 justify-between relative flex-row items-center">
                            <TextInput
                                placeholder="current password"
                                className="w-[80%]"
                                value={password ?? ""}
                                onChangeText={(e) => setPassword(e)}
                                secureTextEntry={!showPass}
                            />
                            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                                <Ionicons
                                    name={showPass ? "eye-off-outline" : "eye-outline"}
                                    className="py-5 pl-5"
                                    size={16}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View>
                    <View className="gap-2">
                        <View>
                            <Text className="font-bold">New Password</Text>
                        </View>
                        <View className="px-5 border border-zinc-300 rounded-2xl mb-4 justify-between relative flex-row items-center">
                            <TextInput
                                placeholder="current password"
                                className="w-[80%]"
                                value={newPassword ?? ""}
                                onChangeText={(e) => setNewPassword(e)}
                                secureTextEntry={!showPass}
                            />
                            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                                <Ionicons
                                    name={showPass ? "eye-off-outline" : "eye-outline"}
                                    className="py-5 pl-5"
                                    size={16}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <View className={`${loading ? "opacity-50" : "opacity-100"}`}>
                <TouchableOpacity
                    onPress={() => handlePasswordChange()}
                    disabled={password === "" && newPassword === ""}
                    className={`w-full p-5 justify-center items-center ${password !== "" && newPassword !== "" ? "bg-blue-500" : "bg-blue-500/50"} rounded-2xl`}
                >
                    <Text className="text-2xl font-bold text-white">Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
