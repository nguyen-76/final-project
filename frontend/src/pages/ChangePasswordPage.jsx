import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import userAtom from "../app/userAtom";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import useLogOut from "../hooks/useLogOut";

export default function ChangePasswordPage() {
  const [user, setUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [updating, setUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleLogout = useLogOut();
  const navigate = useNavigate();
  const showToast = useShowToast();

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/password/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inputs }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("error", data.error, "error");
        return;
      }
      showToast("Success", "Password updated successfully", "success");
      setUser(data);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
      await handleLogout();
      navigate("/auth");
    }
  };

  return (
    <form onSubmit={handleSubmitPassword}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
            Enter new password
          </Heading>
          <FormControl id="oldPassword" isRequired>
            <FormLabel>Current password</FormLabel>
            <InputGroup>
              <Input
                placeholder="Your old password"
                _placeholder={{ color: "gray.500" }}
                type={showPassword ? "text" : "password"}
                value={inputs.oldPassword}
                onChange={(e) => {
                  setInputs({ ...inputs, oldPassword: e.target.value });
                }}
              />
              <InputRightElement h={"full"}>
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="newPassword" isRequired>
            <FormLabel>New password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Your new password"
                _placeholder={{ color: "gray.500" }}
                value={inputs.newPassword}
                onChange={(e) => {
                  setInputs({ ...inputs, newPassword: e.target.value });
                }}
              />
              <InputRightElement h={"full"}>
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>{" "}
            </InputGroup>{" "}
            <Text fontSize={"x-small"}>
              Password must be 8 to 20 characters with 1 number, lowercase and
              uppercase
            </Text>
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              <Link as={RouterLink} to={"/"}>
                Cancel
              </Link>
            </Button>
            <Button
              bg={"blue.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "blue.500",
              }}
              type="submit"
              isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
