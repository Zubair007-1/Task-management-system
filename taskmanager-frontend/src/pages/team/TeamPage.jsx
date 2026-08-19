import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Shield, Plus, MoreVertical, Search, Check } from 'lucide-react';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const MOCK_TEAM = [
  { id: 1, name: 'Zubair Syed', email: 'syedzubair@company.com', role: 'ADMIN', status: 'Active', online: true },
  { id: 2, name: 'Sarah Connor', email: 'sarah.c@company.com', role: 'USER', status: 'Active', online: true },
  { id: 3, name: 'John Doe', email: 'john.doe@company.com', role: 'USER', status: 'Active', online: false },
  { id: 4, name: 'Marcus Wright', email: 'marcus.w@company.com', role: 'USER', status: 'Invited', online: false },
];

export default function TeamPage() {
  const [team, setTeam] = useState(MOCK_TEAM);
  const [search, setSearch] = useState('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('USER');

  const filtered = team.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) {
      toast.error('Please enter name and email');
      return;
    }
    const newMember = {
      id: Date.now(),
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: 'Invited',
      online: false,
    };
    setTeam([...team, newMember]);
    setInviteName('');
    setInviteEmail('');
    setInviteRole('USER');
    setInviteModalOpen(false);
    toast.success('Invitation sent to ' + inviteEmail);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Team Directory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your project team members, roles, and status invitations
          </p>
        </div>
        <Button onClick={() => setInviteModalOpen(true)} icon={Plus}>
          Invite Member
        </Button>
      </div>

      {/* Directory search */}
      <div className="card p-4 flex gap-3 items-center shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email address…"
            className="input pl-9"
          />
        </div>
      </div>

      {/* Team Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((member) => (
          <motion.div
            key={member.id}
            layoutId={`member-card-${member.id}`}
            className="card p-6 flex flex-col justify-between items-center text-center relative border border-slate-100 dark:border-slate-800/80 hover:shadow-premium-md transition-shadow"
          >
            {/* Top dropdown trigger */}
            <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350">
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Avatar */}
            <div className="mb-4">
              <Avatar name={member.name} size="xl" online={member.online} />
            </div>

            {/* Info */}
            <div className="space-y-1 mb-4">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-base">{member.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 justify-center">
                <Mail className="w-3.5 h-3.5" />
                {member.email}
              </p>
            </div>

            {/* Role & Status Badge */}
            <div className="flex items-center gap-2 pt-1 w-full justify-center">
              <Badge variant={member.role === 'ADMIN' ? 'indigo' : 'slate'} className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {member.role}
              </Badge>
              <Badge variant={member.status === 'Active' ? 'green' : 'yellow'}>
                {member.status}
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Invite Modal */}
      <Modal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite New Team Member"
        footer={
          <>
            <Button variant="outline" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite}>
              Send Invitation
            </Button>
          </>
        }
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Jane Doe"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="jane.doe@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <Select
            label="Organization Role"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            options={[
              { value: 'USER', label: 'User (Standard Member)' },
              { value: 'ADMIN', label: 'Admin (System Administrator)' },
            ]}
          />
        </form>
      </Modal>
    </div>
  );
}
