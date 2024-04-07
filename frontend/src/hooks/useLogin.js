import { useState } from "react";
import useShowToast from "./useShowToast";
import userAtom from "../app/userAtom";
import { useSetRecoilState } from "recoil";

const useLogin = () => {
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const setUser = useSetRecoilState(userAtom);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      localStorage.setItem("user-info", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
  };
  return { handleLogin, inputs, setInputs, loading, setLoading };
};

export default useLogin;
