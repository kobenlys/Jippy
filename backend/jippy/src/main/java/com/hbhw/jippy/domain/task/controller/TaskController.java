package com.hbhw.jippy.domain.task.controller;

import com.hbhw.jippy.domain.task.dto.request.TaskRequest;
import com.hbhw.jippy.domain.task.dto.response.TaskResponse;
import com.hbhw.jippy.domain.task.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 권한: 직원(STAFF), 매니저(MANAGER), 사장(OWNER) 모두 접근 가능
 */
@RestController
@RequestMapping("/api/todo")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    /**
     * 매장별 할일 등록
     * POST /api/todo/{storeId}/create
     */
    //@PreAuthorize("hasAnyRole('STAFF','MANAGER','OWNER')")
    @PostMapping("/{storeId}/create")
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable("storeId") Integer storeId,
            @RequestBody TaskRequest request
    ) {
        TaskResponse response = taskService.createTask(storeId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 매장별 할 일 전체 목록 조회
     * GET /api/todo/{storeId}/select
     */
    //@PreAuthorize("hasAnyRole('STAFF','MANAGER','OWNER')")
    @GetMapping("/{storeId}/select")
    public ResponseEntity<List<TaskResponse>> getTasksByStore(
            @PathVariable("storeId") Integer storeId
    ) {
        List<TaskResponse> tasks = taskService.getTasksByStore(storeId);
        return ResponseEntity.ok(tasks);
    }

    /**
     * 할 일 상세조회
     * GET /api/todo/{storeId}/select/{todoId}
     */
    //@PreAuthorize("hasAnyRole('STAFF','MANAGER','OWNER')")
    @GetMapping("/{storeId}/select/{todoId}")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable("storeId") Integer storeId,
            @PathVariable("todoId") Long todoId
    ) {
        TaskResponse response = taskService.getTaskById(storeId, todoId);
        return ResponseEntity.ok(response);
    }

    /**
     * 할일 수정
     * PUT /api/todo/{storeId}/update/{todoId}
     */
    //@PreAuthorize("hasAnyRole('STAFF','MANAGER','OWNER')")
    @PutMapping("/{storeId}/update/{todoId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable("storeId") Integer storeId,
            @PathVariable("todoId") Long todoId,
            @RequestBody TaskRequest request
    ) {
        TaskResponse response = taskService.updateTask(storeId, todoId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 할 일 삭제
     * DELETE /api/todo/{storeId}/delete/{todoId}
     */
    //@PreAuthorize("hasAnyRole('STAFF','MANAGER','OWNER')")
    @DeleteMapping("/{storeId}/delete/{todoId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable("storeId") Integer storeId,
            @PathVariable("todoId") Long todoId
    ) {
        taskService.deleteTask(storeId, todoId);
        return ResponseEntity.noContent().build();
    }
}
