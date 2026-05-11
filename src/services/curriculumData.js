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
          "title": "Matter in Our Surroundings",
          "summary": "Exploration of physical states of matter and their characteristics.",
          "flashcards": [
            { "front": "The Three States of Matter", "back": "Solid, Liquid, and Gas." },
            { "front": "Definition of Diffusion", "back": "The intermixing of particles of two different types of matter on their own." }
          ],
          "qna": [
            { "q": "Why does a desert cooler cool better on a hot dry day?", "a": "Evaporation causes cooling; higher temperature and lower humidity increase the rate of evaporation." }
          ]
        },
        {
          "title": "Is Matter Around Us Pure?",
          "summary": "Chemical classification of matter into elements, compounds, and mixtures.",
          "flashcards": [
            { "front": "Colloid", "back": "A heterogeneous mixture where particle size is intermediate between solution and suspension." }
          ],
          "qna": [
            { "q": "Difference between mixture and compound?", "a": "Mixtures are physically combined; compounds are chemically combined in fixed ratios." }
          ]
        }
      ]
    }
  }
};
