//src\features\team\member.ts
export type TeamMemberDTO = {
  memberId: number;
  userId: string;
  teamId: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  teamRole: "OWNER" | "MEMBER";
};

export type AssigneeDTO = {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  teamRole: "OWNER" | "MEMBER";
};

export type TeamResponse = {
  id: string;
  teamName: string;
  description: string;
  members: TeamMemberDTO[];
  createdById: string;
  createdByEmail: string;
  createdByFullName: string;
};

export type MemberInvite = {
  email: string;
  role: "MEMBER" | "OWNER"; // hoặc thêm "VIEWER" nếu BE hỗ trợ
};