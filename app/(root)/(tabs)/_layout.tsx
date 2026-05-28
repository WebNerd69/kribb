import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../../store/userStore";
import useUserSync from "../../../hooks/useUserSync";
import { SafeAreaView } from "react-native-safe-area-context";
export default function _layout() {
  useUserSync();
  const { isAdmin, isLoading } = useUserStore((state) => state);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={"large"} color={"black"} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 , paddingHorizontal:16}} className="bg-bg">
    <Tabs
      key={isAdmin ? "admin" : "normal"}
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#121212",
          alignItems: "center",
          borderTopWidth: 0,
          elevation: 4,
          shadowOpacity: 0.06,
          shadowColor: "rgba(000 , 000 , 000,1)",
          height: 60,
          marginHorizontal: 16,
          marginBottom: 20,
          borderRadius: 28,
          paddingHorizontal: 8,
          overflow: "hidden",
          borderWidth: 0,
          borderColor: "#000",
        },
        sceneStyle: {
          backgroundColor: "transparent",
        },

        tabBarItemStyle: {
          overflow: "hidden",
          marginVertical: 10,
          borderRadius: 20,
        },

        tabBarActiveTintColor: "#121212",
        tabBarInactiveTintColor: "#f5f5f564",

        tabBarActiveBackgroundColor: "#f5f5f5",

        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add" size={size} color={color} />
          ),
          tabBarButton: isAdmin ? undefined : () => null,
          tabBarItemStyle: isAdmin
            ? {
                overflow: "hidden",
                marginVertical: 10,
                borderRadius: 20,
              }
            : {
                width: 0,
                height: 0,
                maxWidth: 0,
                minWidth: 0,
                padding: 0,
                margin: 0,
                opacity: 0,
                flexBasis: 0,
                flexGrow: 0,
                flexShrink: 1,
                overflow: "hidden",
              },
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
