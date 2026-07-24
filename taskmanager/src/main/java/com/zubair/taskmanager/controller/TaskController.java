package com.zubair.taskmanager.controller;

import com.zubair.taskmanager.dto.TaskRequest;
import com.zubair.taskmanager.entity.Task;
import com.zubair.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService){
        this.taskService = taskService;
    }

    @PostMapping
    public Task createTask(@Valid @RequestBody TaskRequest request){
        return taskService.saveTask(request);
    }

    @GetMapping
    public List<Task> getAllTasks(){
        return taskService.getAllTasks();
    }
    @GetMapping("/{id}")
    public Task getTask(@PathVariable Long id){
        return taskService.getTaskById(id);
    }
    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id){
        taskService.deleteTask(id);
        return "task deleted sucessfully.";
    }
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id,@Valid @RequestBody TaskRequest request){
        return taskService.updateTask(id,request);

    }
}
