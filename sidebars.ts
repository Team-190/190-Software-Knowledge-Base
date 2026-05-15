import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'README',
    {
      type: 'category',
      label: 'FRC Hardware',
      link: {
        type: 'generated-index',
      },
      collapsed: true,
      items: [
        'HARDWARE_CONTEXT',
        {
          type: 'category',
          label: '🧠 Robot Controller',
          link: {
            type: 'doc',
            id: 'ROBOT_CONTROLLER',
          },
          collapsed: true,
          items: [
            'ROBORIO',
            'SYSTEMCORE'
          ],
        },
          'RADIO',
          'FMS'
      ],
    },
  ],
};

export default sidebars;