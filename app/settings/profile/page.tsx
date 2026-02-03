'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, X, User, Star } from 'lucide-react';
import { userAPI } from '@/lib/api-services';
import { getTelegramUser } from '@/lib/telegram-utils';
import { getImageUrl } from '@/lib/image-utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export default function EditProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    age: 0,
    gender: '',
    bio: '',
    photos: [] as string[],
    profilePhotoIndex: 0
  });
  const [uploading, setUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const user = getTelegramUser();
    if (user) {
      setUserId(user.id);
      loadProfile(user.id);
    }
  }, []);

  const loadProfile = async (id: string) => {
    try {
      const data = await userAPI.getProfile(id);
      if (data) {
        setProfile({
          name: data.name || '',
          age: data.age || 0,
          gender: data.gender || '',
          bio: data.bio || '',
          photos: data.photos || [],
          profilePhotoIndex: data.profilePhotoIndex || 0
        });
        setPreviewUrls(data.photos || []);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !userId) return;

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => formData.append('photos', file));

      const response = await fetch(`/api/users/${userId}/photos`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setProfile(prev => ({ ...prev, photos: data.photos }));
      setPreviewUrls(data.photos);
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Failed to upload photos');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async (index: number) => {
    if (!userId) return;
    
    const updatedPhotos = profile.photos.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    let newProfilePhotoIndex = profile.profilePhotoIndex;
    
    if (index === profile.profilePhotoIndex) {
      newProfilePhotoIndex = 0;
    } else if (index < profile.profilePhotoIndex) {
      newProfilePhotoIndex = profile.profilePhotoIndex - 1;
    }
    
    try {
      await userAPI.updateProfile(userId, { ...profile, photos: updatedPhotos, profilePhotoIndex: newProfilePhotoIndex });
      setProfile(prev => ({ ...prev, photos: updatedPhotos, profilePhotoIndex: newProfilePhotoIndex }));
      setPreviewUrls(updatedPreviews);
    } catch (error) {
      console.error('Error removing photo:', error);
      alert('Failed to remove photo');
    }
  };

  const handleSave = async () => {
    if (!userId) return;

    setSaving(true);
    try {
      await userAPI.updateProfile(userId, profile);
      router.push('/settings');
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <PageContainer>
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="min-h-screen py-8 pb-20 md:pl-20">
          <div className="max-w-2xl mx-auto px-4">
            <div className="mb-8 flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/settings')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Edit Profile</h1>
                <p className="text-muted-foreground">Update your profile information</p>
              </div>
            </div>

            <Card className="p-6 mb-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Photos ({profile.photos.length}/5)
              </h2>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {previewUrls.map((photo, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={`/api/photos?path=${encodeURIComponent(photo)}`}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {idx === profile.profilePhotoIndex && (
                      <div className="absolute top-2 left-2 bg-primary text-white rounded-full p-1.5">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    )}
                    <button
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {idx !== profile.profilePhotoIndex && (
                      <button
                        onClick={() => setProfile(prev => ({ ...prev, profilePhotoIndex: idx }))}
                        className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs py-1 rounded hover:bg-black/90"
                      >
                        Set as main
                      </button>
                    )}
                  </div>
                ))}

                {profile.photos.length < 5 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>

              {uploading && (
                <p className="text-sm text-muted-foreground">Uploading...</p>
              )}
            </Card>

            <Card className="p-6 mb-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age}
                    onChange={e => setProfile(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={profile.gender}
                    onChange={e => setProfile(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
              </div>
            </Card>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-primary hover:bg-primary/90 py-6 text-base"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
