package com.zubair.taskmanager.controller;

import com.zubair.taskmanager.dto.DashboardResponse;

import com.zubair.taskmanager.dto.TaskRequest;
import com.zubair.taskmanager.entity.Task;
import com.zubair.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
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

    @GetMapping("/{id:\\d+}")
    public Task getTask(@PathVariable Long id){
        return taskService.getTaskById(id);
    }

    @DeleteMapping("/{id:\\d+}")
    public String deleteTask(@PathVariable Long id){
        taskService.deleteTask(id);
        return "task deleted sucessfully.";
    }

    @PutMapping("/{id:\\d+}")
    public Task updateTask(@PathVariable Long id,@Valid @RequestBody TaskRequest request){
        return taskService.updateTask(id,request);
    }

    @GetMapping("/search/{keyword}")
    public List<Task> searchTask(@PathVariable String keyword){
        return taskService.searchTasks(keyword);
    }
    @GetMapping("/status")
    public List<Task> getByStatus(
            @RequestParam String status){
        return taskService.getTasksByStatus(status);
    }
    @GetMapping("/page")
    public Page<Task> getTasks(

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "5") int size){

        return taskService.getTasks(page,size);

    }
    @GetMapping("/sort")
    public List<Task> sortTasks(){

        return taskService.sortTasks();

    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard(){
        return taskService.getDashboard();
    }
}
