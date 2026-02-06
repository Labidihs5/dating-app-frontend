'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/components/i18n/LanguageProvider';

interface LocationSetupProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    country?: string;
  }) => void;
  onSkip?: () => void;
}

export function LocationSetup({ onLocationSelect, onSkip }: LocationSetupProps) {
  const { t } = useI18n();
  const [selectedOption, setSelectedOption] = useState<'gps' | 'manual' | null>(null);
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleGetGPS = useCallback(async () => {
    if (!navigator.geolocation) {
      setGpsError(t('locationSetup.gpsErrorUnsupported'));
      setLocationStatus('error');
      return;
    }

    setIsLoadingGPS(true);
    setLocationStatus('loading');
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Try to get address from coordinates using reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          onLocationSelect({
            latitude,
            longitude,
            address: data.address?.road || data.address?.suburb || data.display_name,
            city: data.address?.city || data.address?.town || '',
            country: data.address?.country || '',
          });

          setLocationStatus('success');
          setSelectedOption('gps');
        } catch (error) {
          console.error('Error getting address:', error);
          onLocationSelect({
            latitude,
            longitude,
            address: `${latitude}, ${longitude}`,
          });
          setLocationStatus('success');
          setSelectedOption('gps');
        } finally {
          setIsLoadingGPS(false);
        }
      },
      (error) => {
        let errorMessage = t('locationSetup.gpsErrorGeneric');
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t('locationSetup.gpsErrorDenied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = t('locationSetup.gpsErrorUnavailable');
            break;
          case error.TIMEOUT:
            errorMessage = t('locationSetup.gpsErrorTimeout');
            break;
        }
        setGpsError(errorMessage);
        setLocationStatus('error');
        setIsLoadingGPS(false);
      }
    );
  }, [onLocationSelect]);

  const handleManualLocation = () => {
    if (city.trim()) {
      onLocationSelect({
        latitude: 0, // Will be geocoded by backend
        longitude: 0,
        city: city.trim(),
        country: country.trim(),
      });
      setLocationStatus('success');
      setSelectedOption('manual');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{t('locationSetup.title')}</h2>
        <p className="text-muted-foreground">
          {t('locationSetup.subtitle')}
        </p>
      </div>

      <div className="space-y-3">
        {/* GPS Option */}
        <Card
          className={`p-4 cursor-pointer transition-all border-2 ${
            selectedOption === 'gps'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => !isLoadingGPS && setSelectedOption('gps')}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                {t('locationSetup.gpsTitle')}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {t('locationSetup.gpsBody')}
              </p>

              {selectedOption === 'gps' && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGetGPS();
                  }}
                  disabled={isLoadingGPS}
                  className="w-full"
                  size="sm"
                >
                  {isLoadingGPS ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('locationSetup.gettingLocation')}
                    </>
                  ) : locationStatus === 'success' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {t('locationSetup.locationSet')}
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 mr-2" />
                      {t('locationSetup.getMyLocation')}
                    </>
                  )}
                </Button>
              )}

              {gpsError && selectedOption === 'gps' && (
                <div className="mt-2 p-2 bg-destructive/10 border border-destructive/30 rounded text-sm text-destructive flex gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {gpsError}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Manual Location Option */}
        <Card
          className={`p-4 cursor-pointer transition-all border-2 ${
            selectedOption === 'manual'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setSelectedOption('manual')}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                {t('locationSetup.manualTitle')}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {t('locationSetup.manualBody')}
              </p>

              {selectedOption === 'manual' && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="city" className="text-sm">
                      {t('locationSetup.city')}
                    </Label>
                    <Input
                      id="city"
                      placeholder={t('locationSetup.cityPlaceholder')}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-sm">
                      {t('locationSetup.country')}
                    </Label>
                    <Input
                      id="country"
                      placeholder={t('locationSetup.countryPlaceholder')}
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    onClick={handleManualLocation}
                    disabled={!city.trim()}
                    className="w-full"
                    size="sm"
                  >
                    {t('locationSetup.confirmLocation')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Skip Option */}
        <Card
          className={`p-4 cursor-pointer transition-all border-2 ${
            selectedOption === null && locationStatus === 'idle'
              ? 'border-border'
              : 'border-border hover:border-border'
          }`}
          onClick={() => setSelectedOption(null)}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                {t('locationSetup.skipTitle')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('locationSetup.skipBody')}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex gap-3">
        {onSkip && (
          <Button
            variant="outline"
            onClick={onSkip}
            className="flex-1 bg-transparent"
          >
            {t('common.skip')}
          </Button>
        )}
        <Button
          disabled={locationStatus === 'loading' || (selectedOption === 'manual' && !city.trim())}
          onClick={() => {
            if (selectedOption === 'manual') {
              handleManualLocation();
            } else if (selectedOption === null) {
              onSkip?.();
            }
          }}
          className="flex-1"
        >
          {locationStatus === 'loading' ? t('locationSetup.processing') : t('common.continue')}
        </Button>
      </div>
    </div>
  );
}
