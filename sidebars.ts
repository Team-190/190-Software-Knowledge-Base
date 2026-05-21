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
        'hardware_context/HARDWARE_CONTEXT',
        {
          type: 'category',
          label: '🧠 Robot Controller',
          link: {
            type: 'doc',
            id: 'hardware_context/robot_controller/ROBOT_CONTROLLER',
          },
          collapsed: true,
          items: [
            'hardware_context/robot_controller/ROBORIO',
            'hardware_context/robot_controller/SYSTEMCORE'
          ],
        },
          'hardware_context/RADIO',
          'hardware_context/FMS'
      ],
    },
    {
      type: 'category',
      label: 'Java',
      link: {
        type: 'generated-index',
      },
      collapsed: true,
      items: [
        'java/JAVA_INTRODUCTION',
        {
          type: 'category',
          label: '🧑‍💻 Fundamental Concepts',
          link: {
            type: 'doc',
            id: 'java/FUNDAMENTALS',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '🛃 Control Flow',
          link: {
            type: 'doc',
            id: 'java/CONTROL_FLOW',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '🧩 Object Oriented Programming',
          link: {
            type: 'doc',
            id: 'java/OOP',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '🗄️ Data Structures',
          link: {
            type: 'doc',
            id: 'java/DATA_STRUCTURES',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '🚀 Advanced Concepts',
          link: {
            type: 'doc',
            id: 'java/ADVANCED_CONCEPTS',
          },
          collapsed: true,
          items: [],
        },
      ],
    },
    {
      type: 'category',
      label: '190 Robot Code',
      link: {
        type: 'generated-index',
      },
      collapsed: true,
      items: [
        {
          type: 'category',
          label: '🔄 Robot Code Lifecycle',
          link: {
            type: 'doc',
            id: 'robot_code/ROBOT_CODE_LIFECYCLE',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '🌉 Robot Code Architecture',
          link: {
            type: 'doc',
            id: 'robot_code/ROBOT_CODE_ARCHITECTURE',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '🧰 FRC Hardware',
          link: {
            type: 'doc',
            id: 'robot_code/FRC_HARDWARE',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '🗃️ Hardware Abstraction',
          link: {
            type: 'doc',
            id: 'robot_code/HARDWARE_ABSTRACTION',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '📐 Geometry Concepts',
          link: {
            type: 'doc',
            id: 'robot_code/GEOMETRY_CONCEPTS',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '🌐 Subsystem State Management',
          link: {
            type: 'doc',
            id: 'robot_code/SUBSYSTEM_STATE_MANAGEMENT',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '🪵 Logging',
          link: {
            type: 'doc',
            id: 'robot_code/LOGGING',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '🐐 GompeiLib',
          link: {
            type: 'doc',
            id: 'robot_code/gompeilib/GOMPEILIB',
          },
          collapsed: true,
          items: [
            'robot_code/gompeilib/LIBRARY_INTEGRATION',
            'robot_code/gompeilib/SYNC',
            'robot_code/gompeilib/MAKING_CHANGES',
            'robot_code/gompeilib/UNIT_TESTING'
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Controls',
      link: {
        type: 'generated-index',
      },
      collapsed: true,
      items: [
        {
          type: 'category',
          label: '🏍️ Motors',
          link: {
            type: 'doc',
            id: 'controls/MOTORS',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '📟 Hardware Communication',
          link: {
            type: 'doc',
            id: 'controls/HARDWARE_COMMUNICATION',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '💡 Open Loop Control',
          link: {
            type: 'doc',
            id: 'controls/OPEN_LOOP_CONTROL',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '➰ Closed Loop Control',
          link: {
            type: 'doc',
            id: 'controls/CLOSED_LOOP_CONTROL',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '🎛️ Motion Profiles',
          link: {
            type: 'doc',
            id: 'controls/MOTION_PROFILING',
          },
          collapsed: true,
          items: [],
        },
      ],
    },
    {
      type: 'category',
      label: 'Software Engineering Practices',
      link: {
        type: 'generated-index',
      },
      collapsed: true,
      items: [
        {
          type: 'category',
          label: '🔀 Version Control',
          link: {
            type: 'doc',
            id: 'software_engineering_practices/VERSION_CONTROL',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '✅ Code Quality',
          link: {
            type: 'doc',
            id: 'software_engineering_practices/CODE_QUALITY',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '📈 Team Development',
          link: {
            type: 'doc',
            id: 'software_engineering_practices/TEAM_DEVELOPMENT',
          },
          collapsed: true,
          items: [],
        }
      ],
    },
    {
      type: 'category',
      label: 'Vision & Localization',
      link: {
        type: 'generated-index',
      },
      collapsed: true,
      items: [
        {
          type: 'category',
          label: '🛞 Odometry',
          link: {
            type: 'doc',
            id: 'vision_localization/ODOMETRY',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '📷 Cameras',
          link: {
            type: 'doc',
            id: 'vision_localization/CAMERAS',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '📶 NetworkTables',
          link: {
            type: 'doc',
            id: 'vision_localization/NETWORKTABLES',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '🔍 Vision Processing',
          link: {
            type: 'doc',
            id: 'vision_localization/VISION_PROCESSING',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '🧭 Coordinate Frames',
          link: {
            type: 'doc',
            id: 'vision_localization/COORDINATE_FRAMES',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '🎯 Pose Estimation',
          link: {
            type: 'doc',
            id: 'vision_localization/POSE_ESTIMATION',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '📍 Sensor Fusion',
          link: {
            type: 'doc',
            id: 'vision_localization/SENSOR_FUSION',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '⏱️ Latency',
          link: {
            type: 'doc',
            id: 'vision_localization/LATENCY',
          },
          collapsed: true,
          items: [],
        },
      ],
    }
  ],
};

export default sidebars;