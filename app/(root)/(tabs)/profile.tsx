import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useClerk } from "@clerk/expo";
import { router } from "expo-router";
export default function profile() {
  const { signOut } = useClerk();

  const handleSignOut = async()=>{
    try {
      await signOut();
      router.replace("/login")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View>
      <Pressable
        onPress={handleSignOut}
        className="p-4 bg-zinc-900 w-[30%] rounded-2xl items-center "
      >
        <Text className="text-white font-semibold tracking-wider">Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({});
