import { Flex, Spinner } from "@chakra-ui/react";

const LoadingSnipper = () => {
  return (
    <Flex
      position={"fixed"}
      alignItems={"center"}
      left={"50%"}
      top={"50%"}
      transform={"translate(-50%, -50%)"}
      backgroundColor={"rgba(0,0,0,0.5)"}
      display={"flex"}
      justifyContent={"center"}
      w={"100%"}
      h={"100%"}
      zIndex={"100"}
    >
      <Spinner size="xl" />
    </Flex>
  );
};

export default LoadingSnipper;
