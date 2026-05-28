import AsyncStorage from "@react-native-async-storage/async-storage";

export const setCache = async (key: string, data: any, ttl: number) => {
    try {
        await AsyncStorage.setItem(
            key,
            JSON.stringify({ data: data, expiry: Date.now() + ttl * 1000 }),
        );
    } catch (error) {
        console.log(error);
    }
};

export const getCache = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (!value) return null;

        const parsed = JSON.parse(value);

        if (parsed.expiry < Date.now()) {
            await AsyncStorage.removeItem(key);
            return null;
        }
        return parsed.data;
    } catch (error) {
        console.log(error);
    }
};