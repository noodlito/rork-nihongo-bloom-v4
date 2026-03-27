import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';

export interface StudyWord {
  word: string;
  meaning: string;
  kana?: string;
  romaji?: string;
  addedAt: number;
}

export interface GameSettings {
  language: 'english' | 'japanese';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  musicEnabled: boolean;
  soundEnabled: boolean;
  timerEnabled: boolean;
}

export interface MissedWord {
  word: string;
  meaning: string;
  reading?: string;
  mode: string;
  missedAt: number;
}

export interface GameState {
  coins: number;
  xpLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastPlayDate: string | null;
  completedPuzzles: string[];
  studyList: StudyWord[];
  missedWords: MissedWord[];
  unlockedOutfits: string[];
  currentOutfit: string;
  unlockedThemes: string[];
  currentTheme: string;
  hints: number;
  wordChecks: number;
  totalPuzzlesSolved: number;
  totalKanjiCompleted: number;
  totalTriviaCorrect: number;
  totalMiniGamesPlayed: number;
  totalMatchGamesCompleted: number;
  totalSudokuGamesCompleted: number;
  totalKanjiCorrect: number;
  dailyRewardClaimed: boolean;
  settings: GameSettings;
  isPremium: boolean;
}

const DEFAULT_STATE: GameState = {
  coins: 100,
  xpLevel: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastPlayDate: null,
  completedPuzzles: [],
  studyList: [],
  missedWords: [],
  unlockedOutfits: ['default'],
  currentOutfit: 'default',
  unlockedThemes: ['ocean'],
  currentTheme: 'ocean',
  hints: 5,
  wordChecks: 3,
  totalPuzzlesSolved: 0,
  totalKanjiCompleted: 0,
  totalTriviaCorrect: 0,
  totalMiniGamesPlayed: 0,
  totalMatchGamesCompleted: 0,
  totalSudokuGamesCompleted: 0,
  totalKanjiCorrect: 0,
  dailyRewardClaimed: false,
  settings: {
    language: 'english',
    difficulty: 'beginner',
    musicEnabled: true,
    soundEnabled: true,
    timerEnabled: false,
  },
  isPremium: false,
};

const STORAGE_KEY = 'sakura_game_state';

