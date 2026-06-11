import { useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { useSupabase } from "../../../hooks/useSupabase";

export default function EditProfile() {
    const { user } = useUser();

    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);
    const [disabled, setDisabled] = useState<boolean>(true);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const authSupabase = useSupabase();

    if (!user) return router.replace("/(root)/(tabs)/profile");

    useEffect(() => {
        setFirstName(user?.firstName);
        setLastName(user?.lastName);
    }, [user]);

    useEffect(() => {
        if (firstName !== user.firstName || lastName !== user.lastName) {
            setDisabled(false);
        }
    }, [user, firstName, lastName]);

    const handleNameChange = async () => {
        setLoading(true);
        try {
            await user?.update({
                firstName,
                lastName,
            });
            const { error } = await authSupabase
                .from("users")
                .update({ first_name: firstName, last_name: lastName })
                .eq("clerk_id", user.id);
            if (error) throw error;

            Alert.alert("Success", "Your name is updated successfully.", [
                {
                    text: "Ok",
                    onPress: () => router.back(),
                },
            ]);
        } catch (error) {
            // console.log(error);
            Alert.alert("Error","Name change failed please try again.")
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="relative p-5 justify-between flex h-[800px]">
            {loading && (
                <View className="h-[800px] w-full absolute justify-center items-center">
                    <View className="items-center justify-center">
                        <ActivityIndicator size={"large"} color={"#111"} className="w-16"/>
                    </View>
                </View>
            )}
            <View className={`${loading ? "opacity-50" : "opacity-100"}`}>
                <Text className="font-bold text-3xl mb-7">Edit Profile</Text>
                <View>
                    <View className="gap-2">
                        <View>
                            <Text className="font-bold">First name</Text>
                        </View>
                        <TextInput
                            placeholder="e.g. Rudra"
                            className="py-5 px-5 border border-zinc-300 rounded-2xl mb-4"
                            value={firstName ?? ""}
                            onChangeText={(e) => setFirstName(e)}
                        />
                    </View>
                    <View className="gap-2">
                        <View>
                            <Text className="font-bold">Last name</Text>
                        </View>
                        <TextInput
                            placeholder="e.g. Pratap Roy"
                            className="py-5 px-5 border border-zinc-300 rounded-2xl mb-4"
                            value={lastName ?? ""}
                            onChangeText={(e) => setLastName(e)}
                        />
                    </View>
                </View>
            </View>
            <View className={`${loading ? "opacity-50" : "opacity-100"}`}>
                <TouchableOpacity
                    disabled={disabled}
                    onPress={() => handleNameChange()}
                    className={`w-full p-5 justify-center items-center ${disabled ? "bg-blue-500/50" : "bg-blue-500"} rounded-2xl`}
                >
                    <Text className="text-2xl font-bold text-white">Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
