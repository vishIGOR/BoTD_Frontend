import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { Role } from "../models/Role";
import { UserProfile } from "../models/User";
import { getCurrentUserProfile } from "../utils/requests";
import { getTokenData } from "../utils/storage";
import axios from "axios";
import { message } from "antd";

interface UserProfileContextType {
  userProfile: UserProfile | null;
  isLoading: boolean;
  getCurrentRole: () => string | null;
}

export const UserProfileContext = createContext<UserProfileContextType | null>(
  null
);

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const tokenData = getTokenData();
      if (!tokenData?.token) {
        navigate("/login");
        return;
      }

      try {
        const profile = await getCurrentUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            navigate("/login");
          } else {
            message.error(
              "Произошла ошибка при получении профиля пользователя"
            );
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const getCurrentRole = (): Role | null => {
    return userProfile?.role || null;
  };

  return (
    <UserProfileContext.Provider
      value={{ userProfile, isLoading, getCurrentRole }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfileContext = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};
