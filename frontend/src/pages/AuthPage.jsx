import SignupForm from "../components/Form/SignUpForm";
import { useRecoilValue } from "recoil";
import LoginForm from "../components/Form/LoginForm";
import authScreenAtom from "../app/authAtom";

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  return <>{authScreenState === "login" ? <LoginForm /> : <SignupForm />}</>;
};

export default AuthPage;
