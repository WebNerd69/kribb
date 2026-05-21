import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth, useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";

export default function signup() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [hidePassword, setHidePassword] = useState(true);
  const [otpSent, setOtpSent] = useState(false);

  //   form handling
  const [password, setPassword] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [code, setCode] = useState("");
  const [buttonPressed , setButtonPressed] = useState(false)

  const handleSubmit = async () => {
    setButtonPressed(true);
    const { error } = await signUp.password({
      emailAddress,
      password,
      firstName,
      lastName
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (!error) {
      await signUp.verifications.sendEmailCode().then(() => setOtpSent(true));
      setButtonPressed(false)
    }
  };

  const handleVerify = async () => {
    setButtonPressed(true)
    await signUp.verifications.verifyEmailCode({
      code,
    });
    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl("/");
          router.replace(url as any);
          setButtonPressed(false)
        },
      });
    } else {
      // Check why the sign-up is not complete
      console.error("Sign-up attempt not complete:", signUp);
    }
  };

  const fetching = fetchStatus === "fetching";

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }


  return (
    <View className="w-full h-full flex justify-center items-center">
      <View className="w-[90%] gap-6">
        <Image
          source={require("../../assets/images/kribb.png")}
          className="w-32 h-20"
          resizeMode="contain"
        />
        <Text className="text-2xl font-medium">Create an account</Text>

        <View className="flex flex-row gap-4 w-full">
          <View className="bg-[#fffaf8] w-[50%] px-5 py-3 rounded-xl">
            <Text>First name</Text>
            <TextInput
              className="w-full h-10"
              placeholder="John"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View className="bg-[#fffaf8] w-[50%] px-5 py-3 rounded-xl">
            <Text>Last name</Text>
            <TextInput
              className="w-full h-10"
              placeholder="Doe"
              value={lastName}
              onChangeText={setlastName}
            />
          </View>
        </View>

        <View className="gap-4">
          <View className="bg-[#fffaf8] px-5 py-3 rounded-xl">
            <Text>Email</Text>
            <TextInput
              keyboardType="email-address"
              className="w-full h-10"
              placeholder="email@domain.com"
              value={emailAddress}
              onChangeText={setEmailAddress}
            />
          </View>

          <View className="bg-[#fffaf8] px-5 py-3 rounded-xl">
            <Text>Password</Text>
            <View className="w-full h-10 flex flex-row items-center justify-between">
              <TextInput
                className="w-[80%] h-10"
                placeholder="********"
                secureTextEntry={hidePassword}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setHidePassword(!hidePassword)}>
                {hidePassword ? (
                  <Image source={require("../../assets/images/eye.png")} />
                ) : (
                  <Image source={require("../../assets/images/eye-off.png")} />
                )}
              </Pressable>
            </View>
          </View>

          {/* otp input */}
          {otpSent && (
            <View className="bg-[#fffaf8] px-5 py-3 rounded-xl">
              <Text>Enter OTP</Text>
              <TextInput
                keyboardType="numeric"
                className="w-full h-10"
                placeholder="_ _ _ _ _ _"
                value={code}
                onChangeText={setCode}
              />
            </View>
          )}

          {/* submit button */}
          <View className="items-center">
            {!otpSent && (
              <Pressable
                className="w-[60%] h-14 rounded-xl bg-zinc-900 justify-center mt-10"
                onPress={handleSubmit}
                disabled={buttonPressed}
              >
                {fetching ? <ActivityIndicator color={'#fff'}/> :<Text className={`text-xl text-center text-bg`}>Send OTP</Text>}
              </Pressable>
            )}

            {otpSent && (
              <Pressable
                className="w-[60%] h-14 rounded-xl bg-zinc-900 justify-center mt-10"
                onPress={handleVerify}
                disabled={buttonPressed}
              >
                {fetching ? <ActivityIndicator color={"#fff"}/> 
                
                :
                
                <Text
                  className={`text-xl text-center ${otpSent && code.length !== 6 ? "text-zinc-600" : "text-bg"}`}
                >
                  Signup
                </Text>}
              </Pressable>
            )}
          </View>

          <Text className="text-sm mt-5 w-full text-center text-zinc-500">
            Already have an account?{" "}
            <Text
              className="text-zinc-900"
              onPress={() => router.navigate("/login")}
            >
              Login
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
