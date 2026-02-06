'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { userAPI, authAPI } from '@/lib/api-services';
import { getTelegramUser } from '@/lib/telegram-utils';
import { useI18n } from '@/components/i18n/LanguageProvider';
import { languageMeta } from '@/lib/i18n';
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
  const { t, setLanguage, language } = useI18n();
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

  const [email, setEmail] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = getTelegramUser();
    if (user) {
      setUserId(user.id);
      setEmail(user.username ? `${user.username}@telegram.user` : `${user.id}@telegram.user`);
      loadProfile(user.id);
    }
  }, []);

  const loadProfile = async (id: string) => {
    try {
      const [profileData, settingsData] = await Promise.all([
        userAPI.getProfile(id),
        fetch(`/api/settings/${id}`).then(res => res.json())
      ]);
      
      if (profileData) {
        setProfile(profileData);
        setEmail(profileData.email || `${profileData.telegramUsername || profileData.id}@telegram.user`);
      }
      
      if (settingsData) {
        setSettings({
          emailNotifications: settingsData.emailNotifications,
          matchNotifications: settingsData.matchNotifications,
          messageNotifications: settingsData.messageNotifications,
          pushNotifications: settingsData.pushNotifications,
          darkMode: settingsData.darkMode,
          profileVisibility: settingsData.profileVisibility,
          language: settingsData.language,
          hideExactLocation: settingsData.hideExactLocation,
          locationSharing: settingsData.locationSharing,
        });
        if (settingsData.language) {
          setLanguage(settingsData.language);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (key: keyof SettingsState, value: any) => {
    const oldValue = settings[key];
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsSaved(false);
    
    // Apply dark mode immediately
    if (key === 'darkMode') {
      document.documentElement.classList.toggle('dark', value);
    }
    
    if (key === 'language') {
      setLanguage(value);
    }
    
    // Handle email notifications - only if enabling AND email is valid
    if (key === 'emailNotifications' && value && !oldValue && email && isValidEmail(email)) {
      try {
        const emailjs = await import('@emailjs/browser');
        await emailjs.send(
          'service_8igizhh', // Service ID (create on emailjs.com)
          'template_notification', // Template ID
          {
            to_email: email,
            time: new Date().toISOString(),
            name: 'LoveMatch Notifications',
            subject: 'Email Notifications Enabled',
            message: 'You have successfully enabled email notifications for your HeartMatch account.'
          },
          'W39KPGu03a4FVchvx' // Public key from emailjs.com
        );
        console.log('✅ Email sent via EmailJS');
      } catch (error) {
        console.error('❌ EmailJS failed:', error);
        // Fallback to simple alert
        alert(t('settings.emailNotificationsFallback'));
      }
    }
    
    // Show toast ONLY for push notifications when enabled
    if (key === 'pushNotifications' && value && !oldValue) {
      showToast(t('settings.notificationsEnabled'));
    }
  };
  
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const showToast = (message: string) => {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-primary text-white px-4 py-2 rounded-lg z-50 animate-in fade-in';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const handleSaveSettings = async () => {
    if (!userId) return;
    
    setSaving(true);
    try {
      await fetch(`/api/settings/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(t('settings.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) return;
    
    try {
      await authAPI.deleteAccount();
      localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Delete account error:', error);
      alert(t('settings.deleteFailed'));
    }
  };

  const getMemberSince = () => {
    if (!profile?.createdAt) return t('settings.recently');
    const date = new Date(profile.createdAt);
    return date.toLocaleDateString(language, { month: 'long', year: 'numeric' });
  };

  const settingsSections = [
    {
      title: t('settings.notifications'),
      icon: Bell,
      items: [
        {
          label: t('settings.matchNotifications'),
          sublabel: t('settings.matchNotificationsSub'),
          key: 'matchNotifications',
        },
        {
          label: t('settings.messageNotifications'),
          sublabel: t('settings.messageNotificationsSub'),
          key: 'messageNotifications',
        },
        {
          label: t('settings.pushNotifications'),
          sublabel: t('settings.pushNotificationsSub'),
          key: 'pushNotifications',
        },
        {
          label: t('settings.emailNotifications'),
          sublabel: t('settings.emailNotificationsSub'),
          key: 'emailNotifications',
        },
      ],
    },
    {
      title: t('settings.privacy'),
      icon: Lock,
      items: [
        {
          label: t('settings.profileVisibility'),
          sublabel: t('settings.profileVisibilitySub'),
          key: 'profileVisibility',
          type: 'select',
          options: [
            { value: 'public', label: t('settings.profileVisibilityPublic') },
            { value: 'friends', label: t('settings.profileVisibilityFriends') },
            { value: 'private', label: t('settings.profileVisibilityPrivate') },
          ],
        },
      ],
    },
    {
      title: t('settings.appearance'),
      icon: Moon,
      items: [
        {
          label: t('settings.darkMode'),
          sublabel: t('settings.darkModeSub'),
          key: 'darkMode',
        },
        {
          label: t('settings.language'),
          sublabel: t('settings.languageSub'),
          key: 'language',
          type: 'select',
          options: Object.entries(languageMeta).map(([value, meta]) => ({
            value,
            label: meta.label,
          })),
        },
      ],
    },
    {
      title: t('settings.locationDiscovery'),
      icon: MapPin,
      items: [
        {
          label: t('settings.locationSharing'),
          sublabel: t('settings.locationSharingSub'),
          key: 'locationSharing',
          type: 'select',
          options: [
            { value: 'exact', label: t('settings.locationSharingExact') },
            { value: 'approximate', label: t('settings.locationSharingApproximate') },
            { value: 'disabled', label: t('settings.locationSharingDisabled') },
          ],
        },
        {
          label: t('settings.hideExactLocation'),
          sublabel: t('settings.hideExactLocationSub'),
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
                <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
              </div>
              <p className="text-muted-foreground">{t('settings.subtitle')}</p>
            </div>

            {/* Save Notification */}
            {isSaved && (
              <Card className="mb-6 p-4 bg-success/10 border-success/50 text-success animate-in fade-in">
                <p className="font-semibold">{t('settings.saved')}</p>
              </Card>
            )}

            {/* Account Section */}
            <Card className="mb-6 p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t('settings.account')}
              </h2>

              <div className="space-y-4">
                <Button
                  onClick={() => router.push('/settings/profile')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {t('settings.editProfile')}
                </Button>

                <div>
                  <Label htmlFor="email" className="text-sm">{t('settings.email')}</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="text-foreground"
                    />
                    <Button 
                      variant="outline"
                      onClick={async () => {
                        if (!userId || !isValidEmail(email)) {
                          alert(t('settings.validEmail'));
                          return;
                        }
                        try {
                          await userAPI.updateProfile(userId, { email });
                          alert(t('settings.emailUpdated'));
                        } catch (error) {
                          alert(t('settings.emailUpdateFailed'));
                        }
                      }}
                    >
                      {t('common.update')}
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    {t('settings.accountStatus')} <Badge variant="secondary">{t('settings.active')}</Badge>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.memberSince')} {getMemberSince()}
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
                        ) : item.type === 'disabled' ? (
                          <Badge variant="secondary">{t('common.comingSoon')}</Badge>
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
              disabled={saving}
              className="w-full mb-6 bg-primary hover:bg-primary/90 py-6 text-base"
            >
              {saving ? t('common.saving') : t('settings.saveSettings')}
            </Button>

            {/* Support Section */}
            <Card className="mb-6 p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                {t('settings.support')}
              </h2>

              <div className="space-y-2">
                {[
                  { label: t('settings.helpCenter'), href: '#' },
                  { label: t('settings.privacyPolicy'), href: '#' },
                  { label: t('settings.terms'), href: '#' },
                  { label: t('settings.reportBug'), href: '#' },
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
                {t('settings.dangerZone')}
              </h2>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-between bg-transparent"
                  onClick={() => setShowLogoutModal(true)}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('settings.logout')}
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-between"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('settings.deleteAccount')}
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
                <h2 className="text-2xl font-bold mb-4">{t('settings.logoutTitle')}</h2>
                <p className="text-muted-foreground mb-6">
                  {t('settings.logoutBody')}
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={handleLogout}
                    className="w-full bg-destructive hover:bg-destructive/90"
                  >
                    {t('settings.logout')}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setShowLogoutModal(false)}
                  >
                    {t('common.cancel')}
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Delete Account Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <Card className="w-full max-w-sm p-8 animate-in fade-in zoom-in-95">
                <h2 className="text-2xl font-bold mb-4 text-destructive">{t('settings.deleteTitle')}</h2>
                <p className="text-muted-foreground mb-6">
                  {t('settings.deleteBody')}
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={handleDeleteAccount}
                    className="w-full bg-destructive hover:bg-destructive/90"
                  >
                    {t('settings.deleteConfirm')}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    {t('common.cancel')}
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
