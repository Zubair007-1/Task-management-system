package com.zubair.taskmanager.service;

import com.zubair.taskmanager.dto.TaskRequest;
import com.zubair.taskmanager.dto.TaskResponse;
import com.zubair.taskmanager.entity.Task;
import com.zubair.taskmanager.exception.ResourceNotFoundException;
import com.zubair.taskmanager.repository.TaskRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository){
        this.taskRepository = taskRepository;
    }

    public Task saveTask(TaskRequest request){

        Task task = new Task();

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());

        return taskRepository.save(task);
    }

    public List<Task> getAllTasks(){
        return taskRepository.findAll();
    }
    public Task getTaskById(Long id){
        return taskRepository.findById(id)
                .orElseThrow(()->
                        new ResourceNotFoundException("task not found with id"+id));
    }

    public void deleteTask(Long id){

        Task task = getTaskById(id);
        taskRepository.delete(task);

    }
    public Task updateTask(Long id, TaskRequest request){

        Task task=getTaskById(id);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus());

        return taskRepository.save(task);

    }
    private TaskResponse mapToResponse(Task task){
        TaskResponse response = new TaskResponse();

        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setPriority(task.getPriority());

        return response;

    }
    public List<Task> searchTasks(String keyword){

        return taskRepository.findByTitleContainingIgnoreCase(keyword);

    }

    public List<Task> getTasksByStatus(String status){
        return taskRepository.findByStatus(status);
    }

    public Page<Task> getTasks(int page,int size){
        Pageable pageable = PageRequest.of(page, size);
        return taskRepository.findAll(pageable);
    }
    public List<Task> sortTasks(){

        return taskRepository.findAll(
                Sort.by("title"));
    }


}
