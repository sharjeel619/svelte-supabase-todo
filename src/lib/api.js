import { supabase } from "$lib/supaBaseClient";

export async function loadAllTasks() {
  let { data, error } = await supabase.from("todos").select("*");
  return {
    data, error
  }
}

export async function saveTasks({ title, description }) {
  const { data, error } = await supabase
    .from('todos')
    .insert([
      { title, description, is_complete: false },
    ])
    .select()

  return {
    data, error
  }
}

export async function editTasks({ title, description }) {
  const { data, error } = await supabase
    .from('todos')
    .insert([
      { title, description, is_complete: false },
    ])
    .select()

  return {
    data, error
  }
}

export async function removeTasks(id) {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)

  return {
    error
  }
}

export async function updateTasks(id, { title, description, is_complete }) {
  const { data, error } = await supabase
    .from('todos')
    .update({ title, description, is_complete })
    .eq('id', id)
    .select()

  return {
    data, error
  }
}