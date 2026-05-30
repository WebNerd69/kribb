import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Property } from "../types";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { formatPrice } from "../lib/utils";

export default function FeaturedCard({ property }: { property: Property }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push(`/(root)/property/${property.id}`)}
      className="w-[270px] bg-bg mx-3 rounded-3xl relative overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
        opacity: property.is_sold ? 0.5 : 1,
      }}
    >
      <View className="w-[270px] h-[150px]">
        <Image
          source={{ uri: property.images[0] }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <View className="px-3 py-1 rounded-2xl bg-zinc-100/70 absolute top-3 left-3">
        <Text className="text-primary capitalize">{property.type}</Text>
      </View>
      {property.is_sold && (
        <View className="px-3 py-1 rounded-2xl bg-red-600 absolute top-3 right-3">
          <Text className="text-white capitalize">Sold</Text>
        </View>
      )}
      <View className="px-3 py-2 justify-between">
        <Text className="text-xl font-bold">{property.title.length>20 ?property.title.substring(0,30)+"..." : property.title}</Text>
        <View className=" flex-row items-center opacity-60 pb-3">
          <Ionicons name="location-outline" size={13} />
          <Text className="text-sm">{`${property.address.length >30 ?property.address.substring(0 ,30) + "...":property.address} , ${property.city}`}</Text>
        </View>

        <View className="flex-row justify-between pb-2">
          <Text className="text-primary font-bold text-lg">{formatPrice(property.price)}</Text>
          <View className="flex-row gap-3">
               <View className="flex-row gap-1">
                    <Ionicons name="bed-outline" size={13}/>
                    <Text className="opacity-60">{property.bedrooms}</Text>
               </View>
               <View className="flex-row gap-1">
                    <Ionicons name="water-outline" size={13}/>
                    <Text className="opacity-60">{property.bathrooms}</Text>
               </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
