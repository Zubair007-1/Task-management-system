import { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, Calendar, AlertCircle } from 'lucide-react';
import { useTasks, useUpdateTask } from '../../hooks/useTasks';
import { PriorityBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import TaskModal from '../../components/tasks/TaskModal';
import TaskDrawer from '../../components/tasks/TaskDrawer';
import { SkeletonKanbanCard } from '../../components/ui/Skeleton';
import { STATUS_LABEL, CHART_COLORS } from '../../utils/constants';

const COLUMNS = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

const COLUMN_COLORS = {
  TODO: CHART_COLORS.yellow,
  IN_PROGRESS: CHART_COLORS.primary,
  COMPLETED: CHART_COLORS.green,
};

export default function KanbanPage() {
  const { data: tasks = [], isLoading } = useTasks();
  const updateTask = useUpdateTask();

  const [modalOpen, setModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [drawerTask, setDrawerTask] = useState(null);

  // Group tasks by status
  const columnsData = useMemo(() => {
    const data = { TODO: [], IN_PROGRESS: [], COMPLETED: [] };
    tasks.forEach((task) => {
      const col = task.status || 'TODO';
      if (data[col]) {
        data[col].push(task);
      } else {
        data.TODO.push(task);
      }
    });
    return data;
  }, [tasks]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // If dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = parseInt(draggableId, 10);
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus = destination.droppableId;

    // Optimistically update
    await updateTask.mutateAsync({
      ...task,
      status: newStatus,
    });
  };

  const handleEdit = (task) => {
    setActiveTask(task);
    setModalOpen(true);
  };

  const handleCreateInColumn = (status) => {
    setActiveTask({ status });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Kanban Board</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Drag and drop tasks to update progress status
          </p>
        </div>
        <Button onClick={() => { setActiveTask(null); setModalOpen(true); }} icon={Plus}>
          New Task
        </Button>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto pb-4">
          {COLUMNS.map((colId) => {
            const columnTasks = columnsData[colId] || [];
            const colColor = COLUMN_COLORS[colId];

            return (
              <div key={colId} className="flex flex-col bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 max-h-full">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 shrink-0 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colColor }} />
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                      {STATUS_LABEL[colId]}
                    </h3>
                    <span className="text-xs bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400 font-medium">
                      {columnTasks.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCreateInColumn(colId)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      title="Add task to column"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Column Body / Droppable area */}
                <Droppable droppableId={colId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto space-y-3 rounded-xl p-1 transition-colors min-h-[150px] ${
                        snapshot.isDraggingOver ? 'bg-slate-100/50 dark:bg-slate-800/20' : ''
                      }`}
                    >
                      {isLoading ? (
                        Array(3)
                          .fill(0)
                          .map((_, idx) => <SkeletonKanbanCard key={idx} />)
                      ) : columnTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 dark:text-slate-600">
                          <AlertCircle className="w-8 h-8 mb-2" />
                          <span className="text-xs">No tasks</span>
                        </div>
                      ) : (
                        columnTasks.map((task, index) => (
                          <Draggable
                            key={task.id.toString()}
                            draggableId={task.id.toString()}
                            index={index}
                          >
                            {(providedDrag, snapshotDrag) => (
                              <motion.div
                                ref={providedDrag.innerRef}
                                {...providedDrag.draggableProps}
                                {...providedDrag.dragHandleProps}
                                layoutId={`task-card-${task.id}`}
                                className={`card p-4 hover:shadow-premium-md transition-shadow cursor-grab active:cursor-grabbing border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-800 ${
                                  snapshotDrag.isDragging ? 'shadow-premium-lg ring-2 ring-primary-500/20' : ''
                                }`}
                                onClick={() => setDrawerTask(task)}
                              >
                                <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-2 leading-snug line-clamp-2">
                                  {task.title}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                                  {task.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <PriorityBadge priority={task.priority} />
                                  <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-medium">No date</span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setActiveTask(null);
        }}
        task={activeTask}
      />

      <TaskDrawer
        task={drawerTask}
        open={!!drawerTask}
        onClose={() => setDrawerTask(null)}
        onEdit={handleEdit}
      />
    </div>
  );
}
