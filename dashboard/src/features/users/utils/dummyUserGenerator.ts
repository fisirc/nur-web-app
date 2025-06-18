import type { User } from "../types";

const dummyUserGenerator = (n: number): User[] => {
  const users: User[] = [];
  for (let i = 0; i < n; i++) {
    const id = (i + 1).toString();
    users.push({
      id,
      github_username: `miembro${id}`,
      avatar_url: "https://picsum.photos/50",
      created_at: new Date().toISOString(),
    });
  }
  return users;
};

export default dummyUserGenerator;
