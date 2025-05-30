import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserAvatar = () => {
  return (
    <Avatar>
      <AvatarImage src="https://picsum.photos/50" />
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
