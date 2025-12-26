import { useState, useMemo, useCallback } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialItemsPerPage?: number;
  transitionDuration?: number;
}

interface UsePaginationResult<T> {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  paginatedItems: T[];
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  isFirstPage: boolean;
  isLastPage: boolean;
  startIndex: number;
  endIndex: number;
  isTransitioning: boolean;
}

export function usePagination<T>(
  items: T[] | undefined | null,
  options: UsePaginationOptions = {}
): UsePaginationResult<T> {
  const { initialPage = 1, initialItemsPerPage = 10, transitionDuration = 300 } = options;
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalItems = items?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Reset to page 1 if current page is out of bounds
  const validCurrentPage = useMemo(() => {
    if (currentPage > totalPages) return 1;
    if (currentPage < 1) return 1;
    return currentPage;
  }, [currentPage, totalPages]);

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const paginatedItems = useMemo(() => {
    if (!items) return [];
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  const handleSetCurrentPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    if (validPage === currentPage) return;
    
    setIsTransitioning(true);
    setCurrentPage(validPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);
  }, [totalPages, currentPage, transitionDuration]);

  const handleSetItemsPerPage = useCallback((items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing items per page
  }, []);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    if (validCurrentPage < totalPages) {
      setCurrentPage(validCurrentPage + 1);
    }
  }, [validCurrentPage, totalPages]);

  const goToPreviousPage = useCallback(() => {
    if (validCurrentPage > 1) {
      setCurrentPage(validCurrentPage - 1);
    }
  }, [validCurrentPage]);

  return {
    currentPage: validCurrentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    paginatedItems,
    setCurrentPage: handleSetCurrentPage,
    setItemsPerPage: handleSetItemsPerPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    isFirstPage: validCurrentPage === 1,
    isLastPage: validCurrentPage === totalPages,
    startIndex: startIndex + 1, // 1-indexed for display
    endIndex,
    isTransitioning,
  };
}
