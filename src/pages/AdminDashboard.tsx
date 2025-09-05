import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star } from 'lucide-react';
import { callEdge } from '@/utils/callEdge';
import Layout from '@/components/Layout';

interface PendingReview {
  id: string;
  name: string;
  title: string;
  rating: number;
  body: string;
  verified_at: string;
}

interface UpcomingBooking {
  id: string;
  name: string;
  email: string;
  discord_name: string;
  note: string;
  starts_at: string;
  duration_minutes: number;
  status: string;
}

const AdminDashboard = () => {
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<{
    pendingReviews: PendingReview[];
    upcomingBookings: UpcomingBooking[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const authenticate = async () => {
    if (!adminPassword) {
      setError('Bitte geben Sie das Admin-Passwort ein.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://grryxotfastfmgrrfrun.supabase.co/functions/v1/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${adminPassword}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Authentifizierung fehlgeschlagen');
      }

      const data = await response.json();
      setDashboardData(data);
      setIsAuthenticated(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Fehler beim Laden der Dashboard-Daten');
    } finally {
      setIsLoading(false);
    }
  };

  const publishReview = async (reviewId: string) => {
    try {
      await callEdge('/reviews/publish', {
        method: 'POST',
        body: JSON.stringify({
          reviewId,
          adminPassword,
        }),
      });

      // Refresh dashboard data
      authenticate();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Fehler beim Veröffentlichen der Bewertung');
    }
  };

  const approveBooking = async (bookingId: string) => {
    try {
      setIsLoading(true);
      await callEdge('/admin/bookings/approve', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminPassword}`,
        },
        body: JSON.stringify({ booking_id: bookingId }),
      });
      
      // Refresh dashboard data
      authenticate();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Fehler beim Genehmigen der Buchung');
    } finally {
      setIsLoading(false);
    }
  };

  const rejectBooking = async (bookingId: string) => {
    try {
      setIsLoading(true);
      await callEdge('/admin/bookings/reject', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminPassword}`,
        },
        body: JSON.stringify({ booking_id: bookingId }),
      });
      
      // Refresh dashboard data
      authenticate();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Fehler beim Ablehnen der Buchung');
    } finally {
      setIsLoading(false);
    }
  };

  const exportBookingsCSV = () => {
    if (!dashboardData?.upcomingBookings) return;

    const headers = ['Name', 'E-Mail', 'Discord', 'Datum', 'Zeit', 'Dauer (Min)', 'Status', 'Notizen'];
    const csvContent = [
      headers.join(','),
      ...dashboardData.upcomingBookings.map(booking => [
        `"${booking.name}"`,
        `"${booking.email}"`,
        `"${booking.discord_name || ''}"`,
        new Date(booking.starts_at).toLocaleDateString('de-DE'),
        new Date(booking.starts_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        booking.duration_minutes,
        `"${booking.status}"`,
        `"${booking.note || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `buchungen_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); authenticate(); }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">Admin-Passwort</Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Authentifizierung...' : 'Anmelden'}
                  </Button>

                  {error && (
                    <div className="p-3 rounded-lg text-sm bg-red-50 text-red-800 border border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800">
                      {error}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/admin/reset-slots'}
            >
              Slots zurücksetzen
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsAuthenticated(false)}
            >
              Abmelden
            </Button>
          </div>
        </div>

        {/* Pending Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Wartende Bewertungen ({dashboardData?.pendingReviews.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData?.pendingReviews.length === 0 ? (
              <p className="text-muted-foreground">Keine wartenden Bewertungen.</p>
            ) : (
              <div className="space-y-4">
                {dashboardData?.pendingReviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{review.name}</span>
                          <div className="flex">{renderStars(review.rating)}</div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Verifiziert: {new Date(review.verified_at).toLocaleDateString('de-DE')}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => publishReview(review.id)}
                      >
                        Veröffentlichen
                      </Button>
                    </div>
                    
                    {review.title && (
                      <h3 className="font-semibold">{review.title}</h3>
                    )}
                    
                    <p className="text-gray-700 dark:text-gray-300">
                      {review.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Anstehende Termine (nächste 7 Tage)</CardTitle>
              {dashboardData?.upcomingBookings && dashboardData.upcomingBookings.length > 0 && (
              <Button onClick={exportBookingsCSV} variant="outline" size="sm">
                Als CSV exportieren
              </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {dashboardData?.upcomingBookings.length === 0 ? (
              <p className="text-muted-foreground">Keine anstehenden Termine.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>E-Mail</TableHead>
                      <TableHead>Datum/Zeit</TableHead>
                      <TableHead>Dauer</TableHead>
                      <TableHead>Discord</TableHead>
                      <TableHead>Notizen</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData?.upcomingBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.name}</TableCell>
                        <TableCell>{booking.email}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(booking.starts_at).toLocaleDateString('de-DE')}</div>
                            <div className="text-muted-foreground">
                              {new Date(booking.starts_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{booking.duration_minutes} Min</TableCell>
                        <TableCell>{booking.discord_name || '-'}</TableCell>
                        <TableCell className="max-w-xs truncate" title={booking.note}>
                          {booking.note || '-'}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-sm ${
                            booking.status === 'neu' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'bestaetigt' ? 'bg-green-100 text-green-800' :
                            booking.status === 'abgelehnt' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {booking.status === 'neu' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => approveBooking(booking.id)}
                                disabled={isLoading}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Annehmen
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => rejectBooking(booking.id)}
                                disabled={isLoading}
                              >
                                Ablehnen
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;