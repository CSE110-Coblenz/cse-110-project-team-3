force: `
When you push an object, you change its motion. The stronger the push, the faster its velocity changes. The heavier the object, the harder it is to change its motion. Newton's Second Law summarizes this:
F = ma
On a perfectly smooth (frictionless) horizontal surface, the only horizontal force is the push.
The acceleration a points in the same direction as the net force. A constant net force produces a constant acceleration, which means the velocity changes by the same amount every second.

Interpretation:
• If you keep the same force and double the mass, the acceleration becomes half as large.
• If you keep the same mass and double the force, the acceleration doubles.
`;

distance: `
Real surfaces are not perfectly smooth. Microscopic bumps and roughness create a friction force that opposes motion. When an object is sliding, the relevant force is the kinetic friction force:
F_fric = μₖ N

where
• μₖ is the coefficient of kinetic friction and measures how rough the contact is,
• N is the normal force, the force from the surface pushing up on the object.

For a block on a horizontal surface with no vertical acceleration, the normal force balances the weight:
N = m g     so      F_fric = μₖ m g

Direction: friction always acts opposite to the direction of motion or intended motion. If you push the block to the right, kinetic friction acts to the left.

In the horizontal direction, the net force becomes:
F_net = F_push - F_fric = m a

To obtain a target acceleration a, your push must both overcome friction and still provide additional net force:
F_push = m a + μₖ m g

Interpretation:
• Larger μₖ or larger m means more friction, so you must push harder.
• If you only match F_fric, the block moves with zero acceleration.
`;

friction: `
Consider a block that is already sliding on a rough horizontal surface. After a short push, you stop pushing. At that moment, the only horizontal force is kinetic friction, opposite to the motion.

The net horizontal force is: F_net = -F_fric = −μₖ m g
The negative sign indicates that the net force is opposite to the direction of motion. The acceleration is therefore constant and negative:
a = F_net / m = −μₖ g
This constant negative acceleration (a deceleration) gradually reduces the speed until the block stops.

For motion with constant acceleration, the kinematic relation
v² = v₀² + 2 a d
connects final speed v, initial speed v₀, acceleration a, and displacement d.

When the block finally stops, v = 0, so:
0 = v₀² + 2 (−μₖ g) d  ⇒  d = v₀² / (2 μₖ g)

Interpretation:
• Larger initial speed v₀ gives a longer stopping distance.
• Larger friction coefficient μₖ or larger gravity g gives a shorter stopping distance.
`;

gravity: `
Near the Earth's surface, gravity pulls all objects downward with approximately the same constant acceleration g ≈ 9.8 m/s²

This acceleration does not depend on the object's mass (if air resistance is negligible). A heavier object has more weight W = m g, but also more inertia; these two effects cancel, so the acceleration is the same for all objects.

The weight is the gravitational force:
W = m g
If we choose “upward” as the positive direction, the vertical acceleration is -g. The equations of motion for the vertical position y and vertical velocity v_y as functions of time are:

v_y(t) = v_{y0} - g t  
y(t) = y₀ + v_{y0} t - ½ g t²

Here:
• y₀ is the initial height,  
• v_{y0} is the initial vertical velocity (positive upward),  
• t is the time since launch.

Special case: dropped object (no initial vertical speed, v_{y0} = 0) from height h with the ground at y = 0:
y(t) = h - ½ g t²

Setting y(t) = 0 to find when it hits the ground gives:
0 = h - ½ g t²  ⇒  t = √(2h / g)
`;

projectile:`
A projectile launched from the ground with speed v₀ at an angle θ above the horizontal has an initial velocity vector that can be split into horizontal and vertical components:
• Horizontal component: v₀ₓ = v₀ cos θ
• Vertical component:   v₀ᵧ = v₀ sin θ

This decomposition is crucial because horizontal and vertical motions are affected by different forces:
• Horizontally, with no air resistance, there is no force, so there is no horizontal acceleration. The horizontal velocity is constant:
    x(t) = v₀ₓ t = v₀ cos θ · t
• Vertically, gravity acts downward with acceleration -g, so the vertical motion follows:
    vᵧ(t) = v₀ᵧ - g t  
    y(t) = v₀ᵧ t - ½ g t² = v₀ sin θ · t - ½ g t²

The combination of constant horizontal velocity and accelerated vertical motion produces a parabolic trajectory. The projectile rises until its vertical velocity becomes zero, then falls back down.

The time to reach maximum height occurs when vᵧ(t_top) = 0:
    0 = v₀ sin θ − g t_top  ⇒  t_top = (v₀ sin θ) / g
Substituting this into the vertical position gives the maximum height above the launch point:
    H_max = (v₀² sin² θ) / (2 g)

Interpretation:
• Larger launch speed v₀ or larger angle θ (up to 90°) increases the maximum height.  
• Only the vertical component v₀ᵧ affects how high the projectile goes; the horizontal component only affects how far it travels.
`;

trajectory: `
For a projectile launched from the origin (0, 0) with speed v₀ and angle θ, neglecting air resistance, we combine the horizontal and vertical motions.
• Horizontal motion:    x(t) = v₀ cos θ · t
• Vertical motion:      y(t) = v₀ sin θ · t - ½ g t²

To describe the trajectory y as a function of x, eliminate time. From the horizontal equation:
t = x / (v₀ cos θ)

Substitute into the vertical equation:
y(x) = v₀ sin θ · (x / (v₀ cos θ)) - ½ g · (x / (v₀ cos θ))²
which simplifies to
y(x) = x tan θ - (g x²) / (2 v₀² cos² θ)

This is the explicit equation of the parabolic path. Given a target point A(x_A, y_A), you can ask whether the projectile passes through it by checking if y(x_A) equals y_A. For fixed angle θ and gravity g, you can solve this equation for the required launch speed v₀ so that the trajectory goes through A.

Special case: if the projectile is launched and lands at the same height (y = 0), the horizontal range R can be found by setting y(t) = 0 for t ≠ 0:
R = (v₀² sin 2θ) / g

Interpretation:
• For fixed v₀, the range is maximal at θ = 45°.  
• For a fixed angle, increasing v₀ increases both maximum height and range.  
• To hit a point at a known distance and height, you must choose a pair (v₀, θ) that satisfies the trajectory equation.
`;

