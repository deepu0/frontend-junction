import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from('todos').select();

  return (
    <div className='p-8 max-w-md mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Supabase Test: Todos</h1>
      <ul className='list-disc pl-5 space-y-2'>
        {todos?.map((todo) => (
          <li key={todo.id} className='text-gray-800 dark:text-gray-200'>
            {todo.name}
          </li>
        ))}
      </ul>
      {(!todos || todos.length === 0) && (
        <p className='text-gray-500 mt-4'>
          No todos found or table does not exist yet.
        </p>
      )}
    </div>
  );
}
