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
          'hardware_context/RADIO'
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
            id: 'java/fundamentals/PROGRAM_SKELETON',
          },
          collapsed: true,
          items: [
              'java/fundamentals/PROGRAM_SKELETON',
              'java/fundamentals/DATA_TYPES',
              'java/fundamentals/FLOATING_POINT',
              'java/fundamentals/VARIABLES',
              'java/fundamentals/CONSTANTS',
              'java/fundamentals/EXPRESSIONS',
              'java/fundamentals/OPERATORS',
              'java/fundamentals/TYPE_CASTING',
              'java/fundamentals/IO'
          ],
        },
        {
          type: 'category',
          label: '🛃 Control Flow',
          link: {
            type: 'doc',
            id: 'java/CONTROL_FLOW',
          },
          collapsed: true,
          items: [
              'java/control_flow/CONDITIONALS',
              'java/control_flow/SWITCH',
              'java/control_flow/LOOPS',
              'java/control_flow/LOOP_CONTROL'
          ],
        },
        {
          type: 'category',
          label: '🧩 Object Oriented Programming',
          link: {
            type: 'doc',
            id: 'java/OOP',
          },
          collapsed: true,
          items: [
              'java/oop/CLASSES_AND_OBJECTS',
              'java/oop/CONSTRUCTORS',
              'java/oop/ACCESS_MODIFIERS',
              'java/oop/STATIC_VS_INSTANCE',
              'java/oop/INHERITANCE',
              'java/oop/POLYMORPHISM',
              'java/oop/ABSTRACT_CLASSES',
              'java/oop/INTERFACES',
              'java/oop/PACKAGES_AND_IMPORTS'
          ],
        },
        {
          type: 'category',
          label: '🗄️ Data Structures',
          link: {
            type: 'doc',
            id: 'java/DATA_STRUCTURES',
          },
          collapsed: true,
          items: [
              'java/data_structures/ARRAYS',
              'java/data_structures/ARRAYLIST',
              'java/data_structures/LINKED_LIST',
              'java/data_structures/STACKS_AND_QUEUES',
              'java/data_structures/HASHMAP_HASHSET',
              'java/data_structures/ITERATION'
          ],
        },
        {
          type: 'category',
          label: '🚀 Advanced Concepts',
          link: {
            type: 'doc',
            id: 'java/ADVANCED_CONCEPTS',
          },
          collapsed: true,
          items: [
              'java/advanced_concepts/EXCEPTIONS',
              'java/advanced_concepts/GENERICS',
              'java/advanced_concepts/LAMBDAS',
              'java/advanced_concepts/STREAMS',
              'java/advanced_concepts/ENUMS'
          ],
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
          label: '💡 Open Loop Control',
          link: {
            type: 'doc',
            id: 'controls/open_loop_control/OPEN_LOOP_CONTROL',
          },
          collapsed: true,
          items: [
            'controls/open_loop_control/PERCENT_OUTPUT',
            'controls/open_loop_control/VOLTAGE_CONTROL',
            'controls/open_loop_control/FEEDFORWARD',
            'controls/open_loop_control/COMPARISON',
          ],
        },
        {
          type: 'category',
          label: '➰ Closed Loop Control',
          link: {
            type: 'doc',
            id: 'controls/closed_loop_control/CLOSED_LOOP_CONTROL',
          },
          collapsed: true,
          items: [
            'controls/closed_loop_control/PROPORTIONAL',
            'controls/closed_loop_control/INTEGRAL',
            'controls/closed_loop_control/DERIVATIVE',
            'controls/closed_loop_control/PID_TUNING',
            'controls/closed_loop_control/COMPARISON',
          ],
        },
        {
          type: 'category',
          label: '🎛️ Motion Profiles',
          link: {
            type: 'doc',
            id: 'controls/motion_profiling/MOTION_PROFILING',
          },
          collapsed: true,
          items: [
            'controls/motion_profiling/TRAPEZOIDAL',
            'controls/motion_profiling/S_CURVE',
            'controls/motion_profiling/FEEDFORWARD_WITH_PROFILES',
            'controls/motion_profiling/COMPARISON',
          ],
        },
        {
          type: 'category',
          label: '🏍️ Motors and Commutation',
          link: {
            type: 'doc',
            id: 'controls/motors/MOTORS',
          },
          collapsed: true,
          items: [
            'controls/motors/BRUSHED_MOTORS',
            'controls/motors/BRUSHLESS_MOTORS',
            'controls/motors/SIX_STEP_COMMUTATION',
            'controls/motors/SINUSOIDAL_COMMUTATION',
            'controls/motors/FIELD_ORIENTED_CONTROL',
            'controls/motors/MOTOR_CHARACTERISTICS',
            'controls/motors/TORQUE_RIPPLE',
            'controls/motors/COMPARISON',
          ],
        },
        'controls/current_control/CURRENT_CONTROL',
        {
          type: 'category',
          label: '📟 Hardware Communication',
          link: {
            type: 'doc',
            id: 'controls/hardware_communication/HARDWARE_COMMUNICATION',
          },
          collapsed: true,
          items: [
            'controls/hardware_communication/PWM',
            'controls/hardware_communication/UART',
            'controls/hardware_communication/SPI',
            'controls/hardware_communication/I2C',
            'controls/hardware_communication/CAN_BUS',
            'controls/hardware_communication/ETHERNET',
            'controls/hardware_communication/COMPARISON',
          ],
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
        },
        {
          type: 'category',
          label: '📝 Contributing Guidelines',
          link: {
            type: 'doc',
            id: 'software_engineering_practices/CONTRIBUTING_GUIDELINES',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '🤖 AI Policy',
          link: {
            type: 'doc',
            id: 'software_engineering_practices/AI_POLICY',
          },
          collapsed: true,
          items: []
        }
      ],
    },
    {
      type: 'category',
      label: 'Networking',
      link: {
        type: 'generated-index',
      },
      collapsed: true,
      items: [
        {
          type: 'category',
          label: '🌐 IP Addressing & Subnets',
          link: {
            type: 'doc',
            id: 'networking/IP_ADDRESSING',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '🚪 Ports & Transport (TCP/UDP)',
          link: {
            type: 'doc',
            id: 'networking/PORTS_AND_TRANSPORT',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '📛 DNS & Name Resolution',
          link: {
            type: 'doc',
            id: 'networking/DNS',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '🕸️ FRC Network Topology',
          link: {
            type: 'doc',
            id: 'networking/FRC_NETWORK_TOPOLOGY',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '📶 NetworkTables',
          link: {
            type: 'doc',
            id: 'networking/NETWORKTABLES',
          },
          collapsed: true,
          items: [],
        },
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
          label: '📍 Pose Estimation',
          link: {
            type: 'doc',
            id: 'vision_localization/POSE_ESTIMATION',
          },
          collapsed: true,
          items: [],
        },
        {
          type: 'category',
          label: '🎯 Sensor Fusion',
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
    },
  ],
};

export default sidebars;