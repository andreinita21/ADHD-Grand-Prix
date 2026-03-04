'use client';

import { useState } from 'react';
import { useTasks } from '@/context/TaskContext';
import { TaskImportance } from '@/types';

const IMPORTANCE_COLORS: Record<TaskImportance, string> = {
    High: '#ef4444',   // Red
    Medium: '#eab308', // Yellow
    Low: '#22c55e',    // Green
};

const PREDEFINED_COLORS = [
    '#ef4444', // Red
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#3b82f6', // Blue
    '#a855f7', // Purple
    '#ec4899', // Pink
    '#ffffff', // White
];

export default function Paddock() {
    const { activeTasks, pitLaneTasks, addTask, updateTaskStatus, deleteTask, isLoading } = useTasks();

    const [name, setName] = useState('');
    const [importance, setImportance] = useState<TaskImportance>('Medium');
    const [color, setColor] = useState(IMPORTANCE_COLORS['Medium']);
    const [customColors, setCustomColors] = useState<string[]>([]);

    const handleImportanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newImportance = e.target.value as TaskImportance;
        setImportance(newImportance);
        setColor(IMPORTANCE_COLORS[newImportance]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        addTask(name.trim(), color, importance);
        setName('');
    };

    const handleAddCustomColor = () => {
        if (!PREDEFINED_COLORS.includes(color) && !customColors.includes(color)) {
            setCustomColors(prev => [...prev, color]);
        }
    };

    const handleRemoveCustomColor = (e: React.MouseEvent, colorToRemove: string) => {
        e.stopPropagation();
        setCustomColors(prev => prev.filter(c => c !== colorToRemove));
        if (color === colorToRemove) {
            setColor(IMPORTANCE_COLORS[importance]);
        }
    };

    const handleDismissToPit = (id: number) => {
        updateTaskStatus(id, 'PitLane', 3);
    };

    if (isLoading) {
        return <div className="p-4 text-slate-400">Loading Paddock...</div>;
    }

    return (
        <div className="flex flex-col gap-8 pb-4">

            {/* Create Task Form */}
            <section className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <h2 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    New Track Entry
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Driver / Task Name (e.g. Pay Internet Bill)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="px-4 py-3 bg-slate-950/50 border border-slate-700/80 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 shadow-inner"
                        required
                    />
                    <div className="flex gap-4">
                        <select
                            value={importance}
                            onChange={handleImportanceChange}
                            className="flex-1 px-4 py-3 bg-slate-950/50 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner appearance-none cursor-pointer"
                        >
                            <option value="High">🔴 High Priority (Fast)</option>
                            <option value="Medium">🟡 Medium Priority (Base)</option>
                            <option value="Low">🟢 Low Priority (Slow)</option>
                        </select>
                    </div>

                    {/* Color Selection */}
                    <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-700/80 shadow-inner">
                        <div className="text-xs text-slate-400 font-medium px-1">Livery:</div>
                        <div className="flex flex-wrap gap-2 items-center flex-1">
                            {PREDEFINED_COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    style={{ backgroundColor: c }}
                                    className={`w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'border border-slate-700'}`}
                                    title={`Select color ${c}`}
                                />
                            ))}
                            {customColors.length > 0 && (
                                <>
                                    <div className="h-4 w-px bg-slate-700 mx-1"></div>
                                    {customColors.map(c => (
                                        <button
                                            key={`custom-${c}`}
                                            type="button"
                                            onClick={() => setColor(c)}
                                            style={{ backgroundColor: c }}
                                            className={`group w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'border border-slate-700'} relative flex items-center justify-center`}
                                            title={`Use custom color ${c}`}
                                        >
                                            <span
                                                onClick={(e) => handleRemoveCustomColor(e, c)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-400 border border-slate-900 shadow-sm"
                                                title="Remove Color"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                            </span>
                                        </button>
                                    ))}
                                </>
                            )}
                        </div>
                        <div className="h-6 w-px bg-slate-700 mx-1"></div>
                        <div className="flex flex-col items-center gap-1">
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="h-8 w-10 cursor-pointer bg-transparent border-0 p-0 shrink-0 rounded"
                                title="Custom Color Picker"
                            />
                            {!PREDEFINED_COLORS.includes(color) && !customColors.includes(color) && (
                                <button
                                    type="button"
                                    onClick={handleAddCustomColor}
                                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-1 py-0.5 rounded border border-slate-700 transition-colors uppercase tracking-wider font-bold"
                                    title="Save to Palette"
                                >
                                    Save
                                </button>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold tracking-wide uppercase text-xs rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
                    >
                        Deploy to Circuit
                    </button>
                </form>
            </section>

            {/* Active Tasks Grid */}
            <section className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <h2 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></span>
                        Starting Grid
                    </div>
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700">{activeTasks.length} Cars</span>
                </h2>

                <div className="flex flex-col gap-3 relative z-10">
                    {activeTasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-slate-700/50 rounded-xl bg-slate-800/20">
                            <p className="text-sm text-slate-500 italic">Grid is empty.</p>
                            <p className="text-xs text-slate-600 mt-1">Deploy tasks from above.</p>
                        </div>
                    )}
                    {activeTasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between bg-slate-800/40 hover:bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 group transition-all shadow-sm relative overflow-hidden">
                            <div className="absolute inset-y-0 left-0 w-1 shadow-[0_0_10px_currentColor]" style={{ backgroundColor: task.color, color: task.color }}></div>
                            <div className="flex items-center gap-4 pl-3">
                                <div className="w-6 h-6 rounded-md shadow-inner flex items-center justify-center border border-white/10" style={{ backgroundColor: task.color }}>
                                    <svg className="w-4 h-4 text-white/80 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-bold text-slate-200 tracking-wide">{task.name}</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                                        {task.importance === 'High' && <span className="text-red-400">🔴 Fast</span>}
                                        {task.importance === 'Medium' && <span className="text-yellow-400">🟡 Base</span>}
                                        {task.importance === 'Low' && <span className="text-green-400">🟢 Slow</span>}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                                <button
                                    onClick={() => handleDismissToPit(task.id)}
                                    title="Box Box (To Pit Lane)"
                                    className="p-2 text-slate-400 hover:text-orange-400 hover:bg-orange-400/10 rounded-lg transition-colors border border-transparent hover:border-orange-500/20 font-bold text-xs uppercase tracking-wider flex items-center gap-1"
                                >
                                    <span>BOX</span>
                                </button>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    title="Retire Car"
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pit Lane */}
            <section className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 shadow-lg relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <h2 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]"></span>
                        Pit Lane / Penalty
                    </div>
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700">{pitLaneTasks.length} Cars</span>
                </h2>
                <div className="flex flex-col gap-2 relative z-10">
                    {pitLaneTasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-4 text-center border border-dashed border-slate-700/30 rounded-xl bg-slate-800/10">
                            <p className="text-sm text-slate-500 italic">Pit lane is clear.</p>
                        </div>
                    )}
                    {pitLaneTasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between bg-slate-950/50 border border-slate-700/50 p-3 rounded-xl opacity-80 hover:opacity-100 transition-opacity group">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                                <p className="text-sm text-slate-400 line-through decoration-slate-600/50">{task.name}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                                    <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest">
                                        Wait {task.pit_lane_races_left}
                                    </span>
                                </div>
                                <button
                                    onClick={() => updateTaskStatus(task.id, 'Active', 0)}
                                    title="Release to Grid Early"
                                    className="p-1.5 text-slate-500 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors border border-transparent hover:border-green-500/20"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
