import { withSsrSession } from "@libs/server/withSession";
import { GetServerSideProps, NextPage, NextPageContext } from "next";
import useSWR, { SWRConfig } from "swr";
import client from "@libs/server/client";
import useUser, { UserResponse } from "@libs/client/useUser";

const Test: NextPage = () => {
  

  return <div>
      테스트 페이지
  </div>;
};


export default Test;
