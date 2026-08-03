package com.zubair.taskmanager.dto;

import lombok.Data;

@Data
public class DashboardResponse {

    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;

}
