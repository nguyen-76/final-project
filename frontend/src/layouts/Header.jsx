import {
  Button,
  Flex,
  Image,
  Input,
  Link,
  Stack,
  useColorMode,
} from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../app/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { TbLogout } from "react-icons/tb";
import useLogOut from "../hooks/useLogOut";
import authScreenAtom from "../app/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const [searchingUser, setSearchingUser] = useState(false);
  const [searchText, setSearchText] = useState("");
  const handleLogout = useLogOut();
  const navigate = useNavigate();
  const setAuthScreen = useSetRecoilState(authScreenAtom);

  const showToast = useShowToast();

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/search?username=${searchText}`);
      const searchUser = await res.json();
      console.log(searchUser);
      if (searchUser.error) {
        showToast("Error", searchUser.message, "error");
        return;
      }
      navigate(`/${searchUser.users[0].username}`);
      setSearchText("");
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setSearchingUser(false);
    }
  };

  return (
    <Stack>
      <Flex justifyContent={"space-between"} mt={6} mb={12}>
        {user && (
          <Link as={RouterLink} to="/">
            <AiFillHome size={24} />
          </Link>
        )}
        {!user && (
          <Link
            as={RouterLink}
            to={"/auth"}
            onClick={() => setAuthScreen("login")}
          >
            Login
          </Link>
        )}
        <Image
          cursor={"pointer"}
          alt="logo"
          w={6}
          src={colorMode === "dark" ? "/light-logo.png" : "/dark-logo.png"}
          onClick={toggleColorMode}
        />
        {user && (
          <Flex alignItems={"center"} gap={4}>
            <Link as={RouterLink} to={`/${user.username}`}>
              <RxAvatar size={24} />
            </Link>
            <Link as={RouterLink} to={`/chat`}>
              <BsFillChatQuoteFill size={20} />
            </Link>
            <Button size={"x-small"} onClick={handleLogout}>
              <TbLogout size={20} /> Log out
            </Button>
          </Flex>
        )}
        {!user && (
          <Link
            as={RouterLink}
            to={"/auth"}
            onClick={() => setAuthScreen("signup")}
          >
            Sign up
          </Link>
        )}
      </Flex>
      {user && (
        <form onSubmit={handleSearch}>
          <Flex alignItems={"center"} gap={2}>
            <Input
              placeholder="Search for a user"
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              size={"sm"}
              onClick={handleSearch}
              isLoading={searchingUser}
            >
              <SearchIcon />
            </Button>
          </Flex>
        </form>
      )}
    </Stack>
  );
};

export default Header;
