import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserAvatar = () => {
  return (
    <Avatar>
      <AvatarImage src="https://pbs.twimg.com/profile_images/1823736710359822336/KZH8cEDD_400x400.jpg" />
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
