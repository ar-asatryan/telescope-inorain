import { useState } from 'react'
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Mail,
  Key,
  Building2,
  Save,
  Camera,
  Moon,
  Sun,
  Monitor,
  Check,
  Loader2,
} from 'lucide-react'
import { useThemeStore, type Theme, type AccentColor } from '../store/themeStore'

const tabs = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'appearance', name: 'Appearance', icon: Palette },
  { id: 'organization', name: 'Organization', icon: Building2 },
]

const initialNotificationSettings = [
  { id: 'email_vacation', label: 'Vacation request notifications', description: 'Get notified when someone requests vacation', enabled: true },
  { id: 'email_approval', label: 'Approval notifications', description: 'Get notified when your requests are approved/rejected', enabled: true },
  { id: 'email_project', label: 'Project updates', description: 'Get notified about project assignments and updates', enabled: false },
  { id: 'email_team', label: 'Team changes', description: 'Get notified about team structure changes', enabled: true },
  { id: 'email_weekly', label: 'Weekly digest', description: 'Receive a weekly summary of activities', enabled: false },
]

const themeOptions: { id: Theme; name: string; icon: typeof Moon; description: string }[] = [
  { id: 'dark', name: 'Dark', icon: Moon, description: 'Easy on the eyes' },
  { id: 'light', name: 'Light', icon: Sun, description: 'Classic bright mode' },
  { id: 'system', name: 'System', icon: Monitor, description: 'Follow system preference' },
]

