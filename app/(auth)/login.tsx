import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function login() {
    const router = useRouter();
    const { signIn, errors, fetchStatus } = useSignIn();

    const [hidePassword, setHidePassword] = useState(true);
    const [otpSent, setOtpSent] = useState(false);

    //   form handling
    const [password, setPassword] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [code, setCode] = useState("");
    const [buttonPressed, setButtonPressed] = useState(false);

    // error handler state
    const [wrongPass, setWrongPass] = useState(false);
    const [wrongEmail, setWrongEmail] = useState(false);

    // useeffect
    useEffect(() => {
        if (emailAddress === "" && wrongEmail) {
            setWrongEmail(false);
        }

        if (password === "" && wrongPass) {
            setWrongPass(false);
        }
    }, [password, emailAddress]);

    const handleSubmit = async () => {
        setButtonPressed(true);
        console.log(JSON.stringify(errors));
        const { error } = await signIn.password({
            emailAddress,
            password,
        });
        if (error) {
            console.log(error.message);
            if (error.message.includes("Password is incorrect")) {
                setWrongPass(true);
            } else if (error.message.includes("Couldn't find your account")) {
                setWrongEmail(true);
            }
            setButtonPressed(false);
            return;
        }

        if (signIn.status === "complete") {
            await signIn.finalize({
                navigate: ({ session, decorateUrl }) => {
                    if (session?.currentTask) {
                        console.log(session?.currentTask);
                        return;
                    }
                    const url = decorateUrl("/");
                    router.replace(url as any);
                },
            });
        } else if (signIn.status === "needs_second_factor") {
            const { error } = await signIn.mfa.sendEmailCode();
            if (!error) {
                setOtpSent(true);
                setButtonPressed(false);
            }
        } else if (signIn.status === "needs_client_trust") {
            const emailCodeFactor = signIn.supportedSecondFactors.find(
                (factor) => factor.strategy === "email_code",
            );
            if (emailCodeFactor) {
                await signIn.mfa.sendEmailCode().then(() => setOtpSent(true));
                setButtonPressed(false);
            }
        } else {
            console.error("Sign-in attempt not complete:", signIn);
        }
    };

    const handleVerify = async () => {
        setButtonPressed(true);
        await signIn.mfa.verifyEmailCode({ code });

        if (signIn.status === "complete") {
            await signIn.finalize({
                navigate: ({ session, decorateUrl }) => {
                    if (session?.currentTask) {
                        console.log(session?.currentTask);
                        return;
                    }

                    // If no session tasks, navigate the signed-in user to the home page
                    const url = decorateUrl("/");
                    router.replace(url as any);
                    setButtonPressed(false);
                },
            });
        } else {
            console.error("Sign-in attempt not complete:", signIn);
        }
    };

    const fetching = fetchStatus == "fetching";

    return (
        <View className="w-full h-full flex justify-center items-center">
            <View className="w-[90%] gap-6">
                <Image
                    source={require("../../assets/images/kribb.png")}
                    className="w-32 h-20"
                    resizeMode="contain"
                />

                <Text className="text-2xl font-medium">Welcome back!</Text>

                <View className="gap-4">
                    {/* email input */}

                    <View className="bg-[#fffaf8] px-5 py-3 rounded-xl">
                        {wrongEmail ? (
                            <Text className="text-red-500">Wrong email</Text>
                        ) : (
                            <Text>Email</Text>
                        )}
                        <TextInput
                            keyboardType="email-address"
                            className="w-full h-10"
                            placeholder="email@domain.com"
                            value={emailAddress}
                            onChangeText={setEmailAddress}
                        />
                    </View>

                    {/* password input */}
                    <View className="bg-[#fffaf8] px-5 py-3 rounded-xl">
                        {wrongPass ? (
                            <Text className="text-red-500">Wrong password</Text>
                        ) : (
                            <Text>Password</Text>
                        )}
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
                                    <Image
                                        source={require("../../assets/images/eye.png")}
                                    />
                                ) : (
                                    <Image
                                        source={require("../../assets/images/eye-off.png")}
                                    />
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
                                {fetching ? (
                                    <ActivityIndicator color={"#fff"} />
                                ) : (
                                    <Text className={`text-xl text-center text-bg`}>
                                        Login
                                    </Text>
                                )}
                            </Pressable>
                        )}

                        {otpSent && (
                            <Pressable
                                className={`w-[60%] h-14 rounded-xl bg-zinc-900 ${buttonPressed ? "opacity-45" : "opacity-100"} justify-center mt-10`}
                                onPress={handleVerify}
                                disabled={buttonPressed}
                            >
                                {fetching ? (
                                    <ActivityIndicator color={"#fff"} />
                                ) : (
                                    <Text
                                        className={`text-xl text-center ${otpSent && code.length !== 6 ? "text-zinc-600" : "text-bg"}`}
                                    >
                                        Submit OTP
                                    </Text>
                                )}
                            </Pressable>
                        )}
                    </View>

                    {/* bottom text */}
                    <Text className="text-sm mt-5 w-full text-center text-zinc-500">
                        Don't have an account?{" "}
                        <Text
                            className="text-zinc-900"
                            onPress={() => router.navigate("/signup")}
                        >
                            Sign up
                        </Text>
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({});
