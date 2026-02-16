import React from 'react';
import { Card } from '@/components/ui/card';

export const PageSkeleton = () => (
  <div className="min-h-screen elvt-gradient">
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="h-12 w-64 bg-gray-700/20 rounded-lg mb-8 animate-pulse" />
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="elvt-glass p-6 animate-pulse">
            <div className="h-8 bg-gray-700/20 rounded mb-4" />
            <div className="h-4 bg-gray-700/20 rounded w-2/3" />
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export const GridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(count)].map((_, i) => (
      <Card key={i} className="elvt-glass p-4 md:p-6 animate-pulse">
        <div className="aspect-video bg-gray-700/20 rounded-lg mb-4" />
        <div className="h-6 bg-gray-700/20 rounded mb-3" />
        <div className="h-4 bg-gray-700/20 rounded w-3/4" />
      </Card>
    ))}
  </div>
);

export const ListSkeleton = ({ count = 5 }) => (
  <div className="space-y-3">
    {[...Array(count)].map((_, i) => (
      <Card key={i} className="elvt-glass p-4 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-700/20 rounded-lg flex-shrink-0" />
          <div className="flex-1">
            <div className="h-5 bg-gray-700/20 rounded mb-2" />
            <div className="h-3 bg-gray-700/20 rounded w-2/3" />
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export const CardSkeleton = () => (
  <Card className="elvt-glass p-6 animate-pulse">
    <div className="h-8 bg-gray-700/20 rounded mb-4" />
    <div className="space-y-2">
      <div className="h-4 bg-gray-700/20 rounded" />
      <div className="h-4 bg-gray-700/20 rounded w-5/6" />
      <div className="h-4 bg-gray-700/20 rounded w-4/6" />
    </div>
  </Card>
);