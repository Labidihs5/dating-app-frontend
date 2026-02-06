'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, X, Zap, Heart, MessageSquare, Eye, Flame } from 'lucide-react';
import { useI18n } from '@/components/i18n/LanguageProvider';

interface Feature {
  name: string;
  free: boolean | string;
  gold: boolean | string;
}

export default function GoldPage() {
  const { t } = useI18n();
  const [isPremium, setIsPremium] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('1month');

  const plans = [
    { id: '1month', name: t('gold.plan1Month'), price: '$9.99', perMonth: '$9.99' },
    { id: '3months', name: t('gold.plan3Months'), price: '$24.99', perMonth: '$8.33', discount: '17%' },
    { id: '6months', name: t('gold.plan6Months'), price: '$44.99', perMonth: '$7.50', discount: '25%' },
    { id: '1year', name: t('gold.plan1Year'), price: '$74.99', perMonth: '$6.25', discount: '38%' },
  ];

  const features: Feature[] = [
    { name: t('gold.featureDailySwipes'), free: '20', gold: t('common.unlimited') },
    { name: t('gold.featureViewLikes'), free: false, gold: true },
    { name: t('gold.featureMessaging'), free: false, gold: true },
    { name: t('gold.featureReadReceipts'), free: false, gold: true },
    { name: t('gold.featureSuperLikes'), free: t('gold.perWeek', { count: 5 }), gold: t('common.unlimited') },
    { name: t('gold.featureBoost'), free: false, gold: t('gold.perMonth', { count: 3 }) },
    { name: t('gold.featureViewedYou'), free: false, gold: true },
    { name: t('gold.featureDistanceFilter'), free: true, gold: true },
    { name: t('gold.featurePrioritySupport'), free: false, gold: true },
  ];

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    setIsPremium(true);
    setShowPaymentModal(false);
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="min-h-screen py-12 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-6xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <Crown className="w-12 h-12 text-primary animate-pulse" />
              </div>
              <h1 className="text-4xl font-bold mb-2">{t('gold.title')}</h1>
              <p className="text-xl text-muted-foreground">{t('gold.subtitle')}</p>
            </div>

            {/* Current Status */}
            {isPremium && (
              <Card className="mb-12 p-6 bg-gradient-to-r from-primary/20 to-accent/20 border-primary/50">
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-success" />
                  <div>
                    <p className="font-semibold">{t('gold.memberTitle')}</p>
                    <p className="text-sm text-muted-foreground">{t('gold.memberBody')}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Pricing Plans */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              {plans.map(plan => (
                <Card
                  key={plan.id}
                  className={`p-6 relative transition-all cursor-pointer ${
                    selectedPlan === plan.id
                      ? 'ring-2 ring-primary shadow-lg'
                      : 'hover:shadow-lg'
                  }`}
                >
                  {plan.discount && (
                    <Badge className="absolute -top-3 right-4 bg-accent text-accent-foreground">
                      {t('gold.save', { discount: plan.discount })}
                    </Badge>
                  )}

                  <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <p className="text-sm text-muted-foreground">
                      {t('gold.perMonthInline', { amount: plan.perMonth })}
                    </p>
                  </div>

                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isPremium}
                    className={`w-full ${
                      selectedPlan === plan.id
                        ? 'bg-primary hover:bg-primary/90'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {isPremium ? t('common.currentPlan') : t('common.choose')}
                  </Button>
                </Card>
              ))}
            </div>

            {/* Features Comparison */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">{t('gold.included')}</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">{t('gold.feature')}</th>
                      <th className="text-center py-3 px-4 font-semibold">{t('common.free')}</th>
                      <th className="text-center py-3 px-4 font-semibold">{t('common.gold')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-4 font-medium">{feature.name}</td>
                        <td className="py-4 px-4 text-center">
                          {typeof feature.free === 'boolean' ? (
                            feature.free ? (
                              <Check className="w-5 h-5 text-success mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-destructive mx-auto" />
                            )
                          ) : (
                            <span className="text-muted-foreground">{feature.free}</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {typeof feature.gold === 'boolean' ? (
                            <Check className="w-5 h-5 text-success mx-auto" />
                          ) : (
                            <span className="font-semibold">{feature.gold}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Additional Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                {
                  icon: Heart,
                  title: t('gold.benefits.title1'),
                  description: t('gold.benefits.desc1'),
                },
                {
                  icon: MessageSquare,
                  title: t('gold.benefits.title2'),
                  description: t('gold.benefits.desc2'),
                },
                {
                  icon: Flame,
                  title: t('gold.benefits.title3'),
                  description: t('gold.benefits.desc3'),
                },
              ].map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <Card key={idx} className="p-6 text-center hover:shadow-lg transition-shadow">
                    <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-bold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </Card>
                );
              })}
            </div>

            {/* FAQ */}
            <Card className="mt-12 p-8">
              <h2 className="text-2xl font-bold mb-6">{t('gold.faqTitle')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    q: t('gold.faq.q1'),
                    a: t('gold.faq.a1'),
                  },
                  {
                    q: t('gold.faq.q2'),
                    a: t('gold.faq.a2'),
                  },
                  {
                    q: t('gold.faq.q3'),
                    a: t('gold.faq.a3'),
                  },
                  {
                    q: t('gold.faq.q4'),
                    a: t('gold.faq.a4'),
                  },
                ].map((faq, idx) => (
                  <div key={idx}>
                    <h3 className="font-bold mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Payment Modal */}
            {showPaymentModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <Card className="w-full max-w-sm p-8 animate-in fade-in zoom-in-95">
                <h2 className="text-2xl font-bold mb-2">{t('gold.confirmPurchase')}</h2>
                <p className="text-muted-foreground mb-6">
                  {t('gold.planSuffix', { name: plans.find(p => p.id === selectedPlan)?.name || '' })}
                </p>

                <div className="bg-muted p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">{t('gold.amount')}</span>
                    <span className="font-bold text-lg">
                      {plans.find(p => p.id === selectedPlan)?.price}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{t('gold.perMonth')}</span>
                    <span>{plans.find(p => p.id === selectedPlan)?.perMonth}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleConfirmPayment}
                    className="w-full bg-success hover:bg-success/90"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {t('gold.confirmUpgrade')}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    {t('common.cancel')}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  {t('gold.securePayment')}
                </p>
              </Card>
            </div>
          )}
        </div>
      </PageContainer>
    </>
  );
}
