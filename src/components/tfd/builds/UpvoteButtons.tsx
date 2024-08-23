import { useEffect, useState } from 'react';

import type { FC } from 'react';

import Button from '@/components/inputs/Button/Button';
import { useAuth } from '@/components/tfd/accounts/AuthProvider';
import { joinStrings } from '@/utils/utils';

interface UpvoteButtonsProps {
  upvotes: number;
  downvotes: number;
  isRow?: boolean;
  buildId: number | undefined | null;
}
const UpvoteButtons: FC<UpvoteButtonsProps> = ({ buildId, upvotes, downvotes, isRow }) => {
  const { isAuthenticated } = useAuth();
  const [userVote, setUserVote] = useState(0);
  const [fromServer, setFromServer] = useState(false);
  const votes = upvotes + downvotes;
  const getTextColor = () => {
    const totalVote = votes + userVote;
    if (totalVote === 0) {
      return undefined;
    }

    return totalVote > 0 ? 'text-green-500' : 'text-red-500';
  };

  useEffect(() => {
    if (isAuthenticated && buildId) {
      fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: isAuthenticated.id, buildId }),
      })
        .then(res => res.json())
        .then(data => {
          if (data) {
            setUserVote(data.vote_type);
            setFromServer(true);
          }
        })
        .catch(err => console.error('Failed to fetch user vote', err));
    }
  }, [isAuthenticated, buildId]);

  const handleVote = (vote: number) => {
    if (!isAuthenticated) {
      return;
    }

    const newVote = userVote === vote ? 0 : vote;
    setUserVote(newVote);
    setFromServer(false);

    try {
      fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: isAuthenticated.id, buildId, vote: newVote }),
      });
    } catch (error) {
      console.error('Failed to submit vote', error);
    }
  };

  return (
    <div
      className={joinStrings([
        'button-arrows hidden items-center justify-between gap-1 self-center p-2 md:flex',
        isRow ? 'flex-row' : 'w-28 flex-col',
      ])}
    >
      <div className="w-12">
        <Button size="button-0" onClick={() => handleVote(1)} disabled={!isAuthenticated}>
          <i
            className={joinStrings([
              'fa fa-chevron-up px-2',
              isAuthenticated && 'hover:text-green-400',
              userVote === 1 && 'text-green-500',
            ])}
          />
        </Button>
      </div>
      <span
        className={joinStrings([
          'flex h-10 w-full items-center justify-center rounded-lg border-2 border-black bg-neutral-700 text-2xl shadow-inner shadow-black',
          getTextColor(),
          isRow && 'min-w-16',
        ])}
      >
        {votes + (fromServer ? 0 : userVote)}
      </span>
      <div className="w-12">
        <Button size="button-0" onClick={() => handleVote(-1)} disabled={!isAuthenticated}>
          <i
            className={joinStrings([
              'fa fa-chevron-down px-2',
              isAuthenticated && 'hover:text-red-400',
              userVote === -1 && 'text-red-500',
            ])}
          />
        </Button>
      </div>
    </div>
  );
};

export default UpvoteButtons;
