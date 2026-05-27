import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,

      login: (adminData) =>
        set({
          admin: {
            _id: adminData._id,
            name: adminData.name,
            email: adminData.email,
          },
          token: adminData.token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          admin: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "wedding-auth-storage",
    }
  )
);

export default useAuthStore;