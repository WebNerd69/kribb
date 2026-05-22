import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Property } from "../../../types";
import { useSearchStore } from "../../../store/searchStore";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { supabaseClient } from "../../../lib/supabase";
import PropertyCard from "../../../components/PropertyCard";
import FilterModal from "../../../components/FilterModal";
import { formatPrice } from "../../../lib/utils";
import FilterChip from "../../../components/FilterChip";

export default function search() {
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  const { openFilters } = useLocalSearchParams<{ openFilters?: string }>();

  const {
    search,
    maxPrice,
    minPrice,
    type,
    bedrooms,
    setSearch,
    setMaxPrice,
    setMinPrice,
    setBedrooms,
    setType,
    resetFilters,
  } = useSearchStore();

  const fetchQueriedProperties = async () => {
    setLoading(true);

    let query = supabaseClient.from("properties").select("*");
    if (search) {
      query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%`);
    }
    if (bedrooms) {
      query = query.eq("bedrooms", bedrooms);
    }
    if (type) {
      query = query.eq("type", type);
    }
    if (minPrice) {
      query = query.gte("price", minPrice);
    }
    if (maxPrice) {
      query = query.lte("price", maxPrice);
    }

    try {
      const { data: data } = await query
        .order("created_at", { ascending: false })
        .limit(20);
      setProperties(data ? data : []);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const activeFilterCount = [
    type !== null,
    bedrooms !== null,
    maxPrice !== null,
    minPrice !== null,
  ].filter(Boolean).length;

  const filterChips = [
    {
      key: "1001",
      title: type ? type : "",
      removeFilter: () => setType(null),
    },
    {
      key: "1002",
      title: bedrooms ? String(bedrooms) : "",
      removeFilter: () => setBedrooms(null),
    },
    {
      key: "1003",
      title: minPrice ? formatPrice(minPrice) : "",
      removeFilter: () => {
        setMinPrice(null);
        setMaxPrice(null);
      },
    },
    {
      key: "1004",
      title: maxPrice ? formatPrice(maxPrice) : "",
      removeFilter: () => {
        setMinPrice(null);
        setMaxPrice(null);
      },
    },
  ];

  useFocusEffect(
    useCallback(() => {
      fetchQueriedProperties();
    }, [search, maxPrice, minPrice, bedrooms, type]),
  );

  useEffect(() => {
    if (openFilters === "true") {
      setShowFilter(true);
    }
  }, [openFilters]);

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      // console.log(searchInput)
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, setSearch]);

  return (
    <View className="w-full h-full relative pt-5">
      <Text className="text-3xl font-bold pb-5">Find properties</Text>

      <View className="flex-row justify-between py-3 mb-5 items-center">
        <View className="flex-row items-center relative">
          <Ionicons name="search-outline" className="opacity-55" size={20} />
          <TextInput
            className="w-[80%]"
            placeholder="Search properties , cities..."
            onChangeText={setSearchInput}
            value={searchInput}
            autoCapitalize="none"
          />
          {searchInput.length > 0 && (
            <Pressable
              onPress={() => setSearchInput("")}
              className="absolute right-0 top-2"
            >
              <Ionicons name="close-circle" size={20} className="opacity-55" />
            </Pressable>
          )}
        </View>

        <TouchableOpacity
          className={`p-2 rounded-lg ${activeFilterCount > 0 ? "bg-zinc-900" : "bg-zinc-500"}`}
          onPress={() => setShowFilter(true)}
        >
          <Ionicons name="menu" size={20} color={"white"} />
        </TouchableOpacity>
      </View>

      {activeFilterCount > 0 && (
        <View className="flex-row gap-3 flex-wrap mb-5">
          {filterChips.map((item) => {
            return (
              <FilterChip
                key={item.key}
                title={item?.title}
                removeFilter={item.removeFilter}
              />
            );
          })}
        </View>
      )}

      {loading ? (
        <ActivityIndicator
          className="h-[60%] "
          size={"large"}
          color={"black"}
        />
      ) : (
        <View className="w-full gap-5 flex-1">
          {properties.length === 0 ? (
            <View className="items-center h-40 justify-center">
              <Text className="text-zinc-900 opacity-50 text-lg font-medium">
                No properties found...
              </Text>
            </View>
          ) : (
            <FlatList
              data={properties}
              keyExtractor={(item) => item.id}
              className="pb-5 "
              renderItem={({ item }) => <PropertyCard property={item} />}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <Text className="font-bold text-xl mb-5">
                  Filtered properties...
                </Text>
              }
              ListFooterComponent={<View className="mt-40"></View>}
            />
          )}
        </View>
      )}

      {/* filter modal */}

      <FilterModal visible={showFilter} onClose={() => setShowFilter(false)} />
    </View>
  );
}

const styles = StyleSheet.create({});
