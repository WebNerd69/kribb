import { useUser } from "@clerk/expo";
import { useUserStore } from "../store/userStore";
import { useSupabase } from "./useSupabase";
import { useEffect } from "react";

const useUserSync = () => {
  const { user } = useUser();
  const setIsAdmin = useUserStore((state) => state.setIsAdmin);
  const setIsLoading = useUserStore((state) => state.setIsLoading);
  const authSupabase = useSupabase();

  useEffect(() => {
    if (!user) return;
    syncUser();
    setIsLoading(true);
  }, [user]);

  const syncUser = async () => {
    if (!user) return;

    const { data, error } = await authSupabase
      .from("users")
      .select("clerk_id, is_admin")
      .eq("clerk_id", user.id)
      .single();

    if (data) {
      // console.log(data)
      setIsAdmin(data.is_admin ?? false);
      setIsLoading(false);
      return;
    }
    if (error) {
      console.log("ERROR : ", error);
      setIsLoading(false);
    }

    const { data: newUser, error: insertError } = await authSupabase
      .from("users")
      .insert({
        clerk_id: user.id,
        email: user.emailAddresses[0].emailAddress,
        first_name: user.firstName,
        last_name: user.lastName,
        avatar_url: user.imageUrl,
        is_admin: false,
      })
      .select("is_admin")
      .single();

    if (newUser) {
      setIsLoading(false);
    }
    if (insertError) {
      console.log("Insert error:", insertError);
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    setIsAdmin(newUser?.is_admin ?? false);
  };
};

export default useUserSync;
