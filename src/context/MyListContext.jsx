import { createContext, useContext, useState, useEffect } from 'react';

const MyListContext = createContext(null);

export const MyListProvider = ({ children }) => {
  const [myList, setMyList] = useState(() => {
    try {
      const saved = localStorage.getItem('moviekoto_mylist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('moviekoto_mylist', JSON.stringify(myList));
  }, [myList]);

  const addToList = (show) => {
    setMyList((prev) => {
      if (prev.find((s) => s.id === show.id)) return prev;
      return [show, ...prev];
    });
  };

  const removeFromList = (id) => {
    setMyList((prev) => prev.filter((s) => s.id !== id));
  };

  const isInList = (id) => myList.some((s) => s.id === id);

  return (
    <MyListContext.Provider value={{ myList, addToList, removeFromList, isInList }}>
      {children}
    </MyListContext.Provider>
  );
};

export const useMyList = () => {
  const ctx = useContext(MyListContext);
  if (!ctx) throw new Error('useMyList must be used inside MyListProvider');
  return ctx;
};
