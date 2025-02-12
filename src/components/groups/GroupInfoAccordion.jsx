import React, { useState } from 'react';

const AccordionSection = ({ title, children, isOpen, onClick }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
    <button
      onClick={onClick}
      className="w-full px-4 py-3 text-left flex justify-between items-center"
    >
      <span className="text-lg font-semibold text-gray-900 dark:text-white">{title}</span>
      <svg
        className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {isOpen && (
      <div className="px-4 pb-4">
        {children}
      </div>
    )}
  </div>
);

const GroupInfoAccordion = ({ 
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
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="lg:hidden w-full">
      <AccordionSection
        title={`Participants (${group.members.length})`}
        isOpen={openSection === 'members'}
        onClick={() => toggleSection('members')}
      >
        <MembersList members={group.members} />
      </AccordionSection>

      <AccordionSection
        title="Code d'invitation"
        isOpen={openSection === 'invite'}
        onClick={() => toggleSection('invite')}
      >
        <ShareInviteCode code={group.inviteCode} />
      </AccordionSection>

      <AccordionSection
        title="Paramètres"
        isOpen={openSection === 'settings'}
        onClick={() => toggleSection('settings')}
      >
        <GroupSettings
          isAdmin={isAdmin}
          onRename={onRename}
          onLeave={onLeave}
          onDelete={onDelete}
          membersCount={group.members.length}
        />
      </AccordionSection>

      <AccordionSection
        title="Système de points"
        isOpen={openSection === 'points'}
        onClick={() => toggleSection('points')}
      >
        <PointsSystem />
      </AccordionSection>
    </div>
  );
};

export default GroupInfoAccordion;