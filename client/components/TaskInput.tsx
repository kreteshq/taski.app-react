import React from 'react';
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as http from 'kretes/http';

import { Task } from '@/types';

const request = (data: Task) => http.POST('/_api/task', data);

export const TaskInput = ({ }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Task>();

  const queryClient = useQueryClient()
  const mutation = useMutation(request, {
    onMutate: async (task) => {
      await queryClient.cancelQueries('tasks')
      const previousTodos = queryClient.getQueryData<Task[]>('tasks')
      queryClient.setQueryData<Task[]>('tasks', collection => [...(collection as Task[]), task])
      return { previousTodos }
    },
  });
  const onSubmit = handleSubmit(data => {
    mutation.mutate(data)
    reset();
  });

  return (
    <div className="mb-8">
      <form className="flex items-center justify-between relative" onSubmit={onSubmit}>
        <input
          {...register("name", { required: true })}
          placeholder="Add new item..."
          type="text"
          className="p-4 pr-20 border-l-4 border-gray-500 bg-gray-200 w-full shadow-inner outline-none"
        />
        <button type="submit" className="shadow text-blue-100 border-blue-100 bg-gray-500 font-semibold py-2 px-4 absolute right-0 mr-2">Add</button>
      </form>
      <div>{errors.name && <span>This field is required</span>}</div>
    </div>
  );
}