export const [GameProvider, useGame] = createContextHook(() => {
  const [state, setState] = useState<GameState>(DEFAULT_STATE);
  const queryClient = useQueryClient();

  const stateQuery = useQuery({
    queryKey: ['gameState'],
    queryFn: async (): Promise<GameState> => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<GameState>;
          return { ...DEFAULT_STATE, ...parsed, settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) } };
        }
      } catch (e) {
        console.log('Error loading game state:', e);
      }
      return DEFAULT_STATE;
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (stateQuery.data) {
      setState(stateQuery.data);
    }
  }, [stateQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async (newState: GameState) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['gameState'], data);
    },
  });

  const updateState = useCallback((updater: (prev: GameState) => GameState) => {
    setState(prev => {
      const next = updater(prev);
      saveMutation.mutate(next);
      return next;
    });
  }, [saveMutation]);

  const addCoins = useCallback((amount: number) => {
    updateState(prev => ({ ...prev, coins: prev.coins + amount }));
  }, [updateState]);

  const spendCoins = useCallback((amount: number): boolean => {
    let success = false;
    setState(prev => {
      if (prev.coins >= amount) {
        success = true;
        const next = { ...prev, coins: prev.coins - amount };
        saveMutation.mutate(next);
        return next;
      }
      return prev;
    });
    return success;
  }, [saveMutation]);

  const addXp = useCallback((amount: number) => {
    updateState(prev => ({ ...prev, xpLevel: prev.xpLevel + amount }));
  }, [updateState]);

  const completePuzzle = useCallback((puzzleId: string, coins: number, xp: number) => {
    const today = new Date().toISOString().split('T')[0];
    updateState(prev => {
      const isNewDay = prev.lastPlayDate !== today;
      const isConsecutive = prev.lastPlayDate === new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = isConsecutive || !prev.lastPlayDate ? prev.currentStreak + 1 : isNewDay ? 1 : prev.currentStreak;
      return {
        ...prev,
        coins: prev.coins + coins,
        xpLevel: prev.xpLevel + xp,
        completedPuzzles: prev.completedPuzzles.includes(puzzleId) ? prev.completedPuzzles : [...prev.completedPuzzles, puzzleId],
        totalPuzzlesSolved: prev.totalPuzzlesSolved + 1,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastPlayDate: today,
      };
    });
  }, [updateState]);

  const addToStudyList = useCallback((word: StudyWord) => {
    updateState(prev => {
      if (prev.studyList.some(w => w.word === word.word)) return prev;
      return { ...prev, studyList: [...prev.studyList, word] };
    });
  }, [updateState]);

  const removeFromStudyList = useCallback((word: string) => {
    updateState(prev => ({
      ...prev,
      studyList: prev.studyList.filter(w => w.word !== word),
    }));
  }, [updateState]);

  const updateSettings = useCallback((settings: Partial<GameSettings>) => {
    updateState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }));
  }, [updateState]);

  const useHint = useCallback((): boolean => {
    let success = false;
    setState(prev => {
      if (prev.hints > 0 || prev.isPremium) {
        success = true;
        const next = { ...prev, hints: prev.isPremium ? prev.hints : prev.hints - 1 };
        saveMutation.mutate(next);
        return next;
      }
      return prev;
    });
    return success;
  }, [saveMutation]);

  const useWordCheck = useCallback((): boolean => {
    let success = false;
    setState(prev => {
      if (prev.wordChecks > 0 || prev.isPremium) {
        success = true;
        const next = { ...prev, wordChecks: prev.isPremium ? prev.wordChecks : prev.wordChecks - 1 };
        saveMutation.mutate(next);
        return next;
      }
      return prev;
    });
    return success;
  }, [saveMutation]);

  const claimDailyReward = useCallback(() => {
    updateState(prev => ({
      ...prev,
      coins: prev.coins + 25,
      dailyRewardClaimed: true,
    }));
  }, [updateState]);

  const unlockOutfit = useCallback((outfitId: string) => {
    updateState(prev => ({
      ...prev,
      unlockedOutfits: [...prev.unlockedOutfits, outfitId],
    }));
  }, [updateState]);

  const setOutfit = useCallback((outfitId: string) => {
    updateState(prev => ({ ...prev, currentOutfit: outfitId }));
  }, [updateState]);

  const unlockTheme = useCallback((themeId: string) => {
    updateState(prev => ({
      ...prev,
      unlockedThemes: [...prev.unlockedThemes, themeId],
    }));
  }, [updateState]);

  const setTheme = useCallback((themeId: string) => {
    updateState(prev => ({ ...prev, currentTheme: themeId }));
  }, [updateState]);

  const addHints = useCallback((amount: number) => {
    updateState(prev => ({ ...prev, hints: prev.hints + amount }));
  }, [updateState]);

  const addWordChecks = useCallback((amount: number) => {
    updateState(prev => ({ ...prev, wordChecks: prev.wordChecks + amount }));
  }, [updateState]);

  const setPremium = useCallback((value: boolean) => {
    updateState(prev => ({ ...prev, isPremium: value }));
  }, [updateState]);

  const incrementTrivia = useCallback(() => {
    updateState(prev => ({ ...prev, totalTriviaCorrect: prev.totalTriviaCorrect + 1 }));
  }, [updateState]);

  const incrementKanji = useCallback(() => {
    updateState(prev => ({ ...prev, totalKanjiCompleted: prev.totalKanjiCompleted + 1 }));
  }, [updateState]);

  const incrementMiniGames = useCallback(() => {
    updateState(prev => ({ ...prev, totalMiniGamesPlayed: prev.totalMiniGamesPlayed + 1 }));
  }, [updateState]);

  const incrementMatchGames = useCallback(() => {
    updateState(prev => ({ ...prev, totalMatchGamesCompleted: (prev.totalMatchGamesCompleted ?? 0) + 1 }));
  }, [updateState]);

  const incrementSudokuGames = useCallback(() => {
    updateState(prev => ({ ...prev, totalSudokuGamesCompleted: (prev.totalSudokuGamesCompleted ?? 0) + 1 }));
  }, [updateState]);

  const incrementKanjiCorrect = useCallback(() => {
    updateState(prev => ({ ...prev, totalKanjiCorrect: (prev.totalKanjiCorrect ?? 0) + 1 }));
  }, [updateState]);

  const addMissedWord = useCallback((word: MissedWord) => {
    updateState(prev => {
      if (prev.missedWords.some(w => w.word === word.word && w.mode === word.mode)) return prev;
      return { ...prev, missedWords: [...prev.missedWords, word] };
    });
  }, [updateState]);

  const removeMissedWord = useCallback((word: string) => {
    updateState(prev => ({
      ...prev,
      missedWords: prev.missedWords.filter(w => w.word !== word),
    }));
  }, [updateState]);

  return {
    ...state,
    isLoading: stateQuery.isLoading,
    addCoins,
    spendCoins,
    addXp,
    completePuzzle,
    addToStudyList,
    removeFromStudyList,
    updateSettings,
    useHint,
    useWordCheck,
    claimDailyReward,
    unlockOutfit,
    setOutfit,
    unlockTheme,
    setTheme,
    addHints,
    addWordChecks,
    setPremium,
    incrementTrivia,
    incrementKanji,
    incrementMiniGames,
    incrementMatchGames,
    incrementSudokuGames,
    incrementKanjiCorrect,
    addMissedWord,
    removeMissedWord,
  };
});
