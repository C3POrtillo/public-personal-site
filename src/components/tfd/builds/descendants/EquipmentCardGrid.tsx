import type { FC } from 'react';

import { useBuild } from '@/components/tfd/builds/BuildProvider';
import ExternalComponentImageCard from '@/components/tfd/externalComponents/ExternalComponentImageCard';

interface EquipmentCardGridProps {
  disabled?: boolean;
}

const EquipmentCardGrid: FC<EquipmentCardGridProps> = ({ disabled }) => {
  const { equippedComponents } = useBuild();

  return (
    <div className="flex flex-row flex-wrap justify-center gap-2 md:h-full md:flex-col">
      {equippedComponents.map(component => {
        if (!component) {
          return;
        }
        const { external_component_id } = component;

        return <ExternalComponentImageCard key={external_component_id} {...component} disabled={disabled} />;
      })}
    </div>
  );
};

export default EquipmentCardGrid;
