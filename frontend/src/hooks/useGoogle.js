import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import useShowToast from "./useShowToast";
import { app } from "../context/Firebase";
import { useSetRecoilState } from "recoil";
import userAtom from "../app/userAtom";

const useGoogle = () => {
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const handleGoogleSubmit = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          profilePicture: result.user.photoURL,
        }),
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.message, "error");
        return;
      }
      localStorage.setItem("user-info", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      showToast("Error", error, "error");
    }
  };
  return { handleGoogleSubmit };
};

export default useGoogle;
