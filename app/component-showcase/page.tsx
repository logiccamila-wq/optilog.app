'use client';

import { useState } from 'react';
import { Inbox, RefreshCw } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function ComponentShowcasePage() {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          UI Components Showcase
        </h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            EmptyState Component
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
                Basic Example
              </h3>
              <EmptyState 
                title="No items found"
                description="Start by adding your first item"
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
                With Icon
              </h3>
              <EmptyState 
                icon={<Inbox size={48} />}
                title="No messages"
                description="Your inbox is empty"
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            SkeletonLoader Component
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
                Table Variant
              </h3>
              <SkeletonLoader variant="table" rows={3} />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
                Card Variant
              </h3>
              <SkeletonLoader variant="card" rows={2} />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            ConfirmDialog Component
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <button
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Show Danger Dialog
            </button>

            <ConfirmDialog
              open={showConfirm}
              title="Delete Item"
              message="Are you sure you want to delete this item?"
              confirmText="Delete"
              cancelText="Cancel"
              variant="danger"
              onConfirm={() => {
                alert('Item deleted!');
                setShowConfirm(false);
              }}
              onCancel={() => setShowConfirm(false)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
