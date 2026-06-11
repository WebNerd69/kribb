import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Property } from "../types";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { formatPrice } from "../lib/utils";
import { useSavedProperty } from "../hooks/useSavedProperty";

export default function IndexPropertyCard({
    property,

}: {
    property: Property;

}) {
    const router = useRouter();


    return (
        <TouchableOpacity
            onPress={() => router.push(`/(root)/property/${property.id}`)}
            className="w-[95%] mx-auto mb-5 h-[130px] bg-bg rounded-3xl relative overflow-hidden flex-row"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 6,
                opacity: property.is_sold ? 0.5 : 1,
            }}
        >
            <View className="h-full w-[40%]">
                <Image
                    source={{ uri: property.images[0] }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
            </View>
            {property.is_sold && (
                <View className="px-3 py-1 top-4 left-4 rounded-xl bg-red-600 absolute">
                    <Text className="text-zinc-100 font-bold">Sold</Text>
                </View>
            )}

            <View className="p-4 gap-2 flex w-[60%] justify-between relative">
                <View className="gap-2">
                    <Text className="text-lg font-bold">{property.title.length>20 ?property.title.substring(0,30)+"..." : property.title}</Text>
                    <View className="flex-row opacity-60">
                        <Ionicons name="location-outline" size={13} />
                        <Text className="text-sm ">{`${property.city}`}</Text>
                    </View>
                </View>


                <View className="flex-row justify-between">
                    <Text className="text-primary font-bold text-lg">
                        {formatPrice(property.price)}
                    </Text>
                    <View className="flex-row gap-3 opacity-50 ">
                        <View className="flex-row gap-1">
                            <Ionicons name="bed-outline" size={13} />
                            <Text className="text-sm">{property.bedrooms}</Text>
                        </View>
                        <View className="flex-row gap-1">
                            <Ionicons name="expand-outline" size={13} />
                            <Text className="text-sm">{`${property.area_sqft} ft²`}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({});
