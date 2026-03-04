'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskImportance, TaskStatus } from '@/types';

interface TaskContextType {
    tasks: Task[];
    activeTasks: Task[];
    pitLaneTasks: Task[];
    isLoading: boolean;
    isRacing: boolean;
    winner: Task | null;
    addTask: (name: string, color: string, importance: TaskImportance) => Promise<void>;
    updateTaskStatus: (id: number, status: TaskStatus, pitLaneRacesLeft?: number) => Promise<void>;
    deleteTask: (id: number) => Promise<void>;
    startRace: () => void;
    completeWinner: () => void;
    dismissWinner: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRacing, setIsRacing] = useState(false);
    const [winner, setWinner] = useState<Task | null>(null);

    const SPEED_MULTIPLIER: Record<string, number> = {
        High: 10,
        Medium: 3,
        Low: 1
    };

    // Fetch tasks on mount
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/tasks');
            const data = await res.json();
            if (data.tasks) {
                setTasks(data.tasks);
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addTask = async (name: string, color: string, importance: TaskImportance) => {
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, color, importance }),
            });
            const data = await res.json();
            if (data.task) {
                setTasks(prev => [...prev, data.task]);
            }
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    };

    const updateTaskStatus = async (id: number, status: TaskStatus, pitLaneRacesLeft?: number) => {
        try {
            const res = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, pit_lane_races_left: pitLaneRacesLeft }),
            });
            const data = await res.json();
            if (data.task) {
                setTasks(prev => prev.map(t => t.id === id ? data.task : t));
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const deleteTask = async (id: number) => {
        try {
            await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
            setTasks(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const activeTasks = tasks.filter(t => t.status === 'Active');
    const pitLaneTasks = tasks.filter(t => t.status === 'PitLane');

    const pickWinner = (tasksParam: Task[]): Task | null => {
        if (tasksParam.length === 0) return null;
        let totalWeight = 0;
        const weightedTasks = tasksParam.map(t => {
            const w = SPEED_MULTIPLIER[t.importance] || 1;
            totalWeight += w;
            return { task: t, weight: w };
        });

        let rand = Math.random() * totalWeight;
        for (const item of weightedTasks) {
            if (rand < item.weight) return item.task;
            rand -= item.weight;
        }
        return tasksParam[tasksParam.length - 1];
    };

    const startRace = () => {
        if (activeTasks.length === 0 || isRacing) return;

        setIsRacing(true);
        setWinner(null);

        // Pick winner immediately, but wait 5 seconds to show it (Sprint effect)
        setTimeout(() => {
            const w = pickWinner(activeTasks);
            setWinner(w);
            setIsRacing(false);

            // Decrement Pit Lane
            pitLaneTasks.forEach(pt => {
                if (pt.pit_lane_races_left > 1) {
                    updateTaskStatus(pt.id, 'PitLane', pt.pit_lane_races_left - 1);
                } else {
                    updateTaskStatus(pt.id, 'Active', 0);
                }
            });
        }, 5000);
    };

    const completeWinner = () => {
        if (winner) {
            updateTaskStatus(winner.id, 'Completed');
            setWinner(null);
        }
    };

    const dismissWinner = () => {
        if (winner) {
            updateTaskStatus(winner.id, 'PitLane', 3);
            setWinner(null);
        }
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                activeTasks,
                pitLaneTasks,
                isLoading,
                isRacing,
                winner,
                addTask,
                updateTaskStatus,
                deleteTask,
                startRace,
                completeWinner,
                dismissWinner,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
}
