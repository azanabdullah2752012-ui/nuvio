export const EXPANDED_CURRICULUM = {
  "9": {
    "Mathematics": {
      "Coordinate Geometry": {
        "difficulty": "Easy to Medium",
        "studyTime": "45 mins",
        "pyqPattern": "Mainly focused on plotting coordinates, identifying quadrants, and finding distances between coordinates (2-4 marks in CBSE term exams).",
        "overview": {
          "intro": "Coordinate Geometry acts as a bridge between algebra and geometry. It allows us to represent algebraic equations as lines and curves on a grid, and conversely, represent geometric shapes using numbers and coordinates.",
          "realWorld": "Every time you use Google Maps to share your live location, you are using coordinate geometry. GPS coordinates are exactly like x and y values on a global Cartesian plane, identifying your exact spot down to the millimeter.",
          "whyItMatters": "Without coordinate geometry, modern software, video game graphics (which render characters using vertex coordinates), and structural engineering designs would be impossible."
        },
        "concepts": [
          {
            "id": "cartesian-plane",
            "title": "The Cartesian Plane",
            "definition": "A two-dimensional surface formed by the intersection of two perpendicular number lines.",
            "explanation": "Developed by René Descartes, this system lets us specify any point on a flat sheet using an ordered pair of numbers. Imagine a completely blank wall—to tell someone exactly where to hang a picture, you can say '3 feet from the left wall, and 5 feet from the floor'. That is the Cartesian plane in action.",
            "memoryTrick": "Remember 'René Descartes' looked at a fly crawling on his ceiling and realized he could describe its exact position by its distance from two adjacent walls. The ceiling was the plane!",
            "commonMistake": "Confusing a coordinate plane with a simple list of points. A plane is a continuous space, not just isolated dots.",
            "visualType": "cartesian-grid"
          },
          {
            "id": "axes-origin",
            "title": "Axes and the Origin",
            "definition": "The horizontal (x-axis) and vertical (y-axis) coordinate lines, intersecting at the Origin (0, 0).",
            "explanation": "The horizontal axis is the x-axis, and the vertical axis is the y-axis. The point where they cross is called the origin (derived from 'start'). At this special point, no movement has occurred, so its coordinate is exactly (0,0).",
            "memoryTrick": "X is horizontal because 'x' is a cross-crossing letter lying wide, while 'Y' has a vertical stem reaching up to the sky.",
            "commonMistake": "Writing the y-coordinate first. The horizontal axis distance always comes first in the ordered pair (x, y).",
            "visualType": "axes-demo"
          },
          {
            "id": "quadrants",
            "title": "The Four Quadrants",
            "definition": "The four distinct regions of the Cartesian plane divided by the axes.",
            "explanation": "The perpendicular axes divide the plane into four quarters, called Quadrants, numbered counter-clockwise starting from the top-right:\n- **Quadrant I**: Top-Right (+, +)\n- **Quadrant II**: Top-Left (-, +)\n- **Quadrant III**: Bottom-Left (-, -)\n- **Quadrant IV**: Bottom-Right (+, -)",
            "memoryTrick": "Trace a large letter 'C' starting from Quadrant I, through II, III, and ending in IV. The curve of the 'C' shows the exact order of the quadrants!",
            "commonMistake": "Labeling quadrants in a clockwise direction. CBSE strictly follows the standard counter-clockwise notation.",
            "visualType": "quadrants-selector"
          },
          {
            "id": "distance-formula",
            "title": "The Distance Formula",
            "definition": "The algebraic formula used to find the straight-line distance between any two points on the plane.",
            "explanation": "Given two points P(x₁, y₁) and Q(x₂, y₂), the distance between them is the hypotenuse of a right-angled triangle. By applying the Pythagoras theorem, we derive:\n\n**Distance = √((x₂ - x₁)² + (y₂ - y₁)²)**",
            "memoryTrick": "It's just the Pythagoras theorem in disguise! (x₂ - x₁) is the horizontal base, and (y₂ - y₁) is the vertical height.",
            "commonMistake": "Subtracting x from y. Always subtract coordinates of the same axis (x with x, and y with y).",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Identifying Quadrants",
            "problem": "Identify the quadrant or axis for each of the following points: A(3, 4), B(-2, 5), C(-4, -3), D(5, -2), E(0, -6).",
            "solution": [
              "Recall the sign rules for quadrants: I (+,+), II (-,+), III (-,-), IV (+,-).",
              "For A(3, 4): Both x and y are positive (+, +). Thus, A lies in **Quadrant I**.",
              "For B(-2, 5): x is negative, y is positive (-, +). Thus, B lies in **Quadrant II**.",
              "For C(-4, -3): Both x and y are negative (-, -). Thus, C lies in **Quadrant III**.",
              "For D(5, -2): x is positive, y is negative (+, -). Thus, D lies in **Quadrant IV**.",
              "For E(0, -6): The x-coordinate is 0. Any point with x = 0 lies directly on the **y-axis** (negative y-direction)."
            ]
          },
          {
            "level": "Medium",
            "title": "Finding a Missing Coordinate",
            "problem": "If the distance between the points A(3, -1) and B(x, 2) is 5 units, find the possible values of x.",
            "solution": [
              "Write down the Distance Formula: d = √((x₂ - x₁)² + (y₂ - y₁)²)",
              "Substitute the given values: 5 = √((x - 3)² + (2 - (-1))²)",
              "Simplify the equation: 5 = √((x - 3)² + (3)²)",
              "Square both sides to remove the radical: 25 = (x - 3)² + 9",
              "Isolate the squared term: (x - 3)² = 16",
              "Take the square root of both sides: x - 3 = ±4",
              "Solve for both cases:\n  - Case 1: x - 3 = 4  =>  **x = 7**\n  - Case 2: x - 3 = -4 =>  **x = -1**",
              "Therefore, the possible values of x are **7 or -1**."
            ]
          },
          {
            "level": "HOTS",
            "title": "Geometrical Proof on Grid",
            "problem": "Prove that the points A(1, 1), B(-1, 5), and C(7, 9) form a right-angled triangle at B.",
            "solution": [
              "To prove it is a right triangle at B, we must show that AC² = AB² + BC² (Converse of Pythagoras Theorem).",
              "Calculate AB²:\n  AB² = (-1 - 1)² + (5 - 1)² = (-2)² + (4)² = 4 + 16 = **20**",
              "Calculate BC²:\n  BC² = (7 - (-1))² + (9 - 5)² = (8)² + (4)² = 64 + 16 = **80**",
              "Calculate AC²:\n  AC² = (7 - 1)² + (9 - 1)² = (6)² + (8)² = 36 + 64 = **100**",
              "Check the theorem: AB² + BC² = 20 + 80 = 100.",
              "Since AB² + BC² = AC² (100 = 100), the triangle ABC is indeed a **right-angled triangle** with the right angle at B."
            ]
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "The point whose abscissa is negative and ordinate is positive lies in which quadrant?",
            "options": ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"],
            "answer": "Quadrant II",
            "explanation": "Abscissa represents x (negative) and ordinate represents y (positive). The signature (-, +) belongs strictly to Quadrant II."
          },
          {
            "type": "assertion",
            "q": "Assertion: The point P(0, 4) lies on the y-axis.\nReason: The x-coordinate of any point lying on the y-axis is zero.",
            "options": [
              "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
              "Both Assertion and Reason are true but Reason is NOT the correct explanation.",
              "Assertion is true but Reason is false.",
              "Assertion is false but Reason is true."
            ],
            "answer": "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
            "explanation": "Since the x-coordinate of P is 0, it lies on the vertical axis (y-axis). The reason correctly defines why this is the case."
          },
          {
            "type": "hots",
            "q": "Find the coordinates of the point equidistant from three collinear points or a given grid layout where a garden is set at (1,1), (5,1), and (3,5). What geometric shape is formed?",
            "options": ["Equilateral Triangle", "Isosceles Triangle", "Right Triangle", "Scalene Triangle"],
            "answer": "Isosceles Triangle",
            "explanation": "Calculating distances: Side 1 = 4 units. Side 2 = √((3-1)² + (5-1)²) = √(4+16) = √20. Side 3 = √((3-5)² + (5-1)²) = √(4+16) = √20. Since two sides are equal (√20 = √20), it is an isosceles triangle."
          }
        ],
        "recap": [
          "**René Descartes** formalised the Cartesian plane coordinates.",
          "**X-axis** is horizontal, **Y-axis** is vertical. Intersection is **Origin (0,0)**.",
          "**Abscissa** = x-coordinate, **Ordinate** = y-coordinate.",
          "Signs: Q1 (+,+), Q2 (-,+), Q3 (-,-), Q4 (+,-).",
          "Distance Formula: **d = √((x₂ - x₁)² + (y₂ - y₁)²)**"
        ]
      }
    },
    "Science": {
      "Motion and its Representation": {
        "difficulty": "Medium",
        "studyTime": "50 mins",
        "pyqPattern": " CBSE heavily tests the three Equations of Motion numerically and requires students to construct velocity-time graphs (3-5 marks).",
        "overview": {
          "intro": "Motion is a change in position of an object over time relative to a reference point. In this chapter, we learn how to measure, plot, and predict exactly how things move.",
          "realWorld": "Autopilot systems in self-driving cars, spacecraft trajectories, and even sports analytics that track how fast a football is kicked all run on the equations of motion.",
          "whyItMatters": "This is the entry gate to physics. Understanding speed, acceleration, and graphs allows us to understand the mechanical laws that govern the entire universe."
        },
        "concepts": [
          {
            "id": "scalars-vectors",
            "title": "Scalars vs Vectors",
            "definition": "Scalars have only magnitude; Vectors have both magnitude and direction.",
            "explanation": "If a car travels 50 km, that is a **scalar quantity** (Distance) because we don't care which way it went. If the car travels 50 km *North*, that is a **vector quantity** (Displacement) because direction is specified.",
            "memoryTrick": "Scalar has an 'S' for **Size** (magnitude) only. Vector has a 'V' for **Velocity** which points in a direction.",
            "commonMistake": "Treating distance and displacement as always equal. If you run in a circle and return to the start, your distance is positive but displacement is exactly zero!",
            "visualType": "vector-vs-scalar"
          },
          {
            "id": "speed-velocity",
            "title": "Speed vs Velocity",
            "definition": "Speed is the rate of change of distance, while Velocity is the rate of change of displacement.",
            "explanation": "Speed tells us how fast an object is moving (scalar). Velocity tells us how fast *and* in what direction it is moving (vector). If you jog at 10 km/h, that is your speed. If you jog at 10 km/h East, that is your velocity.",
            "memoryTrick": "Speed is linked to Distance (S-D). Velocity is linked to Displacement (V-D).",
            "commonMistake": "Writing speed units without standard SI units (m/s). Always convert km/h to m/s by multiplying by 5/18.",
            "visualType": "formula-showcase"
          },
          {
            "id": "acceleration",
            "title": "Acceleration",
            "definition": "The rate of change of velocity with respect to time.",
            "explanation": "When you step on the gas pedal of a car, the car speeds up—this change in velocity over time is acceleration. If the velocity decreases, it is called **retardation** or **deceleration** (negative acceleration).",
            "memoryTrick": "Formula is a = (v - u) / t. Think: 'Vroom (v) minus Under-start (u) over Time'.",
            "commonMistake": "Forgetting that a slowing down object has a negative sign for acceleration in calculations.",
            "visualType": "acceleration-demo"
          },
          {
            "id": "equations-motion",
            "title": "Equations of Motion",
            "definition": "Three algebraic equations governing uniformly accelerated straight-line motion.",
            "explanation": "These are the absolute pillars of mechanics:\n1. **v = u + at** (Velocity-Time relation)\n2. **s = ut + ½at²** (Position-Time relation)\n3. **v² = u² + 2as** (Position-Velocity relation)\n*Where: u = initial velocity, v = final velocity, a = acceleration, t = time, s = distance/displacement.*",
            "memoryTrick": "Write them on a cheat-sheet and practice substitution. If time 't' is not given in the question, always use the 3rd equation!",
            "commonMistake": "Using these equations for non-uniform acceleration. They *only* apply when acceleration is constant.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Speed Unit Conversion",
            "problem": "A scooter travels at a speed of 54 km/h. Express this speed in meters per second (m/s).",
            "solution": [
              "To convert km/h to m/s, we multiply by the conversion factor 5/18.",
              "Calculation:\n  Speed = 54 * (5/18) m/s",
              "Simplify: 54 divided by 18 is 3.",
              "Speed = 3 * 5 = **15 m/s**.",
              "Therefore, 54 km/h is equivalent to 15 m/s."
            ]
          },
          {
            "level": "Medium",
            "title": "Using the First Equation of Motion",
            "problem": "A racing car starts from rest and accelerates uniformly at 4 m/s² for 10 seconds. Find its final velocity.",
            "solution": [
              "Identify the given parameters:\n  - Initial velocity (u) = 0 m/s (starts from rest)\n  - Acceleration (a) = 4 m/s²\n  - Time (t) = 10 s",
              "We need to find the final velocity (v). Use the 1st equation of motion: v = u + at",
              "Substitute the values: v = 0 + (4 * 10)",
              "Calculate: v = **40 m/s**.",
              "Therefore, the final velocity of the racing car is 40 m/s."
            ]
          },
          {
            "level": "HOTS",
            "title": "Two-Stage Deceleration Problem",
            "problem": "Brakes applied to a train moving at 90 km/h produce a uniform retardation of 0.5 m/s². How far will the train go before it is brought to rest?",
            "solution": [
              "Convert initial velocity (u) to SI units:\n  u = 90 km/h = 90 * (5/18) = 5 * 5 = **25 m/s**",
              "Identify other parameters:\n  - Final velocity (v) = 0 m/s (brought to rest)\n  - Acceleration (a) = -0.5 m/s² (negative because it is retardation)",
              "Choose the equation that connects u, v, a, and s without needing time: v² = u² + 2as",
              "Substitute the values: 0² = (25)² + 2 * (-0.5) * s",
              "Simplify: 0 = 625 - 1s",
              "Solve for s: s = **625 meters**.",
              "Therefore, the train will travel 625 meters before coming to a complete stop."
            ]
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "What does the slope of a distance-time graph represent?",
            "options": ["Acceleration", "Speed", "Force", "Displacement"],
            "answer": "Speed",
            "explanation": "Slope = Change in y / Change in x = Distance / Time = Speed."
          },
          {
            "type": "assertion",
            "q": "Assertion: Displacement can be zero even if the distance covered is not zero.\nReason: Displacement is a vector quantity and depends on initial and final points, while distance is a scalar representing the actual path length.",
            "options": [
              "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
              "Both Assertion and Reason are true but Reason is NOT the correct explanation.",
              "Assertion is true but Reason is false.",
              "Assertion is false but Reason is true."
            ],
            "answer": "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
            "explanation": "If an object travels along a closed circular path, it returns to its start (displacement = 0) but covers path length (distance > 0). The reason correctly explains that vector properties dictate displacement."
          },
          {
            "type": "hots",
            "q": "An object drops from a height of 20m. With what velocity will it strike the ground? (Take g = 10 m/s²)",
            "options": ["10 m/s", "20 m/s", "30 m/s", "40 m/s"],
            "answer": "20 m/s",
            "explanation": "u = 0, s = 20m, a = 10 m/s². v² = u² + 2as => v² = 0 + 2 * 10 * 20 = 400. v = √400 = 20 m/s."
          }
        ],
        "recap": [
          "**Scalars** (Distance, Speed) vs **Vectors** (Displacement, Velocity).",
          "**Acceleration** = Rate of change of velocity: a = (v - u) / t.",
          "Slope of **Distance-Time** = Speed. Slope of **Velocity-Time** = Acceleration.",
          "Area under **Velocity-Time Graph** = Distance / Displacement.",
          "The three equations: **v=u+at**, **s=ut+½at²**, **v²=u²+2as**."
        ]
      }
    },
    "English": {
      "How I Taught My Grandmother to Read": {
        "difficulty": "Easy",
        "studyTime": "35 mins",
        "pyqPattern": "Questions usually target the grandmother's determination, the role of a teacher, or the significance of the novel Kashi Yatre (3-4 marks).",
        "overview": {
          "intro": "Written by Sudha Murty, this touching story outlines how a grandmother's determination, paired with a child's teaching, breaks the chains of illiteracy in a rural Indian household.",
          "realWorld": "Illiteracy remains a major challenge worldwide. This story beautifully represents that learning has no age limit, and that education is the ultimate source of human dignity and self-reliance.",
          "whyItMatters": "It teaches us humility, respect for our elders, and the true joy of sharing knowledge. It shows that sometimes, even children can play the role of a guru to their grandparents."
        },
        "concepts": [
          {
            "id": "kashi-yatre",
            "title": "The Novel: Kashi Yatre",
            "definition": "A serialized Kannada novel by Triveni, acting as the narrative anchor of the story.",
            "explanation": "The novel tells the story of an old lady who wishes to visit Kashi (a holy city) but chooses to give all her savings to a poor orphan girl for her wedding instead. The grandmother, Krishtakka, identified deeply with this story because she, too, had never seen Kashi and found a reflection of her own soul in the protagonist's struggles.",
            "memoryTrick": "Kashi Yatre = 'Journey to Kashi'. The physical journey was missed, but the spiritual journey of sacrifice was realized.",
            "commonMistake": "Thinking the grandmother actually visited Kashi. She only read about it in the magazine and connected with its story.",
            "visualType": "literature-excerpt"
          },
          {
            "id": "determination",
            "title": "Power of Determination",
            "definition": "The grandmother's willpower to learn to read Kannada at sixty-two.",
            "explanation": "When the granddaughter went away to a wedding, the magazine arrived, but the grandmother was helpless and wept because she couldn't read the alphabet. Instead of giving up or wallowing in pity, she set a strict deadline (Dassara festival) to learn to read Kannada. Her willpower overcame her age.",
            "memoryTrick": "Age 62 is just a number. If you have the drive, any mountain can be climbed.",
            "commonMistake": "Describing the grandmother's reaction as mere curiosity. It was a deep yearning for independent existence.",
            "visualType": "character-analysis"
          },
          {
            "id": "student-teacher",
            "title": "Reversed Teacher-Student Role",
            "definition": "The touching boundary shift where a twelve-year-old child becomes the guru to her grandmother.",
            "explanation": "In traditional Indian culture, elders are respected, and youngsters bow to them. However, on the day of the Dassara festival, the grandmother bowed and touched her granddaughter's feet. She explained that she was not bowing to her granddaughter, but to the **teacher** who taught her with so much love and patience. A teacher deserves respect regardless of age.",
            "memoryTrick": "Guru-Shishya: The role of a teacher is sacred and goes beyond age or family standing.",
            "commonMistake": "Viewing the foot-touching as an ordinary gesture. It was a revolutionary act showing great humility and cultural depth.",
            "visualType": "literature-excerpt"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Grandmother's Regret",
            "problem": "Why did the grandmother feel so helpless when her granddaughter was away?",
            "solution": [
              "Identify the primary source of the grandmother's entertainment: listening to the serialized novel 'Kashi Yatre' read by her granddaughter.",
              "Explain what happened during the absence: The granddaughter was away at a wedding in a neighboring village.",
              "Describe the obstacle: The weekly magazine Karmaveera arrived with the next episode, but the grandmother was illiterate and could not read it.",
              "Summarize the emotion: She felt completely dependent, isolated, and helpless, realizing how disabling illiteracy truly is."
            ]
          },
          {
            "level": "Medium",
            "title": "The Meaning of the Foot-Touching",
            "problem": "What was the significance of the grandmother touching the narrator's feet?",
            "solution": [
              "Explain the cultural context: In India, elders do not touch the feet of younger individuals; it is normally the reverse.",
              "Describe the grandmother's reasoning: She stated that she was touching the feet of her **teacher**, not her young granddaughter.",
              "Highlight her philosophy: She believed that a teacher, who imparts knowledge and lights the lamp of wisdom, deserves complete reverence irrespective of age or relationship.",
              "State the outcome: It showed the grandmother's immense humility, gratitude, and high regard for education."
            ]
          },
          {
            "level": "HOTS",
            "title": "Character Analysis of Krishtakka",
            "problem": "Based on the text, write a character sketch demonstrating Krishtakka's progressive mindset.",
            "solution": [
              "**Determination & Grit**: At the age of 62, she decided to learn the Kannada alphabet, showing that age is never a barrier to learning.",
              "**Progressive Outlook**: Despite being raised in an era where girls' education was not prioritized, she valued literacy highly and ensured her granddaughter studied.",
              "**Humility & Wisdom**: She had no ego about learning from a 12-year-old child and publicly honored her as a teacher.",
              "**Empathetic Soul**: She cried when reading about the orphan girl in the novel, proving her compassionate nature."
            ]
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "What was the name of the weekly Kannada magazine in which the novel was published?",
            "options": ["Karmaveera", "Kannada Prabha", "Kashi Yatre", "Sudha"],
            "answer": "Karmaveera",
            "explanation": "The story explicitly states that the serialized novel Kashi Yatre was published weekly in the magazine Karmaveera."
          },
          {
            "type": "assertion",
            "q": "Assertion: The grandmother touched the feet of the narrator on the Dassara festival day.\nReason: She wanted to show gratitude to the guru who helped her achieve her goal of becoming literate.",
            "options": [
              "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
              "Both Assertion and Reason are true but Reason is NOT the correct explanation.",
              "Assertion is true but Reason is false.",
              "Assertion is false but Reason is true."
            ],
            "answer": "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
            "explanation": "The assertion is true, and the reason correctly explains that she touched her feet as a mark of respect for a teacher who taught her to read independently."
          },
          {
            "type": "hots",
            "q": "What does the grandmother's initial lack of schooling tell us about the societal attitude towards women's education in her youth?",
            "options": [
              "Women were actively discouraged because of lack of interest.",
              "Girls were expected to manage household chores and marry early instead of studying.",
              "Schools did not exist in villages.",
              "Only boys were allowed to work, so girls did not want to study."
            ],
            "answer": "Girls were expected to manage household chores and marry early instead of studying.",
            "explanation": "She notes that in those days, girls' education was not considered essential, and they were married off early and occupied with domestic duties."
          }
        ],
        "recap": [
          "**Krishtakka** (grandmother) regretted not going to school in her childhood.",
          "She loved the serialized novel **Kashi Yatre** by the popular writer Triveni.",
          "Illiteracy became painful when she couldn't read the novel's climax during her granddaughter's absence.",
          "Set a target to learn by **Dassara** and practiced letters diligently.",
          "Expressed gratitude by touching the **narrator's feet**, treating her as a Guru."
        ]
      }
    }
  }
};
