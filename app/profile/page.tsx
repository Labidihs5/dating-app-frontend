'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { LocationSetup } from '@/components/location/LocationSetup';
import { getTelegramUser, saveUserName } from '@/lib/telegram-utils';
import { userAPI } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useI18n } from '@/components/i18n/LanguageProvider';
import { translate } from '@/lib/i18n';

type RelationshipType = 'friendship' | 'serious' | 'casual' | 'professional';

export default function ProfilePage() {
  const router = useRouter();
  const { t, language } = useI18n();
  const formatNumber = (value: number) => value.toLocaleString(language);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    bio: '',
    relationshipType: 'serious' as RelationshipType,
    photos: [] as string[],
  });

  useEffect(() => {
    
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
      const user = tg.initDataUnsafe?.user;
          //tg.showAlert(user);
    
      if (user) {
        console.log('Telegram User:', user);
        console.log(`ID: ${user.id}\nNom: ${user.first_name}\nUsername: @${user.username ?? '—'}`);
      }
    }
  }, []);

  const [preferences, setPreferences] = useState({
    ageMin: '',
    ageMax: '',
    genderPreference: '',
    maxDistance: '',
    interests: [] as string[],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    country?: string;
  }>({
    latitude: 0,
    longitude: 0,
  });

  const relationshipOptions = [
    { value: 'friendship', label: t('profile.relationships.friendship') },
    { value: 'serious', label: t('profile.relationships.serious') },
    { value: 'casual', label: t('profile.relationships.casual') },
    { value: 'professional', label: t('profile.relationships.professional') },
  ];

  const interestOptions = React.useMemo(() => ([
    { value: 'travel', label: t('profile.interestsList.travel'), aliases: [translate('en', 'profile.interestsList.travel'), translate('ar', 'profile.interestsList.travel')] },
    { value: 'photography', label: t('profile.interestsList.photography'), aliases: [translate('en', 'profile.interestsList.photography'), translate('ar', 'profile.interestsList.photography')] },
    { value: 'fitness', label: t('profile.interestsList.fitness'), aliases: [translate('en', 'profile.interestsList.fitness'), translate('ar', 'profile.interestsList.fitness')] },
    { value: 'art', label: t('profile.interestsList.art'), aliases: [translate('en', 'profile.interestsList.art'), translate('ar', 'profile.interestsList.art')] },
    { value: 'music', label: t('profile.interestsList.music'), aliases: [translate('en', 'profile.interestsList.music'), translate('ar', 'profile.interestsList.music')] },
    { value: 'cooking', label: t('profile.interestsList.cooking'), aliases: [translate('en', 'profile.interestsList.cooking'), translate('ar', 'profile.interestsList.cooking')] },
    { value: 'games', label: t('profile.interestsList.games'), aliases: [translate('en', 'profile.interestsList.games'), translate('ar', 'profile.interestsList.games')] },
    { value: 'reading', label: t('profile.interestsList.reading'), aliases: [translate('en', 'profile.interestsList.reading'), translate('ar', 'profile.interestsList.reading')] },
    { value: 'sports', label: t('profile.interestsList.sports'), aliases: [translate('en', 'profile.interestsList.sports'), translate('ar', 'profile.interestsList.sports')] },
    { value: 'hiking', label: t('profile.interestsList.hiking'), aliases: [translate('en', 'profile.interestsList.hiking'), translate('ar', 'profile.interestsList.hiking')] },
    { value: 'yoga', label: t('profile.interestsList.yoga'), aliases: [translate('en', 'profile.interestsList.yoga'), translate('ar', 'profile.interestsList.yoga')] },
    { value: 'meditation', label: t('profile.interestsList.meditation'), aliases: [translate('en', 'profile.interestsList.meditation'), translate('ar', 'profile.interestsList.meditation')] },
  ]), [t]);

  const interestLabelMap = React.useMemo(
    () => new Map(interestOptions.map(option => [option.value, option.label])),
    [interestOptions]
  );

  useEffect(() => {
    setPreferences(prev => {
      const normalized = prev.interests.map((interest) => {
        const option = interestOptions.find(opt => opt.value === interest || opt.aliases.includes(interest));
        return option ? option.value : interest;
      });
      const same = normalized.length === prev.interests.length && normalized.every((val, idx) => val === prev.interests[idx]);
      return same ? prev : { ...prev, interests: normalized };
    });
  }, [interestOptions, language]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  // Validation functions for each step
  const validateStep1 = () => {
    const name = formData.name?.trim() || '';
    const age = formData.age?.toString().trim() || '';
    const gender = formData.gender?.trim() || '';
    const bio = formData.bio?.trim() || '';

    if (!name) {
      alert(t('profile.validation.name'));
      return false;
    }
    if (!age || isNaN(parseInt(age)) || parseInt(age) < 18 || parseInt(age) > 100) {
      alert(t('profile.validation.age'));
      return false;
    }
    if (!gender) {
      alert(t('profile.validation.gender'));
      return false;
    }
    if (!bio) {
      alert(t('profile.validation.bio'));
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.photos.length === 0) {
      alert(t('profile.validation.photo'));
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    const ageMin = preferences.ageMin?.toString().trim() || '';
    const ageMax = preferences.ageMax?.toString().trim() || '';
    const genderPref = preferences.genderPreference?.trim() || '';
    const distance = preferences.maxDistance?.toString().trim() || '';

    if (!ageMin || isNaN(parseInt(ageMin))) {
      alert(t('profile.validation.minAge'));
      return false;
    }
    if (!ageMax || isNaN(parseInt(ageMax))) {
      alert(t('profile.validation.maxAge'));
      return false;
    }
    if (parseInt(ageMin) > parseInt(ageMax)) {
      alert(t('profile.validation.minGreater'));
      return false;
    }
    if (!genderPref) {
      alert(t('profile.validation.genderPref'));
      return false;
    }
    if (!distance || isNaN(parseInt(distance))) {
      alert(t('profile.validation.distance'));
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    setCurrentStep(currentStep + 1);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...urls].slice(0, 5),
        photoFiles: [...(prev as any).photoFiles || [], ...Array.from(files)].slice(0, 5),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const name = formData.name?.trim() || '';
    const age = formData.age?.toString().trim() || '';
    const gender = formData.gender?.trim() || '';
    const bio = formData.bio?.trim() || '';
    
    if (!name || !age || !gender || !bio) {
      alert(t('profile.validation.required'));
      return;
    }

    // Get Telegram user ID
    const telegramUser = getTelegramUser();
    const userId = telegramUser?.id || name;

    // Save name to localStorage
    saveUserName(name);

    try {
      // 1. Create user profile
      await userAPI.updateProfile(userId, {
        name,
        age: parseInt(age),
        gender,
        bio,
        photos: [],
        preferences,
        location,
        relationshipType: formData.relationshipType,
      });
      
      // 2. Upload photos if any
      if ((formData as any).photoFiles?.length > 0) {
        const formDataUpload = new FormData();
        (formData as any).photoFiles.forEach((file: File) => formDataUpload.append('photos', file));

        const response = await fetch(`/api/users/${userId}/photos`, {
          method: 'POST',
          body: formDataUpload
        });

        if (!response.ok) {
          throw new Error('Photo upload failed');
        }
      }
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(t('profile.validation.saveFailed'));
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Navbar />
        <PageContainer>
          <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-12 text-center bg-gradient-to-br from-primary/10 to-accent/10">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-success animate-bounce" />
              <h2 className="text-2xl font-bold mb-2">{t('profile.createdTitle')}</h2>
              <p className="text-muted-foreground mb-8">
                {t('profile.createdBody')}
              </p>
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => router.push('/')}
              >
                {t('profile.startSwiping')}
              </Button>
            </Card>
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="min-h-screen py-12">
          <div className="max-w-2xl mx-auto px-4">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex gap-2 justify-between mb-4">
                {[1, 2, 3, 4].map(step => (
                  <div
                    key={step}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      step <= currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {t('profile.stepOf', { current: formatNumber(currentStep), total: formatNumber(4) })}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <Card className="p-8 space-y-6 animate-in fade-in">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{t('profile.step1Title')}</h2>
                    <p className="text-muted-foreground">{t('profile.step1Subtitle')}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">{t('profile.name')}</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder={t('profile.yourName')}
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age">{t('profile.age')}</Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          placeholder={t('profile.yourAge')}
                          value={formData.age}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">{t('profile.gender')}</Label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                          required
                        >
                          <option value="">{t('profile.select')}</option>
                          <option value="male">{t('profile.male')}</option>
                          <option value="female">{t('profile.female')}</option>
                          <option value="other">{t('profile.other')}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">{t('profile.bio')}</Label>
                      <textarea
                        id="bio"
                        name="bio"
                        placeholder={t('profile.bioPlaceholder')}
                        rows={4}
                        value={formData.bio}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      />
                    </div>

                    <div>
                      <Label>{t('profile.lookingFor')}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {relationshipOptions.map(option => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, relationshipType: option.value as RelationshipType }))}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              formData.relationshipType === option.value
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      disabled
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t('common.back')}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      {t('common.next')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              )}

              {/* Step 2: Photos */}
              {currentStep === 2 && (
                <Card className="p-8 space-y-6 animate-in fade-in">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{t('profile.step2Title')}</h2>
                    <p className="text-muted-foreground">{t('profile.step2Subtitle')}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {formData.photos.map((photo, idx) => (
                        <div
                          key={idx}
                          className="aspect-square rounded-lg overflow-hidden border-2 border-border relative group"
                        >
                          <img
                            src={photo || "/placeholder.svg"}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                photos: prev.photos.filter((_, i) => i !== idx),
                              }));
                            }}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            {t('profile.remove')}
                          </button>
                        </div>
                      ))}

                      {formData.photos.length < 5 && (
                        <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer flex items-center justify-center transition-colors bg-muted/50">
                          <div className="text-center">
                            <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm font-medium">{t('profile.addPhoto')}</p>
                          </div>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t('common.back')}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 bg-primary hover:bg-primary/90"
                      disabled={formData.photos.length === 0}
                    >
                      {t('common.next')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              )}

              {/* Step 3: Preferences */}
              {currentStep === 3 && (
                <Card className="p-8 space-y-6 animate-in fade-in">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{t('profile.step3Title')}</h2>
                    <p className="text-muted-foreground">{t('profile.step3Subtitle')}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ageMin">{t('profile.ageRangeMin')}</Label>
                        <Input
                          id="ageMin"
                          name="ageMin"
                          type="number"
                          placeholder="18"
                          value={preferences.ageMin}
                          onChange={handlePreferenceChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ageMax">{t('profile.ageRangeMax')}</Label>
                        <Input
                          id="ageMax"
                          name="ageMax"
                          type="number"
                          placeholder="65"
                          value={preferences.ageMax}
                          onChange={handlePreferenceChange}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="genderPreference">{t('profile.genderPreference')}</Label>
                      <select
                        id="genderPreference"
                        name="genderPreference"
                        value={preferences.genderPreference}
                        onChange={handlePreferenceChange}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">{t('profile.any')}</option>
                        <option value="male">{t('profile.male')}</option>
                        <option value="female">{t('profile.female')}</option>
                        <option value="all">{t('profile.all')}</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="maxDistance">{t('profile.maxDistance')}</Label>
                      <Input
                        id="maxDistance"
                        name="maxDistance"
                        type="number"
                        placeholder="50"
                        value={preferences.maxDistance}
                        onChange={handlePreferenceChange}
                      />
                    </div>

                    <div>
                      <Label>{t('profile.interests')}</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {interestOptions.map(interest => (
                          <button
                            key={interest.value}
                            type="button"
                            onClick={() => handleInterestToggle(interest.value)}
                            className={`px-3 py-2 rounded-lg transition-all ${
                              preferences.interests.includes(interest.value)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                          >
                            {interest.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t('common.back')}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      {t('profile.step4Next')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              )}

              {/* Step 4: Location Setup */}
              {currentStep === 4 && (
                <Card className="p-8 animate-in fade-in">
                  <LocationSetup
                    onLocationSelect={(loc) => {
                      setLocation(loc);
                      setCurrentStep(5); // Mark as complete
                    }}
                    onSkip={() => setCurrentStep(5)}
                  />
                  <div className="mt-8">
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(3)}
                        className="flex-1"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('common.back')}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(5)}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        {t('profile.nextReview')}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Step 5: Confirm and Submit */}
              {currentStep === 5 && (
                <Card className="p-8 space-y-6 animate-in fade-in">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{t('profile.step5Title')}</h2>
                    <p className="text-muted-foreground">{t('profile.step5Subtitle')}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">{t('profile.basicInfo')}</p>
                      <p className="font-semibold">{formData.name}, {formData.age}</p>
                      {location.city && (
                        <p className="text-sm text-muted-foreground">📍 {location.city}, {location.country}</p>
                      )}
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">{t('profile.searchPreferences')}</p>
                      <p className="text-sm">
                        {t('profile.ageRange', {
                          min: preferences.ageMin || '18',
                          max: preferences.ageMax || '65',
                          distance: preferences.maxDistance || '50',
                        })}
                      </p>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">{t('profile.selectedInterests')}</p>
                      <div className="flex flex-wrap gap-2">
                        {preferences.interests.length > 0 ? (
                          preferences.interests.map(interest => (
                            <Badge key={interest} variant="secondary">
                              {interestLabelMap.get(interest) || interest}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">{t('profile.noneSelected')}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(4)}
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t('common.back')}
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-success hover:bg-success/90"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit(e as any);
                      }}
                    >
                      {t('profile.createProfile')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              )}
            </form>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
