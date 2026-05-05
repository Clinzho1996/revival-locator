'use client';

import { useState } from 'react';
import { Review } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, User } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ReviewSystemProps {
  reviews: Review[];
  eventId: string;
}

export function ReviewSystem({ reviews: initialReviews, eventId }: ReviewSystemProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = () => {
    if (!newReview.trim()) return;

    const review: Review = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'u_current',
      userName: 'You',
      rating,
      comment: newReview,
      createdAt: new Date().toISOString(),
    };

    setReviews([review, ...reviews]);
    setNewReview('');
    toast.success('Review submitted successfully!');
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-primary">Reviews & Experiences</h3>
        <Card className="bg-card/50 border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg">Share your testimony</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-1 hover:scale-110 transition-transform ${star <= rating ? 'text-amber-500' : 'text-muted-foreground'
                    }`}
                >
                  <Star className={`w-6 h-6 ${star <= rating ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>
            <Textarea
              placeholder="How was the event? Share your experience..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="min-h-[100px] bg-background/50"
            />
            <Button onClick={handleSubmit} className="w-full sm:w-auto bg-primary">
              Post Review
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground italic text-center py-8">No reviews yet. Be the first to share!</p>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="border-primary/5 bg-background/50">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">{review.userName}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(review.createdAt), 'PPp')}</p>
                    </div>
                  </div>
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
