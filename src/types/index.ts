export type TaskImportance = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Active' | 'PitLane' | 'Completed';

export interface Task {
    id: number;
    name: string;
    color: string;
    importance: TaskImportance;
    status: TaskStatus;
    pit_lane_races_left: number;
}
