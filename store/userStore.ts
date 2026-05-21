import {create} from "zustand"

interface userStore {
     isAdmin : boolean;
     isLoading : boolean;
     setIsLoading : (value: boolean) => void;
     setIsAdmin : (value:boolean) => void;
}

export const useUserStore =create<userStore>((set)=>({
     isAdmin:false,
     isLoading:false,
     setIsLoading: (value) =>set({isLoading:value}),
     setIsAdmin: (value)=> set({isAdmin:value})
}))