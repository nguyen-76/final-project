import { useSetRecoilState } from "recoil";
import userAtom from "../app/userAtom";
import useShowToast from "./useShowToast";

const useLogOut = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      localStorage.removeItem("user-info");
      setUser(null);
    } catch (error) {
      showToast("Error", error, "error");
    }
  };
  return handleLogout;
};

export default useLogOut;
