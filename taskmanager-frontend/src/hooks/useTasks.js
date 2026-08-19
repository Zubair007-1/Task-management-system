import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

export const TASK_KEYS = {
  all:       ['tasks'],
  lists:     () => [...TASK_KEYS.all, 'list'],
  detail:    (id) => [...TASK_KEYS.all, 'detail', id],
  paged:     (page, size) => [...TASK_KEYS.all, 'paged', page, size],
  search:    (kw) => [...TASK_KEYS.all, 'search', kw],
  byStatus:  (s) => [...TASK_KEYS.all, 'status', s],
  dashboard: ['dashboard'],
};

/** Fetch ALL tasks */
export function useTasks() {
  return useQuery({
    queryKey: TASK_KEYS.lists(),
    queryFn:  taskService.getAll,
    staleTime: 30_000,
  });
}

/** Fetch a single task */
export function useTask(id) {
  return useQuery({
    queryKey: TASK_KEYS.detail(id),
    queryFn:  () => taskService.getById(id),
    enabled:  !!id,
  });
}

/** Paginated tasks */
export function usePagedTasks(page = 0, size = 10) {
  return useQuery({
    queryKey: TASK_KEYS.paged(page, size),
    queryFn:  () => taskService.getPaged(page, size),
    staleTime: 20_000,
  });
}

/** Search tasks */
export function useSearchTasks(keyword) {
  return useQuery({
    queryKey: TASK_KEYS.search(keyword),
    queryFn:  () => taskService.search(keyword),
    enabled:  !!keyword && keyword.length > 1,
    staleTime: 10_000,
  });
}

/** Dashboard stats (ADMIN) */
export function useDashboard() {
  return useQuery({
    queryKey: TASK_KEYS.dashboard,
    queryFn:  taskService.getDashboard,
    staleTime: 60_000,
    retry: false,
  });
}

/** Create task mutation */
export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TASK_KEYS.all });
      toast.success('Task created successfully!');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to create task');
    },
  });
}

/** Update task mutation */
export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => taskService.update(id, payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: TASK_KEYS.all });
      qc.invalidateQueries({ queryKey: TASK_KEYS.detail(vars.id) });
      toast.success('Task updated!');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update task');
    },
  });
}

/** Delete task mutation */
export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TASK_KEYS.all });
      toast.success('Task deleted.');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to delete task');
    },
  });
}

/** Bulk delete */
export function useBulkDelete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskService.bulkDelete,
    onSuccess: (_, ids) => {
      qc.invalidateQueries({ queryKey: TASK_KEYS.all });
      toast.success(`${ids.length} task(s) deleted.`);
    },
    onError: () => toast.error('Bulk delete failed'),
  });
}

/** Bulk complete */
export function useBulkComplete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, tasks }) => taskService.bulkComplete(ids, tasks),
    onSuccess: (_, { ids }) => {
      qc.invalidateQueries({ queryKey: TASK_KEYS.all });
      toast.success(`${ids.length} task(s) marked complete.`);
    },
    onError: () => toast.error('Bulk complete failed'),
  });
}
