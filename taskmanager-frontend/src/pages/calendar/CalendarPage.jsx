import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Calendar, Plus, Clock,
} from 'lucide-react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isSameDay,
  addMonths, subMonths, isToday, addWeeks, subWeeks,
  addDays, subDays, startOfDay, endOfDay,
} from 'date-fns';
import { useTasks } from '../../hooks/useTasks';
import { PriorityBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import TaskModal from '../../components/tasks/TaskModal';
import TaskDrawer from '../../components/tasks/TaskDrawer';
import { CHART_COLORS } from '../../utils/constants';

const VIEWS = { MONTH: 'MONTH', WEEK: 'WEEK', DAY: 'DAY' };

export default function CalendarPage() {
  const { data: tasks = [], isLoading } = useTasks();
  const [view, setView] = useState(VIEWS.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [drawerTask, setDrawerTask] = useState(null);

  // Generate consistent fake due dates for task display in calendar
  // e.g. task with id 1 is due today, id 2 tomorrow, etc.
  const calendarTasks = useMemo(() => {
    return tasks.map((task, index) => {
      let dueDate;
      if (index === 0) {
        dueDate = new Date();
      } else if (index === 1) {
        dueDate = addDays(new Date(), 1);
      } else if (index === 2) {
        dueDate = subDays(new Date(), 1);
      } else if (index === 3) {
        dueDate = addDays(new Date(), 4);
      } else {
        dueDate = addDays(startOfMonth(new Date()), (index * 3) % 28);
      }
      return { ...task, dueDate };
    });
  }, [tasks]);

  const handlePrev = () => {
    if (view === VIEWS.MONTH) setCurrentDate(subMonths(currentDate, 1));
    else if (view === VIEWS.WEEK) setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (view === VIEWS.MONTH) setCurrentDate(addMonths(currentDate, 1));
    else if (view === VIEWS.WEEK) setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date) => {
    setActiveTask({ dueDate: date });
    setModalOpen(true);
  };

  // Month View Days
  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  // Week View Days
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(weekStart);
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate]);

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-100px)] animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Calendar</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Visualize your schedules and project deadlines
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggles */}
          <div className="bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl flex">
            {Object.values(VIEWS).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  view === v
                    ? 'bg-white dark:bg-slate-700 text-slate-850 dark:text-slate-100 shadow-premium'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {v.charAt(0) + v.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <Button onClick={() => { setActiveTask(null); setModalOpen(true); }} icon={Plus}>
            New Task
          </Button>
        </div>
      </div>

      {/* Control bar */}
      <div className="card p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <h2 className="font-semibold text-lg text-slate-800 dark:text-slate-100 min-w-[150px] text-center">
            {view === VIEWS.MONTH && format(currentDate, 'MMMM yyyy')}
            {view === VIEWS.WEEK && `Week of ${format(startOfWeek(currentDate), 'MMM d, yyyy')}`}
            {view === VIEWS.DAY && format(currentDate, 'MMMM d, yyyy')}
          </h2>
          <button
            onClick={handleNext}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
        <Button variant="outline" size="sm" onClick={handleToday}>
          Today
        </Button>
      </div>

      {/* Main Calendar Body */}
      <div className="flex-1 min-h-0 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex flex-col overflow-hidden shadow-premium">
        {/* Month View */}
        {view === VIEWS.MONTH && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Weekdays */}
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-700/50 text-center py-2.5 bg-slate-50 dark:bg-slate-900/10 shrink-0">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {d}
                </div>
              ))}
            </div>
            {/* Days grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-6 min-h-0">
              {monthDays.map((date, idx) => {
                const dayTasks = calendarTasks.filter((t) => isSameDay(t.dueDate, date));
                const isCurrentMonth = isSameMonth(date, currentDate);
                const isTodayDate = isToday(date);

                return (
                  <div
                    key={idx}
                    onClick={() => handleDateClick(date)}
                    className={`border-r border-b border-slate-100 dark:border-slate-750/50 p-2 flex flex-col min-h-0 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 cursor-pointer transition-colors relative group`}
                  >
                    <div className="flex justify-between items-center mb-1 shrink-0">
                      <span
                        className={`text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center ${
                          isTodayDate
                            ? 'bg-primary-600 text-white shadow-premium'
                            : isCurrentMonth
                            ? 'text-slate-800 dark:text-slate-200'
                            : 'text-slate-400 dark:text-slate-600'
                        }`}
                      >
                        {format(date, 'd')}
                      </span>
                    </div>

                    {/* Task deadlines indicators */}
                    <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin">
                      {dayTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDrawerTask(task);
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-medium leading-snug border transition-shadow shadow-sm hover:shadow truncate ${
                            task.status === 'COMPLETED'
                              ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 text-green-700 dark:text-green-300 line-through'
                              : 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300'
                          }`}
                        >
                          {task.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Week View */}
        {view === VIEWS.WEEK && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-700/50 text-center py-3 bg-slate-50 dark:bg-slate-900/10 shrink-0">
              {weekDays.map((date) => (
                <div key={date.toString()} className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {format(date, 'EEE')}
                  </p>
                  <p
                    className={`mx-auto text-sm font-semibold rounded-full w-7 h-7 flex items-center justify-center ${
                      isToday(date) ? 'bg-primary-600 text-white shadow-premium' : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {format(date, 'd')}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-700/50 min-h-0">
              {weekDays.map((date) => {
                const dayTasks = calendarTasks.filter((t) => isSameDay(t.dueDate, date));

                return (
                  <div
                    key={date.toString()}
                    onClick={() => handleDateClick(date)}
                    className="p-3 space-y-2 overflow-y-auto cursor-pointer hover:bg-slate-50/40 dark:hover:bg-slate-700/10 transition-colors"
                  >
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDrawerTask(task);
                        }}
                        className="card p-3 space-y-2 border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-800 hover:shadow-premium transition-shadow"
                      >
                        <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-100 truncate">
                          {task.title}
                        </h4>
                        <div className="flex items-center justify-between">
                          <PriorityBadge priority={task.priority} />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Day View */}
        {view === VIEWS.DAY && (
          <div className="flex-1 flex flex-col overflow-y-auto p-6 cursor-pointer" onClick={() => handleDateClick(currentDate)}>
            <div className="max-w-2xl mx-auto w-full space-y-4">
              <div className="flex items-center gap-2 text-slate-500 mb-6 shrink-0">
                <Clock className="w-5 h-5 text-primary-500" />
                <span className="text-sm font-semibold">Today's Deadlines & Schedule</span>
              </div>
              
              {calendarTasks.filter((t) => isSameDay(t.dueDate, currentDate)).length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No tasks scheduled for this day</p>
                  <Button size="sm" variant="outline" className="mt-4" onClick={(e) => { e.stopPropagation(); handleDateClick(currentDate); }}>
                    Add Task
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {calendarTasks
                    .filter((t) => isSameDay(t.dueDate, currentDate))
                    .map((task) => (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDrawerTask(task);
                        }}
                        className="card p-4 hover:shadow-premium-md transition-shadow flex items-center justify-between gap-4 cursor-pointer bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800/85"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-slate-855 dark:text-slate-100 truncate">
                            {task.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                            {task.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <PriorityBadge priority={task.priority} />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

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
        onEdit={() => {}}
      />
    </div>
  );
}
