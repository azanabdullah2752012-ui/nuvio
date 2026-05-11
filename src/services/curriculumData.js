export const CURRICULUM_DATA = {
  "9": {
    "Mathematics": {
      "chapters": [
        {
          "title": "Coordinate Geometry",
          "summary": "The structured framework for describing exact physical locations using numbers, with roots in the Sindhu-Sarasvatī Civilisation.",
          "flashcards": [
            { "front": "What is the Origin?", "back": "The point of intersection of the x-axis and y-axis, with coordinates (0, 0)." },
            { "front": "Baudhāyana-Pythagoras Theorem", "back": "Used to find the distance between any two points in the xy-plane." },
            { "front": "Distance Formula", "back": "√((x₂ - x₁)² + (y₂ - y₁)²) used to measure the shift between two coordinates." },
            { "front": "Quadrant II Signature", "back": "Negative x-coordinate and positive y-coordinate (-, +)." },
            { "front": "Who formalised 'Zero'?", "back": "Brahmagupta (628 CE) formalised zero and negative numbers as algebraic entities." }
          ],
          "qna": [
            { "q": "What is the x-coordinate of a point on the y-axis?", "a": "The x-coordinate of any point on the y-axis is always 0." },
            { "q": "Does point Q(y, x) ever coincide with P(x, y)?", "a": "Yes, if and only if x = y." },
            { "q": "Who was the first to solve algebraic problems using geometry?", "a": "Ömar Khayyām (c. 1100 CE) interpreted algebraic problems in terms of coordinates in the plane." }
          ]
        },
        {
          "title": "Linear Polynomials",
          "summary": "Algebraic expressions of degree 1 that model linear growth and decay.",
          "flashcards": [
            { "front": "Definition of a Linear Polynomial", "back": "A polynomial where the highest power of the variable (degree) is 1." },
            { "front": "Linear Relationship Form", "back": "Represented as y = ax + b, where 'a' is the slope and 'b' is the y-intercept." },
            { "front": "What does a negative slope indicate?", "back": "Linear decay, where a quantity decreases by a constant amount over equal intervals." },
            { "front": "The y-intercept", "back": "The point (0, b) where the straight line cuts the y-axis." }
          ],
          "qna": [
            { "q": "What is the degree of a constant polynomial like 8?", "a": "The degree is 0, as it can be written as 8x⁰." },
            { "q": "How is linear growth represented on a graph?", "a": "By a straight line with a positive slope." },
            { "q": "Who proposed the identity a² = (a+b)(a-b) + b²?", "a": "Śhrīdharāchārya (750 CE) as a method to quickly compute squares." }
          ]
        },
        {
          "title": "The World of Numbers",
          "summary": "The evolution of counting from tally marks on bones to the complex real number line.",
          "flashcards": [
            { "front": "Ishango Bone Significance", "back": "A 20,000-year-old bone containing tally marks representing prime numbers (11, 13, 17, 19)." },
            { "front": "Brahmagupta's Fortune/Debt Law", "back": "A debt times a debt is a fortune (- × - = +)." },
            { "front": "Rational vs Irrational Decimals", "back": "Rational decimals terminate or repeat; irrational decimals are non-terminating and non-repeating." },
            { "front": "The Density Property", "back": "Between any two rational numbers, there are infinitely many more rational numbers." }
          ],
          "qna": [
            { "q": "Is √2 a rational number?", "a": "No, it is irrational. It cannot be expressed as a ratio p/q." },
            { "q": "What is Madhava's Infinite Series?", "a": "A series that unlocks the value of Pi (π) using an infinite sum of fractions." },
            { "q": "What is the absolute value of a rational number?", "a": "It represents its distance from 0 on the number line, always non-negative." }
          ]
        },
        {
          "title": "Algebraic Identities",
          "summary": "Mathematical rules for simplifying calculations and working with complex binomials/trinomials.",
          "flashcards": [
            { "front": "(a + b + c)² Identity", "back": "a² + b² + c² + 2ab + 2bc + 2ca" },
            { "front": "Identity vs Equation", "back": "An identity is true for ALL values of variables; an equation may only be true for specific values." },
            { "front": "(a + b)³ Expansion", "back": "a³ + 3a²b + 3ab² + b³" },
            { "front": "Factorisation of x² - y²", "back": "(x + y)(x - y)" }
          ],
          "qna": [
            { "q": "How can you visualize (a+b)² geometrically?", "a": "As a large square made of two smaller squares (a², b²) and two rectangles (ab)." },
            { "q": "What is the identity for x³ + y³ + z³ - 3xyz?", "a": "(x + y + z)(x² + y² + z² - xy - xz - yz)" }
          ]
        },
        {
          "title": "Circles",
          "summary": "The study of locus, chords, and the perfect symmetry of circular geometry.",
          "flashcards": [
            { "front": "Definition of a Circle", "back": "The set of all points on a plane equidistant from a given point (the centre)." },
            { "front": "What is a Chord?", "back": "A line segment connecting two points on a circle." },
            { "front": "The Diameter", "back": "A chord that passes through the centre of the circle." }
          ],
          "qna": [
            { "q": "What is the plural of axis?", "a": "Axes." },
            { "q": "What is the distance from the centre to any point on the circle called?", "a": "The radius." }
          ]
        },
        {
          "title": "Euclidean Geometry",
          "summary": "Introduction to the axioms and postulates that define flat-surface geometry.",
          "flashcards": [
            { "front": "Euclid's 1st Postulate", "back": "A straight line segment can be drawn joining any two points." },
            { "front": "Axiom vs Postulate", "back": "Axioms are general truths; postulates are specific to geometry." }
          ],
          "qna": [
            { "q": "What is a point in Euclidean terms?", "a": "That which has no part." }
          ]
        },
        {
          "title": "Lines and Angles",
          "summary": "Properties of parallel lines, transversals, and angle relationships.",
          "flashcards": [
            { "front": "Complementary Angles", "back": "Two angles whose sum is 90°." },
            { "front": "Supplementary Angles", "back": "Two angles whose sum is 180°." }
          ],
          "qna": [
            { "q": "What happens when a transversal intersects two parallel lines?", "a": "Corresponding angles are equal, and alternate interior angles are equal." }
          ]
        },
        {
          "title": "Triangles & Quadrilaterals",
          "summary": "Comprehensive analysis of polygons and their congruence/similarity properties.",
          "flashcards": [
            { "front": "SAS Congruence Rule", "back": "Side-Angle-Side: If two sides and the included angle of one triangle are equal to another." },
            { "front": "Parallelogram Property", "back": "Opposite sides are equal and opposite angles are equal." }
          ],
          "qna": [
            { "q": "What is the Angle Sum Property of a triangle?", "a": "The sum of the angles of a triangle is 180°." }
          ]
        }
      ]
    },
    "Science": {
      "chapters": [
        {
          "title": "Science Exploration",
          "summary": "How observations lead to models, and how symbols like 'c' help us understand the universe.",
          "flashcards": [
            { "front": "What is a Scientific Model?", "back": "A simplified way of looking at real systems that focuses only on what is most important." },
            { "front": "Why is 'c' used for speed of light?", "back": "It comes from the Latin word 'celeritas', meaning speed." },
            { "front": "Standard Unit of Mass", "back": "The Kilogram (kg), based on international agreements for fairness in daily life and trade." },
            { "front": "Meghnad Saha's Contribution", "back": "He simplified the study of stars by treating matter inside as a hot gas, connecting colour to temperature." }
          ],
          "qna": [
            { "q": "What happened in the airplane fuel miscalculation incident?", "a": "A flight ran out of fuel because ground crew used density in pounds (lb) instead of kilograms (kg), showing why SI units are critical." },
            { "q": "What is the difference between a Law and a Theory?", "a": "A Law describes a regular pattern (like Newton's Laws), whereas a Theory provides an explanation of WHY patterns occur (like Atomic Theory)." }
          ]
        },
        {
          "title": "Cell: The Building Block",
          "summary": "The fascinating world of cellular biology, from Robert Hooke's cork to the Fluid-Mosaic model.",
          "flashcards": [
            { "front": "Robert Hooke (1665)", "back": "The first person to observe and name 'cells' while examining a thin slice of cork." },
            { "front": "Selectively Permeable Membrane", "back": "A boundary that allows some substances to pass through while blocking others." },
            { "front": "Osmosis", "back": "The diffusion of water across a selectively permeable membrane from higher to lower water concentration." },
            { "front": "Mitochondria", "back": "The 'Powerhouse of the cell' that stores energy in the form of ATP." },
            { "front": "Mitosis vs Meiosis", "back": "Mitosis produces 2 identical daughter cells; Meiosis produces 4 gametes with half the DNA." }
          ],
          "qna": [
            { "q": "What happens to a cell in a Hypertonic solution?", "a": "The solute concentration outside is higher than inside, causing the cell to lose water and shrink." },
            { "q": "Who proposed that 'all cells arise from pre-existing cells'?", "a": "Rudolf Virchow in 1855, expanding the Cell Theory." },
            { "q": "What is the role of the Golgi apparatus?", "a": "It acts as the cell's post office, modifying, sorting, and packaging proteins for transport." }
          ]
        },
        {
          "title": "Tissues in Action",
          "summary": "How cells group together to form the engineering marvels of the human and plant body.",
          "flashcards": [
            { "front": "Apical Meristem", "back": "Meristematic tissue located at root and shoot tips that helps plants grow in length." },
            { "front": "Xylem vs Phloem", "back": "Xylem transports water/minerals; Phloem transports food prepared in leaves." },
            { "front": "Ligament vs Tendon", "back": "Ligaments connect bone to bone; Tendons connect muscle to bone." },
            { "front": "Neuron structure", "back": "Consists of a cell body, dendrites (receive signals), and an axon (carries messages)." }
          ],
          "qna": [
            { "q": "Why are plant and animal tissues different?", "a": "Plants are fixed (need support/rigidity) while animals move (need flexibility/locomotion)." },
            { "q": "What are the three types of muscles?", "a": "Skeletal (voluntary), Smooth (involuntary), and Cardiac (heart specific, tireless)." }
          ]
        },
        {
          "title": "Describing Motion Around Us",
          "summary": "The simplest kind of motion: Linear and circular, described using position, distance, speed, velocity, and acceleration.",
          "flashcards": [
            { "front": "Distance vs Displacement", "back": "Distance is the total path length; Displacement is the net change in position (magnitude and direction)." },
            { "front": "Average Velocity", "back": "Displacement divided by the time interval (rate of change of position)." },
            { "front": "Average Acceleration", "back": "The rate of change of velocity: (v - u) / t." },
            { "front": "Kinematic Equation 1 (Velocity)", "back": "v = u + at (Relates velocity, initial velocity, acceleration, and time)." },
            { "front": "Kinematic Equation 2 (Position)", "back": "s = ut + ½at² (Calculates displacement under constant acceleration)." },
            { "front": "Kinematic Equation 3 (Velocity-Position)", "back": "v² = u² + 2as (Relates final velocity to displacement without time)." },
            { "front": "Uniform Circular Motion", "back": "Motion in a circular path with constant speed; velocity changes continuously due to direction." }
          ],
          "qna": [
            { "q": "When is displacement zero if distance is not zero?", "a": "When an object returns to its starting point after a journey (e.g., swimming a full lap)." },
            { "q": "What does the slope of a position-time graph represent?", "a": "The magnitude of velocity (speed if moving in a straight line)." },
            { "q": "What does the area under a velocity-time graph represent?", "a": "The displacement of the object over that time interval." },
            { "q": "What was the 'Aryabhatiya' contribution to motion?", "a": "Established that speed is distance divided by time as early as the 5th century CE." }
          ]
        },
        {
          "title": "Exploring Mixtures & Separation",
          "summary": "From industrial processes like sugar production to life-saving medical tests like ORS and blood analysis.",
          "flashcards": [
            { "front": "Homogeneous vs Heterogeneous", "back": "Homogeneous (solutions) have uniform composition; Heterogeneous (suspensions) have visible, non-uniform particles." },
            { "front": "Concentration (% m/m)", "back": "(Mass of Solute / Mass of Solution) × 100." },
            { "front": "Crystallization", "back": "Separating a pure solid from a saturated solution by slow cooling (e.g., making candy sugar/mishri)." },
            { "front": "Distillation", "back": "Separating miscible liquids with a boiling point difference of at least 25°C." },
            { "front": "Sublimation", "back": "The transition of a solid directly into a vapour without passing through the liquid state (e.g., camphor, naphthalene)." },
            { "front": "Colloid", "back": "A mixture where particles (1-1000 nm) are uniformly dispersed and do not settle, showing the Tyndall effect." },
            { "front": "Tyndall Effect", "back": "The scattering of a beam of light by particles in a colloid or suspension, making the path visible." }
          ],
          "qna": [
            { "q": "Who developed the life-saving Oral Rehydration Solution (ORS)?", "a": "Indian paediatrician Dilip Mahalanabis, revolutionising treatment for dehydration." },
            { "q": "What is 'Mitti ka Ittar'?", "a": "A natural perfume from Kannauj produced using the traditional Deg-Bhapka distillation method." },
            { "q": "How does a paperfuge work?", "a": "A hand-powered centrifuge made from cardboard and string that can separate blood components in remote areas." },
            { "q": "What is the role of Alum (Fitkari) in water purification?", "a": "It acts as a coagulant, causing fine suspended particles to clump together and settle down." }
          ]
        },
        {
          "title": "How Forces Affect Motion",
          "summary": "Investigating the causes of motion through Newton's three laws, balanced forces, and the friction matrix.",
          "flashcards": [
            { "front": "Balanced vs Unbalanced Forces", "back": "Balanced forces result in zero net force (no change in motion); Unbalanced forces cause acceleration." },
            { "front": "Newton's First Law (Inertia)", "back": "An object resists changes to its state of rest or uniform motion unless acted on by a net force." },
            { "front": "Newton's Second Law Formula", "back": "F = ma (Force equals mass times acceleration)." },
            { "front": "The Newton (N)", "back": "The force that produces an acceleration of 1 m/s² on a 1 kg mass." },
            { "front": "Newton's Third Law", "back": "To every action, there is an equal and opposite reaction (acting on different objects)." },
            { "front": "Momentum", "back": "The product of an object's mass and its velocity (p = mv)." },
            { "front": "Friction Direction", "back": "Always acts in a direction opposite to the direction of motion or intended motion." }
          ],
          "qna": [
            { "q": "Why did the Vikram lander fire its engines in the direction of motion?", "a": "To exert a force opposite to its velocity, slowing it down for a soft landing on the Moon (Newton's 3rd Law)." },
            { "q": "What is 'Inertia'?", "a": "The inherent tendency of objects to resist any change in their state of rest or motion." },
            { "q": "How do airbags reduce injury in a car crash?", "a": "By increasing the time over which the velocity changes, thus reducing the magnitude of acceleration and the resulting force on the passenger." },
            { "q": "What happens if the net force on a moving object is zero?", "a": "The object continues to move with constant velocity in a straight line (Newton's 1st Law)." }
          ]
        },
        {
          "title": "Work, Energy & Simple Machines",
          "summary": "Exploring the capacity to do work, conservation of mechanical energy, and the building blocks of everyday machines.",
          "flashcards": [
            { "front": "Scientific Definition of Work", "back": "Work (W) = Force (F) × Displacement (s) in the direction of the force." },
            { "front": "Kinetic Energy Formula", "back": "K = ½mv² (Energy due to an object's motion)." },
            { "front": "Potential Energy Formula", "back": "U = mgh (Energy stored due to an object's position or height)." },
            { "front": "Conservation of Mechanical Energy", "back": "The sum of kinetic and potential energy remains constant in a system without external friction." },
            { "front": "Power (P)", "back": "The rate at which work is done (P = W / t), measured in Watts (W)." },
            { "front": "Mechanical Advantage", "back": "The ratio of the Load (force to be overcome) to the Effort (force applied)." },
            { "front": "Three Simple Machines", "back": "Pulley (changes force direction), Inclined Plane (reduces required force over distance), Lever (pivots on a fulcrum)." }
          ],
          "qna": [
            { "q": "Is work done when you push a rigid wall?", "a": "No, because there is no displacement (s = 0), so work done is zero." },
            { "q": "What is a 'Gharat' or 'Panchakki'?", "a": "A traditional Himalayan water mill that converts the potential energy of flowing water into kinetic energy to grind grain." },
            { "q": "Why are roads on hills built in gentle slopes?", "a": "They act as long inclined planes; a longer path (L) requires less effort force (F) to reach the same height (h)." },
            { "q": "What is Dark Energy?", "a": "A mysterious form of energy proposed by scientists to explain why the expansion of the Universe is accelerating." }
          ]
        }
