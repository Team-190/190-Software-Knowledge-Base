# Unit Testing

:::caution Living Documentation
APIs and control systems change season to season, and sometimes mid-season. Specific class names, file paths, and
code examples throughout this section reflect FRC 190's codebase at the time of writing and may become outdated or
obsolete as WPILib, CTRE, and other vendor libraries evolve. Treat this section as a guide to the underlying
concepts, not a guaranteed match to the current source.
:::

Because [GompeiLib](./GOMPEILIB.md) is shared across every robot 190 builds, a bug introduced into it doesn't stay
contained to one season, it ships everywhere the library is used. The testing standard reflects that: every main
source file is expected to have a matching test file, ```Elevator``` gets an ```ElevatorTest```, ```ArmIOTalonFX```
gets an ```ArmIOTalonFXTest```, and that pairing is the expectation for anything new added to the library, not an
optional extra.

## JUnit 5 and ```mockito-inline```

Tests run on JUnit 5, and anything that would otherwise require real hardware, a real CAN bus, or AdvantageKit's
static ```Logger```, gets mocked with ```mockito-inline``` instead. The [IO interface
pattern](../HARDWARE_ABSTRACTION.md#the-io-interface-pattern) is exactly what makes this easy: because every
default method already does nothing, ```mock(GenericRollerIO.class)``` is a complete, valid implementation with zero
extra setup.

<details>
<summary>Show code</summary>

```java
@BeforeEach
public void setUp() {
  edu.wpi.first.hal.HAL.initialize(500, 0);
  GompeiLib.init(RobotMode.SIM, false, 0.02);

  io = mock(GenericRollerIO.class);
  subsystem = mock(Subsystem.class, CALLS_REAL_METHODS);
  when(subsystem.getName()).thenReturn("TestRollerSubsystem");
}

@Test
public void testRoller() {
  try (MockedStatic<Logger> mockLogger = mockStatic(Logger.class)) {
    GenericRoller roller = new GenericRoller(io, subsystem, constants, "Test");
    assertNotNull(roller);

    roller.periodic();
    ...
  }
}
```

</details>

Two things worth noticing here. ```GompeiLib.init(...)``` has to run before anything else in a test, the same way it
does in [```robotInit()```](./GOMPEILIB.md#gompeilibinit), or the very first call into the library throws. And
```Logger``` gets mocked statically rather than left alone, since AdvantageKit's logger expects to be running inside
an actual robot program and would otherwise throw or no-op unpredictably outside one.

## IO Implementations Are Tested Per Variant

A subsystem with multiple IO implementations doesn't get one shared, parameterized test across all of them, each
variant gets its own: ```ArmIOTest``` (the interface's own default-method behavior), ```ArmIOSimTest```, and
```ArmIOTalonFXTest``` and ```ArmIOTalonFXSimTest``` for the two CTRE-backed variants. That split exists because each
variant genuinely exercises different code: ```ArmIOTalonFX```'s constructor builds a real
[```TalonFXConfiguration```](../FRC_HARDWARE.md#configuration-objects) and wires up status signals, while
```ArmIOSim``` drives a WPILib ```DCMotorSim``` instead, code paths a single shared test parameterized across "which
IO am I" would either miss entirely or need enough conditional logic to defeat the point of sharing a test in the
first place.

## Coverage Enforcement

Every test run generates a Jacoco coverage report (```jacocoTestReport```), and CI additionally runs
```jacocoTestCoverageVerification```, which fails the build outright if coverage drops below a configured minimum.
That minimum is currently set to 100% of whatever classes aren't explicitly excluded, worth calling out as the
*current* configuration rather than a permanent, unchangeable policy, since a threshold like this is the kind of
thing that gets tuned over time as the library grows.

The exclusion list is doing a lot of the practical work here, carving out classes where a unit test would either be
low-value or effectively impossible to write meaningfully: AdvantageKit's generated ```...AutoLogged``` classes,
AspectJ's woven tracer output, vendor hardware wrappers like ```TalonFX``` and ```Pigeon2```, and
```LimelightHelpers```, none of which are 190's own logic to verify. What's left after those exclusions is the actual
application code, subsystem behavior, geometry helpers, gain and constraint math, which is exactly what the 100%
threshold applies to.

## Running In CI

Tests run inside the same ```wpilib/roborio-cross-ubuntu``` container used for [every other CI
check](./MAKING_CHANGES.md#ci-on-every-pull-request):

```yaml
- name: Run tests with coverage check
  run: |
    ./gradlew clean test jacocoTestCoverageVerification \
      --refresh-dependencies --no-daemon --stacktrace

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: |
      build/test-results
      build/reports/jacoco
```

Both the raw JUnit results and the Jacoco coverage report are uploaded as build artifacts on every run, pass or fail,
so a failed coverage check or a failed test can be inspected directly from the CI run itself without needing to
reproduce it locally first.
