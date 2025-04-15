'use client';

import {useState} from 'react';
import {getNumberMeanings} from '@/ai/flows/get-number-meanings';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Loader2} from 'lucide-react';

export default function Home() {
  const [number, setNumber] = useState<number | null>(null);
  const [meanings, setMeanings] = useState<
    {
      culture: string;
      meaning: string;
      funFact?: string;
    }[] | null
  >(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setNumber(value);
    } else {
      setNumber(null);
      setMeanings(null); // Clear previous meanings if input is invalid
    }
  };

  const fetchMeanings = async () => {
    if (number === null) {
      alert('Please enter a valid number.');
      return;
    }

    setLoading(true);
    setMeanings(null); // Clear previous meanings while loading

    try {
      const result = await getNumberMeanings({number: number});
      setMeanings(result.meanings);
    } catch (error) {
      console.error('Error fetching meanings:', error);
      alert('Failed to fetch meanings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-background">
      <h1 className="text-4xl font-bold mb-4 text-foreground">Numberlore</h1>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
        <Input
          type="number"
          placeholder="Enter a number"
          className="w-full md:w-64 bg-input text-foreground"
          onChange={handleInputChange}
        />
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/80"
          onClick={fetchMeanings}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            'Get Meanings'
          )}
        </Button>
      </div>

      {meanings && meanings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
          {meanings.map((meaning, index) => (
            <Card key={index} className="bg-card text-card-foreground shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{meaning.culture}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Meaning in {meaning.culture} culture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-base text-foreground">{meaning.meaning}</p>
                {meaning.funFact && (
                  <p className="text-sm mt-2 text-accent">Fun Fact: {meaning.funFact}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        !loading && number !== null && (
          <p className="text-lg text-muted-foreground">No meanings found for this number.</p>
        )
      )}
    </div>
  );
}
