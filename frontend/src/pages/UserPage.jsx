import { useEffect, useState } from "react";
import UserHeader from "../layouts/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postAtom from "../app/postAtom";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postAtom);
  const { username } = useParams();
  const showToast = useShowToast();

  const [fetchingPost, setFetchingPost] = useState(true);

  useEffect(() => {
    const getPost = async () => {
      setFetchingPost(true);
      try {
        const res = await fetch(`/api/posts/users/${username}`);
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPost(false);
      }
    };
    getPost();
  }, [username, showToast, setPosts]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if (!user && !loading) return <h1>User not found </h1>;
  return (
    <>
      <UserHeader user={user} />
      {!fetchingPost && posts.length === 0 && <h1>User has not posts.</h1>}
      {fetchingPost && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {posts.map((post) => (
        <Post key={post._id} post={post} username={post.username} />
      ))}
    </>
  );
};

export default UserPage;
