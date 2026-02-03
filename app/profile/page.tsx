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

type RelationshipType = 'friendship' | 'serious' | 'casual' | 'professional';

export default function ProfilePage() {
  const router = useRouter();
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
          tg.showAlert(user);
    
      if (user) {
        console.log('Telegram User:', user);
        tg.showAlert(`ID: ${user.id}\nNom: ${user.first_name}\nUsername: @${user.username ?? '—'}`);
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
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    address: '',
    city: '',
    country: '',
  });

  const relationshipOptions = [
    { value: 'friendship', label: '👯 Friendship' },
    { value: 'serious', label: '💕 Serious Relationship' },
    { value: 'casual', label: '😎 Casual Dating' },
    { value: 'professional', label: '💼 Professional' },
  ];

  const interestOptions = [
    'Travel',
    'Photography',
    'Fitness',
    'Art',
    'Music',
    'Cooking',
    'Games',
    'Reading',
    'Sports',
    'Hiking',
    'Yoga',
    'Meditation',
  ];

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
      alert('Please enter your name');
      return false;
    }
    if (!age || isNaN(parseInt(age)) || parseInt(age) < 18 || parseInt(age) > 100) {
      alert('Please enter a valid age (18-100)');
      return false;
    }
    if (!gender) {
      alert('Please select your gender');
      return false;
    }
    if (!bio) {
      alert('Please write a bio about yourself');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.photos.length === 0) {
      alert('Please upload at least one photo');
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
      alert('Please enter minimum age');
      return false;
    }
    if (!ageMax || isNaN(parseInt(ageMax))) {
      alert('Please enter maximum age');
      return false;
    }
    if (parseInt(ageMin) > parseInt(ageMax)) {
      alert('Minimum age cannot be greater than maximum age');
      return false;
    }
    if (!genderPref) {
      alert('Please select gender preference');
      return false;
    }
    if (!distance || isNaN(parseInt(distance))) {
      alert('Please enter maximum distance');
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
      alert('Please fill all required fields');
      return;
    }

    // Save name to localStorage
    saveUserName(name);

    try {
      await userAPI.updateProfile(name, {
        name,
        age: parseInt(age),
        gender,
        bio,
        photos: formData.photos,
        preferences,
        location,
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
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
              <h2 className="text-2xl font-bold mb-2">Profile Created!</h2>
              <p className="text-muted-foreground mb-8">
                Your profile is now live. Start discovering amazing people!
              </p>
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => router.push('/')}
              >
                Start Swiping
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
                Step {currentStep} of 4
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <Card className="p-8 space-y-6 animate-in fade-in">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Tell us about yourself</h2>
                    <p className="text-muted-foreground">Create your profile to get started</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          placeholder="Your age"
                          value={formData.age}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                          required
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us about yourself..."
                        rows={4}
                        value={formData.bio}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      />
                    </div>

                    <div>
                      <Label>What are you looking for?</Label>
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
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              )}

              {/* Step 2: Photos */}
              {currentStep === 2 && (
                <Card className="p-8 space-y-6 animate-in fade-in">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Add photos</h2>
                    <p className="text-muted-foreground">Upload 1-5 photos (clear, recent photos recommended)</p>
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
                            Remove
                          </button>
                        </div>
                      ))}

                      {formData.photos.length < 5 && (
                        <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer flex items-center justify-center transition-colors bg-muted/50">
                          <div className="text-center">
                            <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm font-medium">Add Photo</p>
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
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 bg-primary hover:bg-primary/90"
                      disabled={formData.photos.length === 0}
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              )}

              {/* Step 3: Preferences */}
              {currentStep === 3 && (
                <Card className="p-8 space-y-6 animate-in fade-in">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Your preferences</h2>
                    <p className="text-muted-foreground">Help us find your perfect match</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ageMin">Age Range (Min)</Label>
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
                        <Label htmlFor="ageMax">Age Range (Max)</Label>
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
                      <Label htmlFor="genderPreference">Gender Preference</Label>
                      <select
                        id="genderPreference"
                        name="genderPreference"
                        value={preferences.genderPreference}
                        onChange={handlePreferenceChange}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Any</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="all">All</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="maxDistance">Max Distance (km)</Label>
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
                      <Label>Interests</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {interestOptions.map(interest => (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => handleInterestToggle(interest)}
                            className={`px-3 py-2 rounded-lg transition-all ${
                              preferences.interests.includes(interest)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                          >
                            {interest}
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
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      Next: Location
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
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(5)}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        Next: Review
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
                    <h2 className="text-2xl font-bold mb-2">Review Your Profile</h2>
                    <p className="text-muted-foreground">Make sure everything looks good</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Basic Info</p>
                      <p className="font-semibold">{formData.name}, {formData.age}</p>
                      {location.city && (
                        <p className="text-sm text-muted-foreground">📍 {location.city}, {location.country}</p>
                      )}
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Search Preferences</p>
                      <p className="text-sm">
                        Ages {preferences.ageMin || '18'}-{preferences.ageMax || '65'} • {preferences.maxDistance || '50'}km
                      </p>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Selected Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {preferences.interests.length > 0 ? (
                          preferences.interests.map(interest => (
                            <Badge key={interest} variant="secondary">
                              {interest}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">None selected</p>
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
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-success hover:bg-success/90"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit(e as any);
                      }}
                    >
                      Create Profile
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