const accentColors: { id: AccentColor; color: string; name: string }[] = [
  { id: 'cyan', color: '#00c3ff', name: 'Cyan' },
  { id: 'purple', color: '#8b5cf6', name: 'Purple' },
  { id: 'green', color: '#10b981', name: 'Green' },
  { id: 'amber', color: '#f59e0b', name: 'Amber' },
  { id: 'pink', color: '#ec4899', name: 'Pink' },
]

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [notifications, setNotifications] = useState(initialNotificationSettings)
  const [emailFrequency, setEmailFrequency] = useState('Instant')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  // Theme store
  const { theme, accentColor, compactSidebar, setTheme, setAccentColor, toggleCompactSidebar } = useThemeStore()

  const toggleNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n)
    )
  }

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-display font-bold" style={{ color: 'var(--color-text-primary)' }}>Settings</h1>
        <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>Manage your account settings and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-64 shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                style={{
                  background: activeTab === tab.id 
                    ? 'linear-gradient(90deg, color-mix(in srgb, var(--color-accent) 20%, transparent) 0%, transparent 100%)'
                    : 'transparent',
                  borderLeft: activeTab === tab.id ? '2px solid var(--color-accent)' : '2px solid transparent',
                  color: activeTab === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                }}
              >
                <tab.icon 
                  className="w-5 h-5" 
                  style={{ color: activeTab === tab.id ? 'var(--color-accent)' : 'inherit' }} 
                />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card space-y-6">
              <div className="flex items-center justify-between pb-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <h2 className="text-xl font-display font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Profile Information
                </h2>
                <button className="btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : saved ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#00c3ff] to-[#8b5cf6] flex items-center justify-center text-white font-bold text-3xl">
                    AR
                  </div>
                  <button 
                    className="absolute -bottom-2 -right-2 p-2 rounded-xl transition-colors"
                    style={{ 
                      background: 'var(--color-bg-hover)', 
                      border: '1px solid var(--color-border-light)' 
                    }}
                  >
                    <Camera className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Admin User</h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>Administrator</p>
                  <button 
                    className="mt-2 text-sm font-medium transition-colors"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    Change avatar
                  </button>
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="label">First Name</label>
                  <input type="text" defaultValue="Admin" className="input" />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input type="text" defaultValue="User" className="input" />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                    <input type="email" defaultValue="admin@inorain.com" className="input pl-11" />
                  </div>
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input type="tel" defaultValue="+374 41 151 131" className="input" />
                </div>
                <div className="col-span-2">
                  <label className="label">Bio</label>
                  <textarea 
                    rows={3} 
                    className="input resize-none"
                    defaultValue="System administrator at inoRain. Managing the Telescope platform."
                  />
                </div>
              </div>

              {/* Language & Timezone */}
              <div className="grid grid-cols-2 gap-6 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
                <div>
                  <label className="label flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Language
                  </label>
                  <select className="input">
                    <option>English</option>
                    <option>Armenian</option>
                    <option>Russian</option>
                  </select>
                </div>
                <div>
                  <label className="label">Timezone</label>
                  <select className="input">
                    <option>Asia/Yerevan (GMT+4)</option>
                    <option>Europe/London (GMT+0)</option>
                    <option>America/New_York (GMT-5)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card space-y-6">
              <div className="pb-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <h2 className="text-xl font-display font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Notification Preferences
                </h2>
                <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Choose how you want to receive notifications
                </p>
              </div>

              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-4 rounded-xl transition-colors"
                    style={{ 
                      background: 'var(--color-bg-primary)', 
                      border: '1px solid var(--color-border)' 
                    }}
                  >
                    <div>
                      <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{notification.label}</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{notification.description}</p>
                    </div>
                    <button
                      onClick={() => toggleNotification(notification.id)}
                      className="toggle"
                      style={{ background: notification.enabled ? 'var(--color-accent)' : 'var(--color-bg-hover)' }}
                    >
                      <span
                        className="toggle-knob"
                        style={{ left: notification.enabled ? 'calc(100% - 24px)' : '4px' }}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Email Frequency</h3>
                <div className="grid grid-cols-3 gap-3">
                  {['Instant', 'Daily Digest', 'Weekly Digest'].map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setEmailFrequency(freq)}
                      className="p-3 rounded-xl border text-sm font-medium transition-all duration-300"
                      style={{
                        background: emailFrequency === freq ? 'var(--color-accent-bg, rgba(0, 195, 255, 0.1))' : 'transparent',
                        borderColor: emailFrequency === freq ? 'var(--color-accent-border, rgba(0, 195, 255, 0.5))' : 'var(--color-border)',
                        color: emailFrequency === freq ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                      }}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="card">
                <div className="pb-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <h2 className="text-xl font-display font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    Change Password
                  </h2>
                  <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    Update your password regularly to keep your account secure
                  </p>
                </div>

                <div className="space-y-4 pt-6">
                  <div>
                    <label className="label">Current Password</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                      <input type="password" placeholder="••••••••" className="input pl-11" />
                    </div>
                  </div>
                  <div>
                    <label className="label">New Password</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                      <input type="password" placeholder="••••••••" className="input pl-11" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Confirm New Password</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                      <input type="password" placeholder="••••••••" className="input pl-11" />
                    </div>
                  </div>
                  <button className="btn-primary mt-2" onClick={handleSave}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>

              <div className="card">
                <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                  Two-Factor Authentication
                </h3>
                <div 
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                      <Shield className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>2FA is enabled</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        Your account is protected with two-factor authentication
                      </p>
                    </div>
                  </div>
                  <button className="btn-secondary">Configure</button>
                </div>
              </div>

              <div className="card">
                <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Active Sessions</h3>
                <div className="space-y-3">
                  {[
                    { device: 'MacBook Pro - Chrome', location: 'Yerevan, Armenia', current: true },
                    { device: 'iPhone 15 - Safari', location: 'Yerevan, Armenia', current: false },
                  ].map((session, i) => (
                    <div 
                      key={i} 
                      className="flex items-center justify-between p-4 rounded-xl"
                      style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }}
                    >
                      <div>
                        <p className="font-medium flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                          {session.device}
                          {session.current && (
                            <span className="px-2 py-0.5 text-xs rounded-md" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                              Current
                            </span>
                          )}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{session.location}</p>
                      </div>
                      {!session.current && (
                        <button className="text-sm text-red-400 hover:text-red-300 transition-colors">
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="card space-y-6">
              <div className="pb-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <h2 className="text-xl font-display font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Appearance
                </h2>
                <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Customize how Telescope looks on your device
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  {themeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setTheme(option.id)}
                      className="relative p-5 rounded-xl border transition-all duration-300 text-left"
                      style={{
                        background: theme === option.id ? 'var(--color-accent-bg, rgba(0, 195, 255, 0.1))' : 'transparent',
                        borderColor: theme === option.id ? 'var(--color-accent-border, rgba(0, 195, 255, 0.5))' : 'var(--color-border)',
                      }}
                    >
                      {theme === option.id && (
                        <div 
                          className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: 'var(--color-accent)' }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div 
                        className="p-3 rounded-xl w-fit mb-3"
                        style={{ 
                          background: theme === option.id ? 'var(--color-accent-bg, rgba(0, 195, 255, 0.2))' : 'var(--color-bg-hover)' 
                        }}
                      >
                        <option.icon 
                          className="w-6 h-6" 
                          style={{ color: theme === option.id ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
                        />
                      </div>
                      <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{option.name}</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{option.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Accent Color</h3>
                <div className="flex gap-3">
                  {accentColors.map((accent) => (
                    <button
                      key={accent.id}
                      onClick={() => setAccentColor(accent.id)}
                      className="w-10 h-10 rounded-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
                      style={{ 
                        backgroundColor: accent.color,
                        boxShadow: accentColor === accent.id 
                          ? `0 0 0 2px var(--color-bg-card), 0 0 0 4px ${accent.color}` 
                          : 'none'
                      }}
                      title={accent.name}
                    >
                      {accentColor === accent.id && (
                        <Check className="w-5 h-5 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Sidebar</h3>
                <div 
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }}
                >
                  <div>
                    <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Compact Mode</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      Reduce sidebar width for more content space
                    </p>
                  </div>
                  <button
                    onClick={toggleCompactSidebar}
                    className="toggle"
                    style={{ background: compactSidebar ? 'var(--color-accent)' : 'var(--color-bg-hover)' }}
                  >
                    <span
                      className="toggle-knob"
                      style={{ left: compactSidebar ? 'calc(100% - 24px)' : '4px' }}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Organization Tab */}
          {activeTab === 'organization' && (
            <div className="space-y-6">
              <div className="card">
                <div className="pb-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <h2 className="text-xl font-display font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    Organization Settings
                  </h2>
                  <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    Manage your organization's information and preferences
                  </p>
                </div>

                <div className="space-y-6 pt-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00c3ff] to-[#8b5cf6] flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">iR</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>inoRain LLC</h3>
                      <p style={{ color: 'var(--color-text-secondary)' }}>OTT Solutions Provider</p>
                      <button className="mt-2 text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
                        Change logo
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="label">Company Name</label>
                      <input type="text" defaultValue="inoRain LLC" className="input" />
                    </div>
                    <div>
                      <label className="label">Industry</label>
                      <select className="input">
                        <option>Technology - OTT/Streaming</option>
                        <option>Software Development</option>
                        <option>Media & Entertainment</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Company Size</label>
                      <select className="input">
                        <option>50-200 employees</option>
                        <option>200-500 employees</option>
                        <option>500+ employees</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Website</label>
                      <input type="url" defaultValue="https://inorain.com" className="input" />
                    </div>
                    <div className="col-span-2">
                      <label className="label">Address</label>
                      <input type="text" defaultValue="651 N Broad St, Suite 201, Middletown, Delaware" className="input" />
                    </div>
                  </div>

                  <button className="btn-primary" onClick={handleSave}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>

              <div className="card">
                <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                  <Database className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
                  Data & Storage
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--color-text-secondary)' }}>Storage Used</span>
                    <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>2.4 GB / 10 GB</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-hover)' }}>
                    <div 
                      className="h-full w-[24%] rounded-full" 
                      style={{ background: 'linear-gradient(90deg, var(--color-accent), var(--color-inorain-blue))' }}
                    />
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    <span>Employee data: 1.2 GB</span>
                    <span>Documents: 1.2 GB</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
