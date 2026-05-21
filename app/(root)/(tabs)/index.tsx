import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/expo";
import { useFocusEffect, useRouter } from "expo-router";
import { Property } from "../../../types";
import { supabaseClient } from "../../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import FeaturedCard from "../../../components/FeaturedCard";
import PropertyCard from "../../../components/PropertyCard";

export default function index() {
  const { user } = useUser();
  const router = useRouter();

  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setrecommended] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    try {
      const { data: featuredData } = await supabaseClient
        .from("properties")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });

      const { data: recommendedData } = await supabaseClient
        .from("properties")
        .select("*")
        .eq("is_featured", false)
        .order("created_at", { ascending: false })
        .limit(20);

      setFeatured(featuredData ?? []);
      setrecommended(recommendedData ?? []);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  return (
    <View className="w-full h-full">
      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* header */}
            <View className="flex-row justify-between items-center">
              <Image
                source={require("../../../assets/images/kribb.png")}
                className="w-24 h-24 "
                resizeMode="contain"
              />
              <View>
                <Text className="text-normal font-medium text-zinc-900">
                  Welcome back 👋
                </Text>
                <Text className="text-xl font-bold text-zinc-900">
                  {user?.firstName}
                </Text>
              </View>
            </View>

            {/* search and filter btn */}
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tabs)/search")}
              className="flex-row justify-between items-center py-3"
            >
              <View className="flex-row gap-3 items-center">
                <Ionicons
                  name="search-outline"
                  size={20}
                  color={"#666"}
                  className="opacity-80"
                />
                <Text className="text-zinc-600 opacity-80">
                  Search properties , cities ...
                </Text>
              </View>

              <TouchableOpacity
                onPress={() =>
                  router.push("/(root)/(tabs)/search?openFilters=true")
                }
              >
                <Ionicons
                  name="menu"
                  className="p-2 rounded-lg bg-zinc-800 "
                  color={"#fff"}
                  size={20}
                />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* featured section */}

            <View className="w-full ">
              <Text className="text-xl font-bold mb-5">
                Featured Properties
              </Text>
              {!featured ? (
                <View className="flex-row justify-center">
                  <Text className="pb-5">No properties found... </Text>
                </View>
              ) : (
                <View className="flex-row gap-5 items-center">
                  {loading ? (
                    <ActivityIndicator color={"black"} />
                  ) : (
                    <FlatList
                      data={featured}
                      keyExtractor={(item) => item.id}
                      className="pb-5 "
                      renderItem={({ item }) => (
                        <FeaturedCard property={item} />
                      )}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      // contentContainerStyle={{ paddingHorizontal: 20 }}
                    />
                  )}
                </View>
              )}
            </View>

            {/* recommended header */}

            <Text className="font-bold text-xl text-zinc-900 mb-5">
              Recommended
            </Text>
          </View>
        }
        renderItem={({ item }) => <PropertyCard property={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
