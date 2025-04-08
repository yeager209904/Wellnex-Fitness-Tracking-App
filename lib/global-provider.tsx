import React, { createContext, useContext, ReactNode, useState } from "react";
import { getCurrentUser, logout as appwriteLogout } from "./appwrite";
import { useAppwrite } from "./useAppwrite";

// Define the User interface
export interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

// Define the Exercise interface
export interface Exercise {
  name: string;
  sets: number;
  reps: number;
}

// Define the Routine interface
export interface Routine {
  id: string;
  name: string;
  exercises: Exercise[];
}

// Define the Workout interface
export interface Workout {
  id: string;
  routineId: string;
  date: string;
  completedExercises: Exercise[];
}

// Define the GlobalContextType interface
interface GlobalContextType {
  isLogged: boolean;
  user: User | null;
  loading: boolean;
  refetch: () => void;
  logout: () => Promise<void>;
  
  // Routines
  routines: Routine[];
  setRoutines: React.Dispatch<React.SetStateAction<Routine[]>>;
  addRoutine: (routine: Routine) => void;
  updateRoutine: (id: string, updatedRoutine: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  routinesLoading: boolean;
  routinesError: string | null;

  // Workouts
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;

  // Additional State (acc)
  acc: number;
  setAcc: React.Dispatch<React.SetStateAction<number>>;
}

// Create the GlobalContext
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Define the GlobalProviderProps interface
interface GlobalProviderProps {
  children: ReactNode;
}

// GlobalProvider component
export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const {
    data: user,
    loading,
    refetch,
  } = useAppwrite({
    fn: getCurrentUser,
  });

  const isLogged = !!user;

  // State for routines
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [routinesLoading, setRoutinesLoading] = useState(false);
  const [routinesError, setRoutinesError] = useState<string | null>(null);

  // State for workouts
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  // State for acc (assuming it's a number)
  const [acc, setAcc] = useState<number>(0);

  // Logout function
  const logout = async () => {
    try {
      await appwriteLogout();
      setTimeout(() => refetch(), 100);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Add a new routine
  const addRoutine = (routine: Routine) => {
    setRoutinesLoading(true);
    setRoutinesError(null);

    try {
      setRoutines((prevRoutines) => [...prevRoutines, routine]);
    } catch (error) {
      setRoutinesError("Failed to add routine.");
      console.error("Error adding routine:", error);
    } finally {
      setRoutinesLoading(false);
    }
  };

  // Update an existing routine
  const updateRoutine = (id: string, updatedRoutine: Partial<Routine>) => {
    setRoutinesLoading(true);
    setRoutinesError(null);

    try {
      setRoutines((prevRoutines) =>
        prevRoutines.map((routine) =>
          routine.id === id ? { ...routine, ...updatedRoutine } : routine
        )
      );
    } catch (error) {
      setRoutinesError("Failed to update routine.");
      console.error("Error updating routine:", error);
    } finally {
      setRoutinesLoading(false);
    }
  };

  // Delete a routine
  const deleteRoutine = (id: string) => {
    setRoutinesLoading(true);
    setRoutinesError(null);

    try {
      setRoutines((prevRoutines) =>
        prevRoutines.filter((routine) => routine.id !== id)
      );
    } catch (error) {
      setRoutinesError("Failed to delete routine.");
      console.error("Error deleting routine:", error);
    } finally {
      setRoutinesLoading(false);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        user,
        loading,
        refetch,
        logout,
        routines,
        setRoutines,
        addRoutine,
        updateRoutine,
        deleteRoutine,
        routinesLoading,
        routinesError,
        workouts,
        setWorkouts,
        acc,
        setAcc,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use the global context
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");

  return context;
};

export default GlobalProvider;