import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PropertyType, useSearchStore } from "../store/searchStore";

export default function FilterModal({
    visible,
    onClose,
}: {
    visible: boolean;
    onClose: () => void;
}) {
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

    const handleReset = () => {
        resetFilters();
        onClose();
    };

    const handleApply = () => {
        setType(localType);
        setBedrooms(localBedrooms);
        setMinPrice(localMin ? Number(localMin) : null);
        setMaxPrice(localMax ? Number(localMax) : null);

        onClose();
    };

    const PROPERTY_TYPES: { label: string; value: PropertyType }[] = [
        { label: "All", value: null },
        { label: "House", value: "house" },
        { label: "Studio", value: "studio" },
        { label: "Villa", value: "villa" },
        { label: "Apartment", value: "apartment" },
    ];

    const BEDS = [
        { label: "Any", value: null },
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4+", value: 4 },
    ];

    const PRICE_PRESET = [
        { label: "All", min: null, max: null },
        { label: "under ₹50L", min: 0, max: 5000000 },
        { label: "₹50L - ₹1cr", min: 5000000, max: 10000000 },
        { label: "₹1cr - ₹2cr", min: 10000000, max: 20000000 },
        { label: "₹2cr+", min: 20000000, max: null },
    ];

    const chip = (active: boolean) => {
        return `
  px-4 py-2 rounded-full border-2 ${active ? `border-blue-600 bg-blue-100` : `border-zinc-300 bg-bg`}
  `;
    };
    const chipText = (active: boolean) => {
        return `${active ? `text-blue-800` : `text-zinc-600`}`;
    };

    const [localType, setLocalType] = useState(type);
    const [localBedrooms, setLocalBedrooms] = useState(bedrooms);
    const [localMax, setLocalMax] = useState(maxPrice ? String(maxPrice) : "");
    const [localMin, setLocalMin] = useState(minPrice ? String(minPrice) : "");

    const activeFilterCount = [
        localType !== null,
        localBedrooms !== null,
        localMax !== "",
        localMin !== "",
    ].filter(Boolean).length;

    useEffect(() => {
        if (visible) {
            setLocalType(type);
            setLocalBedrooms(bedrooms);
        }
    }, [visible, type, bedrooms]);

    useEffect(() => {
        if (visible) {
            setLocalMax(maxPrice ? String(maxPrice) : "");
            setLocalMin(minPrice ? String(minPrice) : "");
        }
    }, [visible, maxPrice, minPrice]);
    return (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            animationType="slide"
            presentationStyle="pageSheet"
            backdropColor={"#f5f5f5"}
        >
            <SafeAreaView className="w-full h-full">
                <View className="flex-1 bg-gray-50 p-3">
                    {/* header */}
                    <View className="flex-row justify-between items-center pt-2 px-[10px]">
                        <Pressable onPress={onClose}>
                            <Ionicons className="" name="close-outline" size={24} />
                        </Pressable>
                        <Text className="text-xl font-bold">Filters</Text>
                        <Pressable onPress={handleReset}>
                            <Text className="text-primary text-lg">Reset</Text>
                        </Pressable>
                    </View>

                    {/* filters */}

                    <ScrollView
                        className="flex-1 "
                        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* property type */}
                        <Text className="text-lg font-bold mb-3">Property type</Text>
                        <View className="flex-row flex-wrap gap-3 mb-6">
                            {PROPERTY_TYPES.map((item) => {
                                return (
                                    <TouchableOpacity
                                        key={String(item.value)}
                                        onPress={() => setLocalType(item.value)}
                                        className={chip(localType === item.value)}
                                    >
                                        <Text
                                            className={chipText(localType === item.value)}
                                        >
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* bedrooms */}
                        <Text className="text-lg font-bold mb-3">Bedrooms</Text>
                        <View className="flex-row flex-wrap gap-3 mb-6">
                            {BEDS.map((item) => {
                                return (
                                    <TouchableOpacity
                                        key={String(item.value)}
                                        onPress={() => setLocalBedrooms(item.value)}
                                        className={`min-w-16 justify-center items-center ${chip(localBedrooms === item.value)}`}
                                    >
                                        <Text
                                            className={chipText(
                                                localBedrooms === item.value,
                                            )}
                                        >
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* price input */}
                        <Text className="text-lg font-bold mb-3">Price range ( ₹ )</Text>
                        <View className="flex-2 flex-row gap-3 justify-between mb-5">
                            <View className="w-[50%]">
                                <Text className="text-lg font-medium mb-2">
                                    Min price
                                </Text>
                                <TextInput
                                    onChangeText={setLocalMin}
                                    value={localMin}
                                    placeholder="₹0"
                                    className="w-full text-lg px-5 py-3 rounded-xl bg-bg"
                                    style={{ elevation: 2, shadowOpacity: 0.06 }}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View className="w-[50%]">
                                <Text className="text-lg font-medium mb-2">
                                    Max price
                                </Text>
                                <TextInput
                                    onChangeText={setLocalMax}
                                    value={localMax}
                                    placeholder="₹0"
                                    className="w-full text-lg px-5 py-3 rounded-xl bg-bg"
                                    style={{ elevation: 2, shadowOpacity: 0.06 }}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                        <View className="flex-row flex-wrap gap-3 mb-6">
                            {PRICE_PRESET.map((item) => {
                                const active =
                                    maxPrice === item.max && minPrice === item.min;
                                return (
                                    <TouchableOpacity
                                        key={String(item.label)}
                                        onPress={() => {
                                            setLocalMax(item.max ? String(item.max) : "");
                                            setLocalMin(item.min ? String(item.min) : "");
                                            setMaxPrice(item.max);
                                            setMinPrice(item.min);
                                        }}
                                        className={chip(active)}
                                    >
                                        <Text className={chipText(active)}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>
                    <View className="flex w-full absolute bottom-7 left-3 justify-center items-center">
                        <TouchableOpacity
                            className="py-5 mx-auto justify-center items-center w-[80%] rounded-3xl bg-zinc-900"
                            onPress={handleApply}
                            style={{
                                shadowColor: "#2563EB",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 4,
                            }}
                        >
                            <Text className="text-white font-medium text-xl">
                                {`Apply filters ( ${activeFilterCount} )`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({});
