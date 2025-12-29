import { useState, useEffect } from 'react'
import {
  Users as UsersIcon,
  UserPlus,
  Search,
  Shield,
  ShieldCheck,
  User as UserIcon,
  MoreVertical,
  Check,
  X,
  Edit2,
  Trash2,
  Power,
  Loader2,
  Filter,
} from 'lucide-react'
import { usersService, type CreateUserData } from '../services/users'
import type { User, UserRole } from '../types'

const roleConfig: Record<UserRole, { label: string; icon: typeof Shield; color: string }> = {
  admin: { label: 'Admin', icon: ShieldCheck, color: 'text-red-400 bg-red-500/10 border-red-500/30' },
  manager: { label: 'Manager', icon: Shield, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  employee: { label: 'Employee', icon: UserIcon, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
}

export function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [actionMenuId, setActionMenuId] = useState<number | null>(null)
  const [totalUsers, setTotalUsers] = useState(0)

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await usersService.getUsers({
        limit: 50,
        search: searchQuery,
        role: roleFilter || undefined,
      })
      if (response.success) {
        setUsers(response.data.users)
        setTotalUsers(response.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [searchQuery, roleFilter])

  const handleToggleStatus = async (userId: number) => {
    try {
      await usersService.toggleUserStatus(userId)
      await fetchUsers()
    } catch (error) {
      console.error('Failed to toggle user status:', error)
    }
    setActionMenuId(null)
  }

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
    try {
      await usersService.deleteUser(userId)
      await fetchUsers()
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
    setActionMenuId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-white flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10">
              <UsersIcon className="w-6 h-6 text-red-400" />
            </div>
            User Management
          </h1>
          <p className="text-zinc-500 mt-1">{totalUsers} users registered in the system</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          <UserPlus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | '')}
              className="input pl-12 pr-10 appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-800/50 border-b border-zinc-700/50">
              <tr>
                <th className="table-header">User</th>
                <th className="table-header">Role</th>
                <th className="table-header">Status</th>
                <th className="table-header">Created</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Loader2 className="w-8 h-8 text-red-400 animate-spin mx-auto" />
                    <p className="text-zinc-500 mt-3">Loading users...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <UsersIcon className="w-12 h-12 text-zinc-700 mx-auto" />
                    <p className="text-zinc-500 mt-3">No users found</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-4 text-sm text-red-400 hover:text-red-300"
                    >
                      Create your first user
                    </button>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const role = roleConfig[user.role]
                  const RoleIcon = role.icon
                  return (
                    <tr key={user.id} className="hover:bg-zinc-800/20 transition-colors">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-white font-medium border border-zinc-700">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-zinc-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${role.color}`}>
                          <RoleIcon className="w-3.5 h-3.5" />
                          {role.label}
                        </span>
                      </td>
                      <td className="table-cell">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                            <Check className="w-3.5 h-3.5" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-400 bg-zinc-700/50 border border-zinc-600">
                            <X className="w-3.5 h-3.5" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="table-cell text-zinc-400">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="table-cell">
                        <div className="relative flex justify-end">
                          <button
                            onClick={() => setActionMenuId(actionMenuId === user.id ? null : user.id)}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {actionMenuId === user.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setActionMenuId(null)}
                              />
                              <div className="absolute right-0 top-full mt-1 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 py-1 animate-fade-in">
                                <button
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setActionMenuId(null)
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700/50 transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Edit User
                                </button>
                                <button
                                  onClick={() => handleToggleStatus(user.id)}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700/50 transition-colors"
                                >
                                  <Power className="w-4 h-4" />
                                  {user.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <div className="border-t border-zinc-700 my-1" />
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete User
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchUsers()
          }}
        />
      )}

      {/* Edit User Modal */}
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={() => {
            setSelectedUser(null)
            fetchUsers()
          }}
        />
      )}
    </div>
  )
}

// Create User Modal
function CreateUserModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'employee',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await usersService.createUser(formData)
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a22] border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-display font-semibold text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-red-400" />
            Create New User
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Add a new user to the system</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="input"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="input"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
              placeholder="john@company.com"
              required
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input"
              placeholder="••••••••"
              required
              minLength={6}
            />
            <p className="text-xs text-zinc-500 mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <label className="label">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="input"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary justify-center">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="flex-1 btn-primary justify-center">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit User Modal
function EditUserModal({
  user,
  onClose,
  onSuccess,
}: {
  user: User
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role as UserRole,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await usersService.updateUser(user.id, formData)
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a22] border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-display font-semibold text-white flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-red-400" />
            Edit User
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Update user information</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="input"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="input"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary justify-center">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="flex-1 btn-primary justify-center">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


