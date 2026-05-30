import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Help() {
    const router = useRouter();
    return (
        <SafeAreaView className=" gap-4">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerClassName="px-5 pt-4 pb-10"
            >
                <View className="w-full flex-row justify-between items-center">
                    <Text className="text-4xl font-bold text-black">Help Center</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons
                            name={"chevron-back"}
                            size={20}
                            className=" p-2 rounded-full bg-zinc-100"
                        />
                    </TouchableOpacity>
                </View>

                {/* Getting Started */}
                <View className="mt-8 bg-white rounded-3xl p-5">
                    <Text className="text-2xl font-bold mb-4">Getting Started</Text>

                    <View className="gap-2">
                        <Text className="text-lg font-semibold">
                            How do I find properties?
                        </Text>

                        <Text className="text-gray-600">
                            • Go to the Home or Search page.
                        </Text>

                        <Text className="text-gray-600">
                            • Use the search bar to enter a city or property name.
                        </Text>

                        <Text className="text-gray-600">
                            • Browse featured and recommended properties.
                        </Text>

                        <Text className="text-gray-600">
                            • Tap any property card to view details.
                        </Text>
                    </View>

                    <View className="h-px bg-neutral-200 my-5" />

                    <View className="gap-2">
                        <Text className="text-lg font-semibold">
                            How do filters work?
                        </Text>

                        <Text className="text-gray-600">
                            Filters help you narrow down your search results.
                        </Text>

                        <Text className="text-gray-600">
                            • Property Type (House, Apartment, Villa, Studio)
                        </Text>

                        <Text className="text-gray-600">• Bedrooms (1, 2, 3, 4+)</Text>

                        <Text className="text-gray-600">
                            • Custom or predefined price ranges
                        </Text>

                        <Text className="text-gray-600">
                            Tap Apply Filters to see matching properties.
                        </Text>
                    </View>
                </View>

                {/* Saved Properties */}
                <View className="mt-5 bg-white rounded-3xl p-5">
                    <Text className="text-2xl font-bold mb-4">Saved Properties</Text>

                    <Text className="text-lg font-semibold">
                        How do I save a property?
                    </Text>

                    <Text className="text-gray-600 mt-2">
                        Tap the ❤️ icon on any property listing to save it for later
                        viewing.
                    </Text>

                    <View className="h-px bg-neutral-200 my-5" />

                    <Text className="text-lg font-semibold">
                        Why don't I see any saved properties?
                    </Text>

                    <Text className="text-gray-600 mt-2">
                        You haven't saved any properties yet. Browse listings and tap the
                        heart icon to add them to your saved collection.
                    </Text>
                </View>

                {/* Account */}
                <View className="mt-5 bg-white rounded-3xl p-5">
                    <Text className="text-2xl font-bold mb-4">Account & Profile</Text>

                    <View>
                        <Text className="text-lg font-semibold">
                            How do I edit my profile?
                        </Text>

                        <Text className="text-gray-600 mt-2">
                            Open the Profile tab, tap Edit Profile, make your changes and
                            save.
                        </Text>
                    </View>

                    <View className="h-px bg-neutral-200 my-5" />

                    <View>
                        <Text className="text-lg font-semibold">
                            How do I change my password?
                        </Text>

                        <Text className="text-gray-600 mt-2">
                            Navigate to Profile → Change Password and follow the
                            instructions.
                        </Text>
                    </View>

                    <View className="h-px bg-neutral-200 my-5" />

                    <View>
                        <Text className="text-lg font-semibold">
                            What does Member Since mean?
                        </Text>

                        <Text className="text-gray-600 mt-2">
                            It shows the month and year when your account was created.
                        </Text>
                    </View>

                    <View className="h-px bg-neutral-200 my-5" />

                    <View>
                        <Text className="text-lg font-semibold">
                            What does account status mean?
                        </Text>

                        <Text className="text-gray-600 mt-2">
                            Active means your account is fully operational and all app
                            features are available.
                        </Text>
                    </View>
                </View>

                {/* Search Tips */}
                <View className="mt-5 bg-white rounded-3xl p-5">
                    <Text className="text-2xl font-bold mb-4">Search Tips</Text>

                    <Text className="text-gray-600">• Use specific city names.</Text>

                    <Text className="text-gray-600">
                        • Apply filters for better results.
                    </Text>

                    <Text className="text-gray-600">• Save properties you like.</Text>

                    <Text className="text-gray-600">
                        • Check recommended properties regularly.
                    </Text>
                </View>

                {/* FAQ */}
                <View className="mt-5 bg-white rounded-3xl p-5">
                    <Text className="text-2xl font-bold mb-4">
                        Frequently Asked Questions
                    </Text>

                    <View className="gap-5">
                        <View>
                            <Text className="text-lg font-semibold">
                                Is Kribb free to use?
                            </Text>

                            <Text className="text-gray-600 mt-1">
                                Yes. Browsing and searching properties is completely free.
                            </Text>
                        </View>

                        <View>
                            <Text className="text-lg font-semibold">
                                Can I save multiple properties?
                            </Text>

                            <Text className="text-gray-600 mt-1">
                                Yes. There is no limit on saved properties.
                            </Text>
                        </View>

                        <View>
                            <Text className="text-lg font-semibold">
                                Do saved properties sync across devices?
                            </Text>

                            <Text className="text-gray-600 mt-1">
                                Yes, as long as you're logged into the same account.
                            </Text>
                        </View>

                        <View>
                            <Text className="text-lg font-semibold">
                                How do I remove a saved property?
                            </Text>

                            <Text className="text-gray-600 mt-1">
                                Tap the heart icon again to remove it from your saved
                                list.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Support */}
                <View className="mt-5 bg-white rounded-3xl p-5 mb-10">
                    <Text className="text-2xl font-bold mb-4">Need More Help?</Text>

                    <Text className="text-gray-600">
                        • Make sure you're using the latest version.
                    </Text>

                    <Text className="text-gray-600">
                        • Try signing out and signing back in.
                    </Text>

                    <Text className="text-gray-600">
                        • Contact support if the issue persists.
                    </Text>

                    <View className="mt-6 bg-neutral-50 rounded-2xl p-4">
                        <Text className="text-lg font-semibold">Contact Support</Text>

                        <Text className="text-blue-600 mt-1">
                            rudra.webnerd69@gmail.com
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
