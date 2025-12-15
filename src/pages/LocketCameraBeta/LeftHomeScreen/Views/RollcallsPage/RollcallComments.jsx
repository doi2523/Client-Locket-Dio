import { Heart } from "lucide-react";
import { useUser } from "./useUser";

function RollcallComments({ comments }) {
  return (
    <div className="flex flex-col gap-2">
      {comments.map((c) => (
        <CommentItem key={c.uid} uid={c.user} body={c.body} c={c} />
      ))}
    </div>
  );
}

function CommentItem({ uid, body, c }) {
  const user = useUser(uid);

  if (!user) return null;

  return (
    <div className="p-3 bg-base-200 rounded-xl text-sm flex flex-col gap-1">
      <div className="flex flex-row justify-start gap-3 items-center">
        <div className="relative">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={
              user.profilePic ||
              user.profile_picture_url ||
              "/images/default_avatar.png"
            }
            alt={user.firstName || user.first_name}
          />
        </div>
        <div className="flex flex-col">
          <div className="font-semibold">
            {user.firstName || user.first_name}{" "}
            {user.lastName || user.last_name}
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="px-3 py-2.5 bg-base-300 rounded-2xl">{body}</div>
            <div>
              <Heart size={16} />
            </div>
          </div>
          <div className="text-xs opacity-50">
            {new Date(c.created_at._seconds * 1000).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RollcallComments;
