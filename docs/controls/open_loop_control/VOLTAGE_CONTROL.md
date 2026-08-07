# Voltage Control

[Percent output](./PERCENT_OUTPUT.md) commands a *fraction* of whatever the battery happens to be providing right
now. **Voltage control** commands an actual, specific number of volts instead, and lets the motor controller figure
out what duty cycle is needed to deliver it.

## Compensating for Battery Sag

A modern FRC motor controller (a TalonFX or SPARK) constantly measures its own input voltage. If it's told to
produce 6 volts and the battery is sitting at 12 volts, it uses a 50% duty cycle; if the battery has sagged to 9
volts under load, it automatically raises the duty cycle so 6 volts still comes out the other side. Commanding
`0.5` produces a *different* result depending on the battery; commanding `6 volts` produces the *same* result,
regardless of the battery, right up until the battery sags below the commanded voltage entirely (at which point
6 volts simply isn't available to give, no matter the duty cycle).

$$
\text{duty cycle} = \frac{V_{commanded}}{V_{battery}}
$$

## Why This Matters

Consistency is the entire point. A shooter flywheel commanded to "70% power" spins at a different speed on a fresh
battery than a drained one, right when consistent shot speed matters most, late in a match. The same flywheel
commanded to "10 volts" holds much closer to the same behavior throughout the whole match, since the controller is
actively compensating for exactly the voltage swings that made percent output unreliable in the first place.

Voltage control is still open loop, nothing is measuring whether 10 volts is actually the *right* number to produce
the outcome that's wanted, it's just a more consistent, more predictable version of "guess and hope." Getting from
"a consistent voltage" to "the *correct* voltage for a specific desired speed or acceleration" is exactly what
[Feedforward Models](./FEEDFORWARD.md) are for.
