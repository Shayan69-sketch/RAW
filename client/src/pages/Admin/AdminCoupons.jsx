import { toast } from 'react-toastify';

const AdminCoupons = () => {
  const coupons = [
    { code: 'WELCOME10', type: 'percent', value: 10, usedCount: 0, isActive: true, expiresAt: '2027-12-31' },
    { code: 'SAVE20', type: 'fixed', value: 20, usedCount: 0, isActive: true, expiresAt: '2027-06-30' },
    { code: 'SUMMER25', type: 'percent', value: 25, usedCount: 0, isActive: true, expiresAt: '2027-08-31' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold uppercase tracking-wider">Coupons</h2>
        <button className="btn btn-primary text-sm py-2" onClick={() => toast.info('Coupon creation form — implement with a modal')}>+ Add Coupon</button>
      </div>
      <div className="bg-white border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg-alt border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Code</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Type</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Value</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Used</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest">Expires</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.code} className="border-b border-border">
                <td className="px-4 py-3 font-mono font-bold">{coupon.code}</td>
                <td className="px-4 py-3 capitalize">{coupon.type}</td>
                <td className="px-4 py-3">{coupon.type === 'percent' ? `${coupon.value}%` : `$${coupon.value}`}</td>
                <td className="px-4 py-3">{coupon.usedCount}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded font-semibold ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{coupon.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="px-4 py-3 text-text-muted">{coupon.expiresAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCoupons;
