import { KanbanColumnSkeleton, ProjectCardSkeleton } from "@/components";
import { KanbanAddCardButton } from "@/components/tasks/kanban/add-card-button";
import {
  KanbanBoardContainer,
  KanbanBoard
} from "@/components/tasks/kanban/board";
import ProjectCard, { ProjectCardMemo } from "@/components/tasks/kanban/card";
import KanbanColumn from "@/components/tasks/kanban/column";
import KanbanItem from "@/components/tasks/kanban/item";
import { UPDATE_TASK_STAGE_MUTATION } from "@/graphql/mutations";

import { TASKS_QUERY, TASK_STAGES_QUERY } from "@/graphql/queries";
import { TaskStage } from "@/graphql/schema.types";
import { TasksQuery } from "@/graphql/types";
import { DragEndEvent } from "@dnd-kit/core";
import { useList, useUpdate } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import React from "react";

const List = ({ children }: React.PropsWithChildren) => {
  const { data: stages, isLoading: isLoadingStages } = useList<TaskStage>({
    resource: "taskStages",
    filters: [
      {
        field: "title",
        operator: "in",
        value: ["TODO", "IN PROGESS", "IN REVIEW", "DONE"]
      }
    ],
    sorters: [
      {
        field: "createdAt",
        order: "asc"
      }
    ],
    meta: {
      gqlQuery: TASK_STAGES_QUERY
    }
  });

  const { data: tasks, isLoading: isLoadingTasks } = useList<
    GetFieldsFromList<TasksQuery>
  >({
    resource: "tasks",
    sorters: [
      {
        field: "dueDate",
        order: "asc"
      }
    ],
    queryOptions: {
      enabled: !!stages
    },
    pagination: {
      mode: "off"
    },
    meta: {
      gqlQuery: TASKS_QUERY
    }
  });

  const { mutate: updateTask } = useUpdate();

  const taskStages = React.useMemo(() => {
    if (!tasks?.data || !stages?.data) {
      return {
        unassignedStage: [],
        stages: []
      };
    }

    const unassignedStage = tasks.data.filter((task) => task.stageId === null);

    const grouped: TaskStage[] = stages.data.map((stage) => ({
      ...stage,
      tasks: tasks.data.filter((task) => task.stageId?.toString() === stage.id)
    }));

    return {
      unassignedStage,
      columns: grouped
    };
  }, [stages, tasks]);

  const handleAddCard = (args: { stageId: string }) => {};

  const handleOnDragEnd = (event: DragEndEvent) => {
    let stageId = event.over?.id as undefined | string | null;
    const taskId = event.active.id as string;
    const taskStageId = event.active.data.current?.stageId;

    if (taskStageId === stageId) return;

    if (stageId === "unassigned") {
      stageId = null;
    }

    updateTask({
      resource: "tasks",
      id: taskId,
      values: {
        stageId: stageId
      },
      successNotification: false,
      mutationMode: "optimistic",
      meta: {
        qglMutation: UPDATE_TASK_STAGE_MUTATION
      }
    });
  };

  const isLoading = isLoadingStages || isLoadingTasks;

  if (isLoading) return <PageSkeleton />;

  return (
    <>
      <KanbanBoardContainer>
        <KanbanBoard onDragEnd={handleOnDragEnd}>
          <KanbanColumn
            id="unassigned"
            title={"unassigned"}
            count={taskStages.unassignedStage.length || 0}
            onAddClick={() => handleAddCard({ stageId: "unassigned" })}
          >
            {taskStages.unassignedStage.map((task) => (
              <KanbanItem
                key={task.id}
                id={task.id}
                data={{ ...task, stagedId: "unassigned" }}
              >
                <ProjectCard {...task} dueDate={task.dueDate || undefined} />
              </KanbanItem>
            ))}

            {!taskStages.unassignedStage.length && (
              <KanbanAddCardButton
                onClick={() => handleAddCard({ stageId: "unassigned" })}
              />
            )}
          </KanbanColumn>

          {taskStages.columns?.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              count={col.tasks.length}
              onAddClick={() => handleAddCard({ stageId: col.id })}
            >
              {!isLoading &&
                col.tasks.map((task) => (
                  <KanbanItem key={task.id} id={task.id} data={task}>
                    <ProjectCardMemo
                      {...task}
                      dueDate={task.dueDate || undefined}
                    />
                  </KanbanItem>
                ))}
              {!col.tasks.length && (
                <KanbanAddCardButton
                  onClick={() => handleAddCard({ stageId: "unassigned" })}
                />
              )}
            </KanbanColumn>
          ))}
        </KanbanBoard>
      </KanbanBoardContainer>
      {children}
    </>
  );
};

export default List;

const PageSkeleton = () => {
  const columnCount = 6;
  const itemCount = 4;

  return (
    <KanbanBoardContainer>
      {Array.from({ length: columnCount }).map((_, index) => (
        <KanbanColumnSkeleton key={index}>
          {Array.from({ length: itemCount }).map((_, index) => (
            <ProjectCardSkeleton key={index}></ProjectCardSkeleton>
          ))}
        </KanbanColumnSkeleton>
      ))}
    </KanbanBoardContainer>
  );
};
