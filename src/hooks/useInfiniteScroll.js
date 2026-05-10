import { useState, useEffect, useRef, useCallback } from 'react';

export const useInfiniteScroll = (items, pages, loading) => {
  const [allItems, setAllItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // Reset when items change (new filter applied)
  useEffect(() => {
    if (currentPage === 1) {
      setAllItems(items);
    } else {
      // Append new items
      setAllItems((prev) => {
        const newItems = items.filter(item => !prev.some(p => p._id === item._id));
        return [...prev, ...newItems];
      });
    }
    setHasMore(currentPage < pages);
  }, [items, currentPage, pages]);

  // Intersection observer callback
  const lastItemRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setCurrentPage((prev) => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const reset = () => {
    setAllItems([]);
    setCurrentPage(1);
    setHasMore(true);
  };

  return { allItems, currentPage, hasMore, lastItemRef, reset };
};
