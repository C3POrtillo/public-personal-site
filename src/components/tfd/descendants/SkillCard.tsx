import type { SkillData } from '@/components/tfd/descendants/types';
import type { FC } from 'react';

import Icon from '@/components/icon/Icon';
import { archesImages, attributesImages } from '@/utils/attributes/types';
import { getLabelClass } from '@/utils/utils';

const SkillCard: FC<SkillData> = ({
  skill_name,
  skill_description,
  skill_image_url,
  skill_type,
  arche_type,
  element_type,
}) => {
  const labelClass = getLabelClass(element_type);
  const attribute = (
    <div className={['flex flex-row items-center gap-2', labelClass].join(' ')}>
      <Icon src={attributesImages[element_type].attribute} alt={element_type} backgroundClass="hexagon" />{' '}
      {element_type}
    </div>
  );
  const arche = arche_type && (
    <div className="flex flex-row items-center gap-2">
      <Icon src={archesImages[arche_type]} alt={arche_type} backgroundClass="rhombus" /> {arche_type}
    </div>
  );

  return (
    <div className="flex flex-col rounded-md bg-neutral-700 hover:bg-neutral-600">
      <div className="flex flex-row items-center justify-between border-b-1 border-white p-2 ">
        <div className="flex flex-row items-center gap-2 text-lg lg:text-xl">
          <Icon src={skill_image_url} alt={skill_name} />
          <span className="text-xl lg:text-2xl">{skill_name}</span>
        </div>
        <span className="text-lg">{skill_type}</span>
      </div>
      <div className="skill-description">
        <div className="flex flex-row gap-3 text-nowrap p-3 md:flex-col">
          {attribute} {arche}
        </div>
        <p className="flex min-h-full grow flex-col border-t-1 p-2 text-lg md:border-l-1 md:border-t-0 md:border-white">
          {skill_description}
        </p>
      </div>
    </div>
  );
};

export default SkillCard;
