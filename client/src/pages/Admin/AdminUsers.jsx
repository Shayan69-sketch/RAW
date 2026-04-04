import { useGetAllUsersQuery } from '../../services/userApi';

const AdminUsers = () => {
  const { data, isLoading } = useGetAllUsersQuery({ limit: 50 });

  return (
    <div>
      <h2 className="text-lg font-bold uppercase tracking-wider mb-6">Users ({data?.pagination?.total || 0})</h2>
      {isLoading ? (
        <div className="animate-pulse space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-white" />)}</div>
      ) : (
        <div className="bg-white border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-bg-alt border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Name</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Email</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Role</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Joined</th>
              </tr>
            </thead>
            <tbody>
              {data?.users?.map((user) => (
                <tr key={user._id} className="border-b border-border hover:bg-bg-alt">
                  <td className="px-4 py-3 font-semibold">{user.firstName} {user.lastName}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100'}`}>{user.role}</span></td>
                  <td className="px-4 py-3 text-text-muted">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
