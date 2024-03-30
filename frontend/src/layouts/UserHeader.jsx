import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../app/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserHeader = ({ user }) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

  const copyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: "Account created.",
        description: "Profile link copied",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    });
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              holostagram.com
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePicture && (
            <Avatar
              name={user.name}
              src={user.profilePicture}
              size={{ base: "md", md: "xl" }}
            />
          )}
          {!user.profilePicture && (
            <Avatar
              name={user.name}
              src="/default-avatar.png"
              size={{ base: "md", md: "xl" }}
            />
          )}
        </Box>
      </Flex>
      <Text>{user.bio}</Text>

      {currentUser._id === user._id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}

      {currentUser._id !== user._id && (
        <Button size={"sm"} isLoading={updating} onClick={handleFollowUnfollow}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} Follower</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Text color={"gray.light"}>{user.following.length} Followings</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>Facebook.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyUrl}>
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Post</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
          color={"gray.light"}
        >
          <Text fontWeight={"bold"}>Reply</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
