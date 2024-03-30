import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postAtom from "../app/postAtom";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postAtom);
  const [loading, setLoading] = useState(true);

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
  return (
    <>
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
    </>
  );
};

export default HomePage;
