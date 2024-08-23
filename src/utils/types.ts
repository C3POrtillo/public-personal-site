export const socials = [
  {
    site: 'twitter',
    href: 'https://twitter.com/c3portillo',
  },
  {
    site: 'instagram',
    href: 'https://www.instagram.com/c3portillo',
  },
  {
    site: 'twitch',
    href: 'https://www.twitch.tv/ishtaba',
  },
  {
    site: 'spotify',
    href: 'https://open.spotify.com/user/12160737745?si=mpzFjCRkTFW7D_Y6WtFKxA',
  },
  {
    site: 'steam',
    href: 'https://steamcommunity.com/id/ishtaba',
  },
] as const;

export type BaseStat = {
  stat_id?: string;
  stat_type?: string;
  stat_value: number;
};

export const tiers = ['Standard', 'Rare', 'Ultimate'] as const;
export type TiersType = (typeof tiers)[number];
