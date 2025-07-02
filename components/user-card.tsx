import { ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import type { FC } from 'react';
import { XLogo } from './x-logo';

export type Engineer = {
  id: string;
  username: string;
  name: string;
  description: string;
  image: string;
};

const UserCard: FC<{ engineer: Engineer }> = ({ engineer }) => (
  <>
    <div className="hidden w-full items-center justify-between gap-4 overflow-hidden border bg-white sm:flex">
      <div className="flex items-center gap-5 px-5 py-4">
        <Image
          alt={engineer.name}
          className="rounded-full"
          height={64}
          src={engineer.image}
          width={64}
        />
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <span className="font-semibold">{engineer.name}</span>
            <span className="text-muted-foreground text-sm">
              @{engineer.username}
            </span>
          </div>
          <p className="line-clamp-3 text-muted-foreground text-sm">
            {engineer.description}
          </p>
        </div>
      </div>
      <a
        className="flex flex-row items-center justify-center gap-5 self-stretch border-l pr-1 pl-8 transition hover:bg-muted hover:underline"
        href={`https://x.com/${engineer.username}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <XLogo />
        <ChevronRightIcon className="opacity-30" size={20} />
      </a>
    </div>

    <a
      className="flex w-full max-w-xl items-center justify-between gap-3 overflow-hidden rounded-2xl border sm:hidden"
      href={`https://x.com/${engineer.username}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="flex items-center gap-3 p-3">
        <Image
          alt={engineer.name}
          className="rounded-full"
          height={48}
          src={engineer.image}
          width={48}
        />
        <div className="flex flex-col gap-0.5">
          {engineer.name}
          <span className="text-muted-foreground text-sm">
            @{engineer.username}
          </span>
          <p className="line-clamp-3 text-muted-foreground text-sm">
            {engineer.description}
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center gap-5 self-stretch px-7 transition">
        <XLogo />
      </div>
    </a>
  </>
);

export default UserCard;
