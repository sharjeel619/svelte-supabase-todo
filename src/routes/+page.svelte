<script>
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { onMount } from "svelte";
  import { loadAllTasks, saveTasks, removeTasks, updateTasks } from "$lib/api";

  /** Variables **/

  let newTask = { title: "", description: "" };
  let tasks = [];
  let isEdit = -1;

  /***********************************************************/

  /** LifeCycle Hooks **/

  onMount(async () => {
    const { data } = await loadAllTasks();
    tasks = data || [];
  });

  /************************************************************/

  /** Functions **/
  async function saveTask() {
    try {
      await saveTasks({ ...newTask });
      tasks = [
        ...tasks,
        { ...newTask, id: tasks[tasks.length - 1].id + 1, is_complete: false },
      ];
      newTask = { title: "", description: "" };
    } catch (e) {
      console.log(e);
    }
  }

  async function saveEditedTask() {
    try {
      await updateTasks(isEdit, { ...newTask });
      tasks = tasks.map((item, index) =>
        isEdit === item.id
          ? { ...newTask, is_complete: item.is_complete }
          : item
      );
      isEdit = -1;
      newTask = { title: "", description: "" };
    } catch (e) {
      console.log(e);
    }
  }

  async function editTask(index, id) {
    isEdit = id;
    newTask = tasks[index];
  }

  async function markDone(index, id) {
    try {
      await updateTasks(id, { is_complete: !tasks[index].is_complete });
      tasks[index].is_complete = !tasks[index].is_complete;
    } catch (e) {
      console.log(e);
    }
  }

  async function removeTask(index, id) {
    try {
      await removeTasks(id);
      tasks = tasks.filter((_, i) => i !== index);
    } catch (e) {}
  }
</script>

<div class="p-4">
  <h1 class="text-center text-4xl mb-10">Todo App in Svelte</h1>
  <h1 class="my-5 text-2xl text-center underline">Add a task</h1>
  <div class="mt-5 flex justify-center text-center">
    <form
      class="w-1/4"
      on:submit|preventDefault={isEdit === -1 ? saveTask : saveEditedTask}
    >
      <Input
        type="text"
        bind:value={newTask.title}
        required
        placeholder="Title"
      />
      <Textarea
        bind:value={newTask.description}
        required
        rows={5}
        class="my-3"
        placeholder="Description"
      />
      <Button type="submit">Save Task</Button>
    </form>
  </div>
  <hr class="mt-3" />
  <div>
    <h1 class="my-5 text-2xl text-center underline">Tasks</h1>
    <div class="flex flex-col mt-3 mx-auto w-1/2">
      {#each tasks as item, index}
        <div
          class="flex items-center justify-between gap-5 my-3 bg-slate-50 px-2 rounded-md"
        >
          <div class="w-1/2">
            <p
              class="text-2xl mb-3 leading-none flex-1"
              style:text-decoration={item.is_complete ? "line-through" : ""}
            >
              {item.title}
            </p>
            <p style:text-decoration={item.is_complete ? "line-through" : ""}>
              {item.description}
            </p>
          </div>
          <div class="flex items-center">
            <Button variant="link" on:click={() => markDone(index, item.id)}
              >Mark as {item.is_complete ? "Undone" : "Done"}</Button
            >
            <Button variant="link" on:click={() => editTask(index, item.id)}
              >Edit</Button
            >
            <Button variant="link" on:click={() => removeTask(index, item.id)}
              >Remove</Button
            >
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
