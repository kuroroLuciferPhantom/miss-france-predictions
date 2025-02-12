import React from 'react';

const GroupInfoDesktop = ({ 
  group, 
  isAdmin, 
  onRename, 
  onDelete, 
  onLeave, 
  ShareInviteCode,
  MembersList,
  GroupSettings,
  PointsSystem 
}) => {
  return (
    <div className="hidden lg:block space-y-6"> {/* Only show on desktop */}
      <MembersList members={group.members} />
      <ShareInviteCode code={group.inviteCode} />
      <GroupSettings
        isAdmin={isAdmin}
        onRename={onRename}
        onLeave={onLeave}
        onDelete={onDelete}
        membersCount={group.members.length}
      />
      <PointsSystem />
    </div>
  );
};

export default GroupInfoDesktop;