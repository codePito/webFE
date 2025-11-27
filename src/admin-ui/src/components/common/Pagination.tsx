import React, { Fragment } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
export function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) {
  const pages = Array.from({
    length: totalPages
  }, (_, i) => i + 1);
  const visiblePages = pages.filter(page => {
    if (totalPages <= 7) return true;
    if (page === 1 || page === totalPages) return true;
    if (page >= currentPage - 1 && page <= currentPage + 1) return true;
    return false;
  });
  return <div className="flex items-center justify-center gap-2 mt-6">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        <ChevronLeft className="w-5 h-5" />
      </button>

      {visiblePages.map((page, index) => {
      const prevPage = visiblePages[index - 1];
      const showEllipsis = prevPage && page - prevPage > 1;
      return <Fragment key={page}>
            {showEllipsis && <span className="px-2 text-gray-400">...</span>}
            <button onClick={() => onPageChange(page)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === currentPage ? 'bg-primary-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
              {page}
            </button>
          </Fragment>;
    })}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>;
}