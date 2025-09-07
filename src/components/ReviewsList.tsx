import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  display_name: string;
  rating: number;
  title: string;
  body: string;
  published_at: string;
}

export const ReviewsList = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const reviewsPerPage = 10;

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [reviews, starFilter]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .rpc('get_published_reviews_safe', { 
          p_limit: 1000, 
          p_offset: 0 
        });

      if (error) {
        console.error('Error fetching reviews:', error);
        return;
      }

      setReviews(data || []);
      
      // Calculate average rating
      if (data && data.length > 0) {
        const avg = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
        setAverageRating(Math.round(avg * 10) / 10);
        setTotalReviews(data.length);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = reviews;
    
    if (starFilter !== 'all') {
      filtered = reviews.filter(review => review.rating === starFilter);
    }
    
    setFilteredReviews(filtered);
    setCurrentPage(1);
  };

  // No longer needed as display_name is already formatted securely

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Bewertungen werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Kundenbewertungen</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex">{renderStars(Math.round(averageRating))}</div>
            <span className="text-2xl font-bold">{averageRating}</span>
            <span className="text-muted-foreground">aus {totalReviews} Bewertungen</span>
          </div>
        </CardContent>
      </Card>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={starFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStarFilter('all')}
        >
          Alle
        </Button>
        {[5, 4, 3, 2, 1].map(stars => (
          <Button
            key={stars}
            variant={starFilter === stars ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStarFilter(stars)}
            className="flex items-center space-x-1"
          >
            <span>{stars}</span>
            <Star className="w-3 h-3" />
          </Button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {paginatedReviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                {starFilter === 'all' 
                  ? 'Noch keine Bewertungen verfügbar.' 
                  : `Keine Bewertungen mit ${starFilter} Sternen gefunden.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          paginatedReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{review.display_name}</span>
                          <div className="flex">{renderStars(review.rating)}</div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.published_at).toLocaleDateString('de-DE')}
                        </p>
                      </div>
                  </div>
                  
                  {review.title && (
                    <h3 className="font-semibold text-lg">{review.title}</h3>
                  )}
                  
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {review.body}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Zurück
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={page === currentPage ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Weiter
          </Button>
        </div>
      )}

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AggregateRating",
            "itemReviewed": {
              "@type": "Service",
              "name": "CV Boost Service",
              "provider": {
                "@type": "Person",
                "name": "Marcel"
              }
            },
            "ratingValue": averageRating,
            "reviewCount": totalReviews,
            "bestRating": 5,
            "worstRating": 1
          })
        }}
      />
    </div>
  );
};