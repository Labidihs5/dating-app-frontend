'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Settings as SettingsIcon,
  Bell,
  Lock,
  Eye,
  Trash2,
  LogOut,
  Moon,
  Globe,
  HelpCircle,
  ChevronRight,
  MapPin,
  Navigation,
} from 'lucide-react';

interface SettingsState {
  emailNotifications: boolean;
  matchNotifications: boolean;
  messageNotifications: boolean;
  pushNotifications: boolean;
  darkMode: boolean;
  profileVisibility: 'public' | 'friends' | 'private';
  language: string;
  hideExactLocation: boolean;
  locationSharing: 'exact' | 'approximate' | 'disabled';
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsState>({
    emailNotifications: true,
    matchNotifications: true,
    messageNotifications: true,
    pushNotifications: true,
    darkMode: false,
    profileVisibility: 'public',
    language: 'en',
    hideExactLocation: false,
    locationSharing: 'exact',
  });

  const [email, setEmail] = useState('user@example.com');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSettingChange = (key: keyof SettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const handleSaveSettings = () => {
    setIsSaved(true);
    console.log('Settings saved:', settings);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    window.location.href = '/';
  };

  const handleDeleteAccount = () => {
    console.log('Deleting account...');
    window.location.href = '/';
  };

  const settingsSections = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Match Notifications',
          sublabel: 'Get notified when someone likes you',
          key: 'matchNotifications',
        },
        {
          label: 'Message Notifications',
          sublabel: 'Get notified when you receive messages',
          key: 'messageNotifications',
        },
        {
          label: 'Push Notifications',
          sublabel: 'Send push notifications to my device',
          key: 'pushNotifications',
        },
        {
          label: 'Email Notifications',
          sublabel: 'Send weekly digest emails',
          key: 'emailNotifications',
        },
      ],
    },
    {
      title: 'Privacy & Safety',
      icon: Lock,
      items: [
        {
          label: 'Profile Visibility',
          sublabel: 'Control who can see your profile',
          key: 'profileVisibility',
          type: 'select',
          options: [
            { value: 'public', label: 'Public' },
            { value: 'friends', label: 'Friends Only' },
            { value: 'private', label: 'Private' },
          ],
        },
      ],
    },
    {
      title: 'Appearance',
      icon: Moon,
      items: [
        {
          label: 'Dark Mode',
          sublabel: 'Enable dark theme for the app',
          key: 'darkMode',
        },
        {
          label: 'Language',
          sublabel: 'Choose your preferred language',
          key: 'language',
          type: 'select',
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
            { value: 'fr', label: 'Français' },
            { value: 'de', label: 'Deutsch' },
          ],
        },
      ],
    },
    {
      title: 'Location & Discovery',
      icon: MapPin,
      items: [
        {
          label: 'Location Sharing',
          sublabel: 'Control how your location is shared',
          key: 'locationSharing',
          type: 'select',
          options: [
            { value: 'exact', label: 'Exact Location' },
            { value: 'approximate', label: 'Approximate (City)' },
            { value: 'disabled', label: 'Disabled' },
          ],
        },
        {
          label: 'Hide Exact Location',
          sublabel: 'Show approximate distance to matches',
          key: 'hideExactLocation',
        },
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="min-h-screen py-8">
          <div className="max-w-2xl mx-auto px-4">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <SettingsIcon className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold">Settings</h1>
              </div>
              <p className="text-muted-foreground">Manage your account preferences</p>
            </div>

            {/* Save Notification */}
            {isSaved && (
              <Card className="mb-6 p-4 bg-success/10 border-success/50 text-success animate-in fade-in">
                <p className="font-semibold">✓ Settings saved successfully</p>
              </Card>
            )}

            {/* Account Section */}
            <Card className="mb-6 p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Account
              </h2>

              <div className="space-y-4">
                <Button
                  onClick={() => router.push('/settings/profile')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>

                <div>
                  <Label htmlFor="email" className="text-sm">
                    Email Address
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled
                      className="text-muted-foreground"
                    />
                    <Button variant="outline">Change</Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    Account Status: <Badge>Active</Badge>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Member since: January 2024
                  </p>
                </div>
              </div>
            </Card>

            {/* Settings Sections */}
            {settingsSections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <Card key={idx} className="mb-6 p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    {section.title}
                  </h2>

                  <div className="space-y-4">
                    {section.items.map(item => (
                      <div key={item.key} className="flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors">
                        <div className="flex-1">
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.sublabel}</p>
                        </div>

                        {item.type === 'select' ? (
                          <select
                            value={settings[item.key as keyof SettingsState] as string}
                            onChange={e => handleSettingChange(item.key as keyof SettingsState, e.target.value)}
                            className="px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            {item.options?.map(opt => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings[item.key as keyof SettingsState] as boolean}
                              onChange={e => handleSettingChange(item.key as keyof SettingsState, e.target.checked)}
                              className="w-5 h-5 accent-primary rounded"
                            />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}

            {/* Save Button */}
            <Button
              onClick={handleSaveSettings}
              className="w-full mb-6 bg-primary hover:bg-primary/90 py-6 text-base"
            >
              Save Settings
            </Button>

            {/* Support Section */}
            <Card className="mb-6 p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Support
              </h2>

              <div className="space-y-2">
                {[
                  { label: 'Help Center', href: '#' },
                  { label: 'Privacy Policy', href: '#' },
                  { label: 'Terms of Service', href: '#' },
                  { label: 'Report a Bug', href: '#' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors text-left"
                  >
                    <span className="font-medium">{item.label}</span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50 bg-destructive/5 p-6">
              <h2 className="text-lg font-bold mb-4 text-destructive flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </h2>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-between bg-transparent"
                  onClick={() => setShowLogoutModal(true)}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-between"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </Card>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>HeartMatch v1.0.0</p>
            </div>
          </div>

          {/* Logout Modal */}
          {showLogoutModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <Card className="w-full max-w-sm p-8 animate-in fade-in zoom-in-95">
                <h2 className="text-2xl font-bold mb-4">Logout?</h2>
                <p className="text-muted-foreground mb-6">
                  Are you sure you want to logout? You'll need to log in again to access your account.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={handleLogout}
                    className="w-full bg-destructive hover:bg-destructive/90"
                  >
                    Logout
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setShowLogoutModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Delete Account Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <Card className="w-full max-w-sm p-8 animate-in fade-in zoom-in-95">
                <h2 className="text-2xl font-bold mb-4 text-destructive">Delete Account?</h2>
                <p className="text-muted-foreground mb-6">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={handleDeleteAccount}
                    className="w-full bg-destructive hover:bg-destructive/90"
                  >
                    Delete Account Permanently
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </PageContainer>
    </>
  );
}
