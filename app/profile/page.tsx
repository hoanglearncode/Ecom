'use client'

import { useState } from 'react'
import { Edit2, Heart, LogOut, Settings, Bell, Lock } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States',
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: Settings },
    { id: 'orders', label: 'Orders', icon: Heart },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header cartCount={3} wishlistCount={2} />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-semibold">My Account</span>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-8">My Account</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-4 space-y-2 sticky top-24">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-white'
                          : 'text-foreground hover:bg-background-secondary'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
                <div className="border-t border-border my-2"></div>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-background-secondary transition-colors">
                  <LogOut size={18} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && (
                <div className="bg-card rounded-lg border border-border p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary-lighter/20 transition-colors"
                    >
                      <Edit2 size={18} />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={profile.firstName}
                            onChange={(e) =>
                              setProfile({ ...profile, firstName: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={profile.lastName}
                            onChange={(e) =>
                              setProfile({ ...profile, lastName: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          value={profile.address}
                          onChange={(e) =>
                            setProfile({ ...profile, address: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={profile.city}
                            onChange={(e) =>
                              setProfile({ ...profile, city: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            value={profile.state}
                            onChange={(e) =>
                              setProfile({ ...profile, state: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            ZIP
                          </label>
                          <input
                            type="text"
                            value={profile.zip}
                            onChange={(e) =>
                              setProfile({ ...profile, zip: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button
                          onClick={() => setIsEditing(false)}
                          className="bg-primary text-white hover:bg-primary/90"
                        >
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">First Name</p>
                        <p className="text-foreground font-medium">{profile.firstName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Last Name</p>
                        <p className="text-foreground font-medium">{profile.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Email</p>
                        <p className="text-foreground font-medium">{profile.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Phone</p>
                        <p className="text-foreground font-medium">{profile.phone}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground mb-1">Address</p>
                        <p className="text-foreground font-medium">{profile.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">City</p>
                        <p className="text-foreground font-medium">{profile.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">State</p>
                        <p className="text-foreground font-medium">{profile.state}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">ZIP</p>
                        <p className="text-foreground font-medium">{profile.zip}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="bg-card rounded-lg border border-border p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Order History</h2>
                  <p className="text-muted-foreground mb-4">
                    You have 4 orders in total
                  </p>
                  <Button asChild className="bg-primary text-white hover:bg-primary/90">
                    <Link href="/orders">View All Orders</Link>
                  </Button>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-card rounded-lg border border-border p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Notification Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Order Updates', description: 'Get notifications about your order status' },
                      { label: 'Promotions', description: 'Receive exclusive deals and offers' },
                      { label: 'Product Recommendations', description: 'Get personalized product suggestions' },
                      { label: 'Newsletter', description: 'Subscribe to our weekly newsletter' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <label className="relative inline-block w-12 h-6 bg-gray-300 rounded-full cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="absolute opacity-0 w-0 h-0"
                          />
                          <span className="absolute cursor-pointer w-6 h-6 bg-white rounded-full transition top-0 left-0 shadow-md"></span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="bg-card rounded-lg border border-border p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Security Settings</h2>
                  <div className="space-y-4">
                    <div className="p-4 border border-border rounded-lg">
                      <h3 className="font-semibold text-foreground mb-2">Change Password</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Update your password to keep your account secure
                      </p>
                      <Button variant="outline">Change Password</Button>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <h3 className="font-semibold text-foreground mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
