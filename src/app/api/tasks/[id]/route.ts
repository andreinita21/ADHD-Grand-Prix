import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const { status, pit_lane_races_left } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Missing task ID' }, { status: 400 });
        }

        // Prepare update parameters
        const updates = [];
        const values = [];

        if (status !== undefined) {
            updates.push('status = ?');
            values.push(status);
        }

        if (pit_lane_races_left !== undefined) {
            updates.push('pit_lane_races_left = ?');
            values.push(pit_lane_races_left);
        }

        if (updates.length > 0) {
            const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
            values.push(id);

            const stmt = db.prepare(sql);
            stmt.run(...values);
        }

        const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

        if (!updatedTask) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json({ task: updatedTask });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;

        if (!id) {
            return NextResponse.json({ error: 'Missing task ID' }, { status: 400 });
        }

        const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
        const result = stmt.run(id);

        if (result.changes === 0) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
    }
}
