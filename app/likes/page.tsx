'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Lock, Crown } from 'lucide-react';
import { likesAPI } from '@/lib/api-services';
import { getTelegramUser } from '@/lib/telegram-utils';

interface Like {
  id: string;
  senderId: string;
  receiverId: string;
  isSuper: boolean;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    age: number;
    photos: string[];
    bio?: string;
  };
}

export default function LikesPage() {
  const [isPremium, setIsPremium] = useState(false);
  const [likes, setLikes] = useState<Like[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = getTelegramUser();
    if (user) {
      setUserId(user.id.toString());
    }
  }, []);

  useEffect(() => {
    if (userId) {
      loadLikes();
    }
  }, [userId]);

  const loadLikes = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await likesAPI.getLikes(userId);
      setLikes(data);
    } catch (error) {
      console.error('Error loading likes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (id: string) => {
    if (!isPremium) {
      setShowUpgradeModal(true);
      return;
    }
    // Navigate to profile or open modal
  };

  const handleLike = async (likeId: string, accept: boolean) => {
    if (!userId) return;
    try {
      await likesAPI.respondToLike(likeId, accept, userId);
      setLikes(likes.filter(like => like.id !== likeId));
    } catch (error) {
      console.error('Error responding to like:', error);
    }
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="min-h-screen py-8">
          <div className="max-w-6xl mx-auto px-4">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-8 h-8 text-accent fill-accent" />
                <h1 className="text-3xl font-bold">Who Liked Me</h1>
              </div>
              <p className="text-muted-foreground">
                {isPremium
                  ? `${likes.length} people have liked you`
                  : 'Upgrade to see who likes you'}
              </p>
            </div>

            {!isPremium && (
              <Card className="mb-8 p-6 bg-gradient-to-r from-primary/20 to-accent/20 border-primary/50">
                <div className="flex items-center gap-4">
                  <Lock className="w-6 h-6 text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Profiles are hidden</p>
                    <p className="text-sm text-muted-foreground">
                      Upgrade to Gold to see who likes you
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsPremium(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Upgrade Now
                  </Button>
                </div>
              </Card>
            )}

            {/* Likers Grid */}
            {loading ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">Loading likes...</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {likes.map(like => {
                  const liker = like.sender;
                  if (!liker) return null;
                  
                  return (
                    <Card
                      key={like.id}
                      className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                        !isPremium ? 'relative blur-sm' : ''
                      }`}
                      onClick={() => handleViewProfile(like.id)}
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={liker.photos?.[0] ? `/api/photos?path=${encodeURIComponent(liker.photos[0])}` : "/placeholder.svg"}
                          alt={liker.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {isPremium && (
                          <>
                            {like.isSuper && (
                              <div className="absolute top-3 right-3">
                                <Badge className="bg-primary text-primary-foreground">
                                  ⭐ Super Like
                                </Badge>
                              </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                              <h3 className="font-bold">{liker.name}, {liker.age}</h3>
                            </div>
                          </>
                        )}

                        {!isPremium && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Lock className="w-8 h-8 text-white" />
                          </div>
                        )}
                      </div>

                      {isPremium && (
                        <div className="p-4 space-y-3">
                          <div>
                            <h3 className="font-bold text-lg">{liker.name}, {liker.age}</h3>
                          </div>
                          <p className="text-sm text-foreground line-clamp-2">{liker.bio}</p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(like.id, false);
                              }}
                            >
                              Not Interested
                            </Button>
                            <Button
                              className="flex-1 bg-accent hover:bg-accent/90"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(like.id, true);
                              }}
                            >
                              Like Back
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}

            {!loading && likes.length === 0 && (
              <Card className="p-12 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h2 className="text-xl font-bold mb-2">No likes yet</h2>
                <p className="text-muted-foreground">
                  Keep swiping and soon people will start liking you!
                </p>
              </Card>
            )}
          </div>

          {/* Upgrade Modal */}
          {showUpgradeModal && !isPremium && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <Card className="w-full max-w-sm p-8 animate-in fade-in zoom-in-95">
                <div className="flex justify-center mb-4">
                  <Crown className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-4">Unlock Profiles</h2>
                <p className="text-muted-foreground text-center mb-6">
                  Upgrade to Gold to see who likes you and discover premium features.
                </p>
                <div className="space-y-3">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setIsPremium(true);
                      setShowUpgradeModal(false);
                    }}
                  >
                    Upgrade to Gold
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setShowUpgradeModal(false)}
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
