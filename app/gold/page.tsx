'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, X, Zap, Heart, MessageSquare, Eye, Flame } from 'lucide-react';

interface Feature {
  name: string;
  free: boolean | string;
  gold: boolean | string;
}

const features: Feature[] = [
  { name: 'Daily Swipes', free: '20', gold: 'Unlimited' },
  { name: 'View Likes', free: false, gold: true },
  { name: 'Messaging', free: false, gold: true },
  { name: 'Read Receipts', free: false, gold: true },
  { name: 'Super Likes', free: '5/week', gold: 'Unlimited' },
  { name: 'Boost Profiles', free: false, gold: '3/month' },
  { name: 'See Who Viewed You', free: false, gold: true },
  { name: 'Filter by Distance', free: true, gold: true },
  { name: 'Priority Support', free: false, gold: true },
];

export default function GoldPage() {
  const [isPremium, setIsPremium] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('1month');

  const plans = [
    { id: '1month', name: '1 Month', price: '$9.99', perMonth: '$9.99' },
    { id: '3months', name: '3 Months', price: '$24.99', perMonth: '$8.33', discount: '17%' },
    { id: '6months', name: '6 Months', price: '$44.99', perMonth: '$7.50', discount: '25%' },
    { id: '1year', name: '1 Year', price: '$74.99', perMonth: '$6.25', discount: '38%' },
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
              <h1 className="text-4xl font-bold mb-2">HeartMatch Gold</h1>
              <p className="text-xl text-muted-foreground">
                Unlock premium features and find your perfect match faster
              </p>
            </div>

            {/* Current Status */}
            {isPremium && (
              <Card className="mb-12 p-6 bg-gradient-to-r from-primary/20 to-accent/20 border-primary/50">
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-success" />
                  <div>
                    <p className="font-semibold">✨ You're a Gold member!</p>
                    <p className="text-sm text-muted-foreground">Enjoy unlimited access to all premium features</p>
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
                      Save {plan.discount}
                    </Badge>
                  )}

                  <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <p className="text-sm text-muted-foreground">
                      ${plan.perMonth}/month
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
                    {isPremium ? 'Current Plan' : 'Choose'}
                  </Button>
                </Card>
              ))}
            </div>

            {/* Features Comparison */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">What's included?</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Feature</th>
                      <th className="text-center py-3 px-4 font-semibold">FREE</th>
                      <th className="text-center py-3 px-4 font-semibold">GOLD</th>
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
                  title: 'See All Likes',
                  description: 'Know exactly who likes you instantly',
                },
                {
                  icon: MessageSquare,
                  title: 'Unlimited Messaging',
                  description: 'Chat with unlimited matches',
                },
                {
                  icon: Flame,
                  title: 'Premium Boost',
                  description: 'Get more visibility in searches',
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
              <h2 className="text-2xl font-bold mb-6">Questions?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    q: 'Can I cancel anytime?',
                    a: 'Yes! Cancel your subscription anytime with no penalties.',
                  },
                  {
                    q: 'What payment methods do you accept?',
                    a: 'We accept all major credit cards and digital wallets.',
                  },
                  {
                    q: 'Is there a free trial?',
                    a: 'Contact support for special offers and trial eligibility.',
                  },
                  {
                    q: 'What if I change my mind?',
                    a: 'Get a full refund within 7 days of purchase.',
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
                <h2 className="text-2xl font-bold mb-2">Confirm Purchase</h2>
                <p className="text-muted-foreground mb-6">
                  {plans.find(p => p.id === selectedPlan)?.name} Plan
                </p>

                <div className="bg-muted p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-bold text-lg">
                      {plans.find(p => p.id === selectedPlan)?.price}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Per month:</span>
                    <span>{plans.find(p => p.id === selectedPlan)?.perMonth}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleConfirmPayment}
                    className="w-full bg-success hover:bg-success/90"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Confirm & Upgrade
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Secure payment processed by Stripe
                </p>
              </Card>
            </div>
          )}
        </div>
      </PageContainer>
    </>
  );
}
