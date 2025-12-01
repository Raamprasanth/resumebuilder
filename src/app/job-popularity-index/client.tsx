'use client';

import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const popularVacancies = [
  { title: 'Anesthesiologists', openings: 45904, domain: 'Medical' },
  { title: 'Surgeons', openings: 50364, domain: 'Medical' },
  { title: 'Obstetricians-Gynecologists', openings: 4339, domain: 'Medical' },
  { title: 'Orthodontists', openings: 20079, domain: 'Medical' },
  { title: 'Maxillofacial Surgeons', openings: 74875, domain: 'Medical' },
  { title: 'Software Developer', openings: 43359, domain: 'Tech' },
  { title: 'Psychiatrists', openings: 18599, domain: 'Medical' },
  { title: 'Data Scientist', openings: 28200, domain: 'Tech' },
  { title: 'Financial Manager', openings: 61391, domain: 'Finance' },
  { title: 'Management Analysis', openings: 93046, domain: 'Business' },
  { title: 'IT Manager', openings: 50963, domain: 'Tech' },
  { title: 'Operations Research Analysis', openings: 16627, domain: 'Business' },
];

type SortKey = 'title' | 'openings' | 'domain';
type SortDirection = 'asc' | 'desc';

export function JobPopularityIndexClient() {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'openings', direction: 'desc' });

  const sortedData = useMemo(() => {
    const data = [...popularVacancies];
    data.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return data;
  }, [sortConfig]);
  
  const chartData = useMemo(() => {
    return [...sortedData].sort((a,b) => b.openings - a.openings).slice(0, 10);
  }, [sortedData]);


  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    }
    return sortConfig.direction === 'desc' ? '▼' : '▲';
  };

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Job Popularity Index</CardTitle>
          <CardDescription>An overview of the most in-demand job vacancies.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" angle={-45} textAnchor="end" height={100} interval={0} tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tickFormatter={(value) => new Intl.NumberFormat('en-US').format(value as number)} />
              <Tooltip formatter={(value) => new Intl.NumberFormat('en-US').format(value as number)} />
              <Legend />
              <Bar dataKey="openings" fill="hsl(var(--primary))" name="Open Positions" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Vacancies</CardTitle>
           <CardDescription>A complete list of all tracked job vacancies.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('title')}>
                    Job Title {getSortIcon('title')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('domain')}>
                    Domain {getSortIcon('domain')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => requestSort('openings')}>
                    Open Positions {getSortIcon('openings')}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((job) => (
                <TableRow key={job.title}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.domain}</TableCell>
                  <TableCell className="text-right">{job.openings.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
