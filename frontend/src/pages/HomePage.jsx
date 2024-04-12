import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Box, Button, Flex, Input, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postAtom from "../app/postAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import { SearchIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postAtom);
  const [loading, setLoading] = useState(true);
  const [searchingUser, setSearchingUser] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const showToast = useShowToast();

  useEffect(() => {
    const getTimeline = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch("/api/posts/timeline");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.message, "error");
        }
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getTimeline();
  }, [showToast, setPosts]);

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
    <>
      <Flex
        alignItems={"center"}
        gap={2}
        w={"320px"}
        position={"relative"}
        left={"620px"}
      >
        <Input
          placeholder="Search for a user"
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button size={"sm"} onClick={handleSearch} isLoading={searchingUser}>
          <SearchIcon />
        </Button>
      </Flex>
      <Flex gap={10} alignItems={"flex-start"}>
        <Box flex={70}>
          {!loading && posts.length === 0 && (
            <h1>Follow other users to see their post</h1>
          )}

          {loading && (
            <Flex justify={"center"}>
              <Spinner size={"xl"} />
            </Flex>
          )}
          {posts.map((post) => (
            <Post key={post._id} post={post} username={post.username} />
          ))}
        </Box>
        <Box
          flex={30}
          display={{
            base: "none",
            md: "block",
          }}
        >
          <SuggestedUsers />
        </Box>
      </Flex>
    </>
  );
};

export default HomePage;
