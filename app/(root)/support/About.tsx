import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function About() {
    const router = useRouter();
    return (
        <SafeAreaView>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerClassName="px-5 pt-4 pb-10"
            >
                {/* Header */}
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

                {/* Intro */}
                <View className="mt-8 bg-white rounded-3xl  p-5">
                    <Text className="text-2xl font-bold mb-4">Welcome to Kribb</Text>

                    <Text className="text-gray-600 leading-6">
                        Kribb is a modern real estate platform designed to simplify
                        property discovery. Whether you're searching for your dream home,
                        a luxury villa, an apartment, or an investment property, Kribb
                        helps you find the right place quickly and efficiently.
                    </Text>
                </View>

                {/* Mission */}
                <View className="mt-5 bg-white rounded-3xl  p-5">
                    <Text className="text-2xl font-bold mb-4">Our Mission</Text>

                    <Text className="text-gray-600 leading-6">
                        We believe finding a property should be simple, transparent, and
                        enjoyable. Our mission is to connect people with properties that
                        match their needs through an intuitive and reliable experience.
                    </Text>
                </View>

                {/* Why Choose */}
                <View className="mt-5 bg-white rounded-3xl  p-5">
                    <Text className="text-2xl font-bold mb-4">Why Choose Kribb?</Text>

                    <View className="gap-3">
                        <Text className="text-gray-600">✓ Easy property discovery</Text>

                        <Text className="text-gray-600">
                            ✓ Powerful search and filters
                        </Text>

                        <Text className="text-gray-600">
                            ✓ Save your favorite listings
                        </Text>

                        <Text className="text-gray-600">
                            ✓ Clean and modern user experience
                        </Text>

                        <Text className="text-gray-600">
                            ✓ Personalized recommendations
                        </Text>
                    </View>
                </View>

                {/* Features */}
                <View className="mt-5 bg-white rounded-3xl  p-5">
                    <Text className="text-2xl font-bold mb-4">Features</Text>

                    <View className="gap-4">
                        <View>
                            <Text className="font-semibold text-lg">Property Search</Text>

                            <Text className="text-gray-600">
                                Search properties by city, name, and location.
                            </Text>
                        </View>

                        <View>
                            <Text className="font-semibold text-lg">
                                Advanced Filters
                            </Text>

                            <Text className="text-gray-600">
                                Narrow down listings using property type, bedroom count,
                                and price range.
                            </Text>
                        </View>

                        <View>
                            <Text className="font-semibold text-lg">
                                Saved Properties
                            </Text>

                            <Text className="text-gray-600">
                                Keep track of your favorite listings for quick access
                                later.
                            </Text>
                        </View>

                        <View>
                            <Text className="font-semibold text-lg">
                                Personalized Experience
                            </Text>

                            <Text className="text-gray-600">
                                Enjoy recommendations tailored to your interests.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* App Information */}
                <View className="mt-5 bg-white rounded-3xl  p-5">
                    <Text className="text-2xl font-bold mb-4">App Information</Text>

                    <View className="gap-3">
                        <View className="flex-row justify-between">
                            <Text className="text-gray-500">Version</Text>

                            <Text className="font-semibold">1.0.0</Text>
                        </View>

                        <View className="flex-row justify-between">
                            <Text className="text-gray-500">Platform</Text>

                            <Text className="font-semibold">Android & iOS</Text>
                        </View>

                        <View className="flex-row justify-between">
                            <Text className="text-gray-500">Last Updated</Text>

                            <Text className="font-semibold">May 2026</Text>
                        </View>
                    </View>
                </View>

                {/* Contact */}
                <View className="mt-5 mb-10 bg-white rounded-3xl  p-5">
                    <Text className="text-2xl font-bold mb-4">Contact Us</Text>

                    <Text className="text-gray-600 leading-6">
                        Have questions, feedback, or suggestions? We'd love to hear from
                        you.
                    </Text>

                    <View className="mt-5 gap-2">
                        <Text className="font-medium">📧 rudra.webnerd69@gmail.com</Text>

                        <Text className="font-medium">🌐 www.kribb.com</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
