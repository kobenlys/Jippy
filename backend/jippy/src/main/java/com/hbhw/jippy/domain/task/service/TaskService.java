package com.hbhw.jippy.domain.task.service;

import com.hbhw.jippy.domain.task.dto.request.TaskRequest;
import com.hbhw.jippy.domain.task.dto.response.TaskResponse;
import com.hbhw.jippy.domain.task.entity.Task;
import com.hbhw.jippy.domain.task.repository.TaskRepository;
import com.hbhw.jippy.utils.DateTimeUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    /**
     * 매장별 할 일 등록
     */
    public void createTask(Integer storeId, TaskRequest request) {
        Task task = Task.builder()
                .storeId(storeId)
                .title(request.getTitle())
                .isComplete(request.isComplete())
                .createdAt(DateTimeUtils.nowString())
                .build();

        Task saved = taskRepository.save(task);
    }

    /**
     * 매장별 할 일 전체 목록 조회
     */
    public List<TaskResponse> getTasksByStore(Integer storeId) {
        List<Task> tasks = taskRepository.findByStoreId(storeId);
        return tasks.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * 할 일 상세 조회
     */
    public TaskResponse getTaskById(Integer storeId, Long todoId) {
        Task task = findTaskByStoreAndId(storeId, todoId);
        return toResponse(task);
    }

    /**
     * 할 일 수정
     */
    public void updateTask(Integer storeId, Long todoId, TaskRequest request) {
        Task task = findTaskByStoreAndId(storeId, todoId);
        task.setTitle(request.getTitle());
        task.setIsComplete(request.isComplete());

    }

    /**
     * 할 일 삭제
     */
    public void deleteTask(Integer storeId, Long todoId) {
        Task task = findTaskByStoreAndId(storeId, todoId);
        taskRepository.delete(task);
    }

    /**
     * 매장 ID(storeId)와 todoId로 Task 조회
     */
    private Task findTaskByStoreAndId(Integer storeId, Long todoId) {
        return taskRepository.findById(todoId)
                .filter(t -> t.getStoreId().equals(storeId))
                .orElseThrow(() -> new IllegalArgumentException("해당 매장에 해당하는 할 일을 찾을 수 없습니다. ID=" + todoId));
    }

    /**
     * Entity -> DTO 변환
     */
    private TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .storeId(task.getStoreId())
                .title(task.getTitle())
                .createdAt(task.getCreatedAt())
                .isComplete(task.getIsComplete())
                .build();
    }
}
