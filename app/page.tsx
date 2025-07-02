import UserCard, { type Engineer } from '@/components/user-card';
import engineers from '../data/design-engineers.json' with { type: 'json' };

export default function Home() {
  const list = engineers as Engineer[];

  return (
    <main className="mx-auto flex max-w-6xl flex-col p-3 sm:p-5">
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
        {list.map((eng) => (
          <UserCard engineer={eng} key={eng.id} />
        ))}
      </div>
    </main>
  );
}
