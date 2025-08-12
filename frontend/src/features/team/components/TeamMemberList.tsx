import { useAppSelector } from "../../../state/hooks";
import { selectTeamMembers } from "../teamSlice";
import { TeamMemberCard } from "./TeamMemberCard";

export const TeamMemberList = () => {
  const members = useAppSelector(selectTeamMembers);
  const teamId = useAppSelector((state) => state.team.teamDetail?.id);
  return (
    <>
      <h2 className="mb-3 text-lg font-semibold">Thành viên</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {members.map((m) => (
          <TeamMemberCard
            teamId={teamId!} // ✅ nếu teamId nằm trong từng member
            userId={m.userId}
            key={m.userId}
            fullName={m.fullName}
            email={m.email}
            teamRole={m.teamRole}
            avatarUrl={m.avatarUrl}
          />
        ))}
      </div>
    </>
  );
};
