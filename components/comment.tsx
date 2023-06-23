import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import useSWR, { SWRConfig, unstable_serialize } from "swr";
import DateTime from "./datetime";
import useUser from "@libs/client/useUser";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import client from "@libs/server/client";

const Comment: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { data: storyData, isLoading } = useSWR<any>(
    `/api/stories/${router.query.id}`
  );
  const [comment, { data: commentData, loading: commentLoading }] =
    useMutation<any>(`/api/stories/${router.query.id}/comment`);

  const [deleteMutation, { data: deleteData, loading: deleteLoading }] =
    useMutation(`/api/stories/${router.query.id}/delete`);

  const onDeleteComment = (
    commentId: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!commentLoading) {
      comment({ commentId });
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="py-3">
          {storyData?.story?.comments.map((comment: any) => (
            <div
              key={comment?.id}
              className="my-3 flex space-x-3 bg-gray-50 py-3 px-3"
            >
              {comment?.user?.avatar ? (
                <div className="relative h-14 w-14">
                  <Image
                    src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${comment?.user?.avatar}/avatar`}
                    alt=""
                    fill
                    priority
                    sizes="1"
                    className="rounded-full"
                  />
                </div>
              ) : (
                <div className="h-14 w-14 rounded-full  bg-slate-500" />
              )}
              <div className="flex space-x-5">
                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    {comment?.user?.name}
                  </span>
                  <span className="block text-xs text-gray-500 ">
                    <DateTime date={comment?.updatedAt} />
                  </span>
                  <p className="mt-2 text-gray-700">{comment?.comment}</p>
                </div>
                {comment.user.id === user?.id ? (
                  <button
                    onClick={(e) => {
                      onDeleteComment(comment.id, e);
                    }}
                    className="self-start text-xs"
                  >
                    ❌
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

const CommentPage: NextPage<{ commentStory: any }> = ({ commentStory }) => {
  const router = useRouter();
  const apiKey = `/api/stories/${router.query.id}`;
  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize(apiKey)]: {
            ok: true,
            story:commentStory,
          },
        },
      }}
    >
      <Comment />
    </SWRConfig>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    
  const commentStory = await client.story.findUnique({
    where: {
      id: Number(context?.params?.id),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },

      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },

      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
  return {
    props: {
        commentStory: JSON.parse(JSON.stringify(commentStory)),
    },
  };
};

export default CommentPage;
