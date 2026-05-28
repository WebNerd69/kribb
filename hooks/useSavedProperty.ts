import { useAuth } from "@clerk/expo";
import { useEffect, useState } from "react";
import { useSupabase } from "./useSupabase";

export const useSavedProperty = (propertyId: string, onUnsave?: () => void) => {
    const { userId } = useAuth();
    const authSupabase = useSupabase();

    const [isSaved, setIsSaved] = useState(false);
    const [saveLoading, setsaveLoading] = useState(false);

    const checkIfSaved = async () => {
        if (!userId) return;

        try {
            const { data } = await authSupabase
                .from("saved_properties")
                .select("id")
                .eq("user_clerk_id", userId)
                .eq("property_id", propertyId)
                .single();
            setIsSaved(!!data);
        } catch (error) {
            console.log(error);
        }
    };

    const toggleSave = async () => {
        if (saveLoading || !userId) return;
        setsaveLoading(true);
        if (isSaved) {
            const data = await authSupabase
                .from("saved_properties")
                .delete()
                .eq("user_clerk_id", userId)
                .eq("property_id", propertyId);
            setsaveLoading(false);
            setIsSaved(false);
            onUnsave?.();
        } else {
            const data = await authSupabase
                .from("saved_properties")
                .insert({ user_clerk_id: userId, property_id: propertyId });
            setsaveLoading(false);
            setIsSaved(true);
        }
    };

    useEffect(() => {
        checkIfSaved();
    }, [userId, propertyId]);

    return { saveLoading, isSaved, toggleSave };
};
