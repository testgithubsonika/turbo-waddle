// This is the multi-step process of showing results,
//  collecting passenger data, and 
// confirming the booking.


import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import api from '../services/api';
import TrainCard from '../components/TrainCard';

const SearchResultsPage = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiServiceAvailable, setAiServiceAvailable] = useState(true);

  const getTodayValue = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  };

  const searchCriteria = useMemo(() => {
    const qp = new URLSearchParams(location.search);
    const source = qp.get('source') || qp.get('from');
    const destination = qp.get('destination') || qp.get('to');
    const date = qp.get('date') || getTodayValue();

    return {
      source,
      destination,
      date,
    };
  }, [location.search]);

  useEffect(() => {
    if (searchCriteria.source && searchCriteria.destination && searchCriteria.date) {
      setLoading(true);
      (async () => {
        try {
          const res = await api.post('/trains/search', searchCriteria);
          console.log('Search results response:', res.data);
          setResults(res.data.trains || res.data || []);
          setAiServiceAvailable(res.data.aiServiceAvailable ?? true);
          setError('');
        } catch (err) {
          const status = err.response?.status;
          if (status === 401 || status === 403) {
            setError('Please login to search trains.');
          } else {
            setError(err.response?.data?.message || 'Failed to search trains.');
          }
          setResults([]);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
      setResults([]);
    }
  }, [searchCriteria]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
        <div className="mr-2 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-700" />
        Searching best trains…
      </div>
    );
  }

  return (
    <div className="gap-page-xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-muted-foreground">
          {searchCriteria.source} → {searchCriteria.destination} on {searchCriteria.date || 'today'}
        </p>
        {results.length > 0 && (
          <p className="mt-2 text-sm text-slate-500">
            Showing {results.length} train{results.length > 1 ? 's' : ''}. Select a class and book your ticket.
          </p>
        )}
      </div>

      {!aiServiceAvailable && (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-6 py-3 text-sm text-yellow-700 flex items-center gap-2">
          <FaExclamationTriangle className="h-4 w-4" />
          Confirmation probability service is currently unavailable. Showing seat availability only.
        </div>
      )}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-600">
          {error}
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-2xl border bg-muted/30 px-6 py-8 text-center text-muted-foreground">
          No trains found for this route on the selected date.
        </div>
      ) : (
        <div className="gap-section space-y-6">
          {results.map((train) => (
            <TrainCard
              key={train.train_id ?? train.id}
              train={train}
              aiServiceAvailable={aiServiceAvailable}
              loading={loading}
              searchDate={searchCriteria.date}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;