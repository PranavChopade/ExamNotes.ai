import { useDispatch } from "react-redux";
import { api, register, logout, profile } from "../services/api";
import { setUserData } from "../redux/userSlice";

export const useUser = () => {
  const dispatch = useDispatch();

  /**
   * Register a new user with their Google profile data
   * @param {Object} params - User registration data
   * @param {string} params.name - User's display name
   * @param {string} params.email - User's email from Google
   */
  const registerHandler = async ({ name, email }) => {
    try {
      const data = await register({ name, email });
      dispatch(setUserData(data.user));
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  /**
   * Logout the current user
   * Clears user data from Redux store
   */
  const logoutHandler = async () => {
    try {
      const data = await logout();
      dispatch(setUserData(null));
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  /**
   * Fetch and update user profile
   * Useful for refreshing user data (e.g., after credit changes)
   */
  const profileHandler = async () => {
    try {
      const data = await profile();
      dispatch(setUserData(data.user));
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return {
    registerHandler,
    logoutHandler,
    profileHandler,
  };
};