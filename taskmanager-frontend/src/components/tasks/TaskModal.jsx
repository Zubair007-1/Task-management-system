import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { PRIORITIES, STATUSES } from '../../utils/constants';
import { useCreateTask, useUpdateTask } from '../../hooks/useTasks';

const PRIORITY_OPTIONS = PRIORITIES.map((p) => ({ value: p, label: p.charAt(0) + p.slice(1).toLowerCase() }));
const STATUS_OPTIONS   = STATUSES.map((s) => ({
  value: s,
  label: s === 'IN_PROGRESS' ? 'In Progress' : s.charAt(0) + s.slice(1).toLowerCase(),
}));

export default function TaskModal({ open, onClose, task }) {
  const isEdit = !!task;
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title:       task?.title       || '',
      description: task?.description || '',
      priority:    task?.priority    || 'MEDIUM',
      status:      task?.status      || 'TODO',
    },
  });

  // Sync form when editing task changes
  useEffect(() => {
    if (open) {
      reset({
        title:       task?.title       || '',
        description: task?.description || '',
        priority:    task?.priority    || 'MEDIUM',
        status:      task?.status      || 'TODO',
      });
    }
  }, [open, task, reset]);

  const onSubmit = async (data) => {
    if (isEdit) {
      await updateTask.mutateAsync({ id: task.id, ...data });
    } else {
      await createTask.mutateAsync(data);
    }
    onClose();
  };

  const loading = createTask.isPending || updateTask.isPending;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Task' : 'Create New Task'}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button
            type="submit"
            form="task-form"
            loading={loading}
            id={isEdit ? 'edit-task-submit' : 'create-task-submit'}
          >
            {isEdit ? 'Save Changes' : 'Create Task'}
          </Button>
        </>
      }
    >
      <form id="task-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Task title *"
          placeholder="e.g. Design the landing page"
          error={errors.title?.message}
          id="task-title"
          {...register('title', {
            required: 'Title is required',
            minLength: { value: 3, message: 'Must be at least 3 characters' },
            maxLength: { value: 100, message: 'Must be 100 characters or less' },
          })}
        />

        <div>
          <label className="form-label" htmlFor="task-description">Description *</label>
          <textarea
            id="task-description"
            rows={4}
            placeholder="Describe what needs to be done…"
            className={`input resize-none ${errors.description ? 'input-error' : ''}`}
            {...register('description', { required: 'Description is required' })}
          />
          {errors.description && <p className="form-error">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority *"
            options={PRIORITY_OPTIONS}
            error={errors.priority?.message}
            id="task-priority"
            {...register('priority', { required: 'Priority is required' })}
          />
          <Select
            label="Status *"
            options={STATUS_OPTIONS}
            error={errors.status?.message}
            id="task-status"
            {...register('status', { required: 'Status is required' })}
          />
        </div>

        {/* Additional fields (displayed but not sent to backend since entity doesn't have them) */}
        <div className="grid grid-cols-2 gap-4 opacity-60 pointer-events-none">
          <Input
            label="Due Date (coming soon)"
            type="date"
            disabled
            hint="Extend the backend entity to enable"
          />
          <Input
            label="Assignee (coming soon)"
            type="text"
            disabled
            placeholder="Team member…"
          />
        </div>
      </form>
    </Modal>
  );
}
