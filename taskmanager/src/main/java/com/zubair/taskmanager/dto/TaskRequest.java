package com.zubair.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TaskRequest {
    @NotBlank(message = "Title can't be empty")
    @Size(min = 3,max = 100)
    private String title;

    @NotBlank(message = "Description can't be empty")
    private String description;

    @NotBlank(message = "Status can't be empty")
    private String status;

    @NotBlank(message = "Priority can't be empty")
    private String priority;
}
